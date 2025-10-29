import os
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import re
import json
from typing import List, Dict
from dotenv import load_dotenv


# FastAPI app
app = FastAPI(title="Login Anomaly API")

# OpenAI client
load_dotenv(dotenv_path="AI.env")  # <-- specify your filename

endpoint = "https://elboniai.services.ai.azure.com/openai/v1/"
deployment_name = "Llama-3.3-70B-Instruct"
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("Missing OPENAI_API_KEY environment variable")

client = OpenAI(
    base_url=endpoint,
    api_key=api_key
)

# Request model
class AnomalyRequest(BaseModel):
    original_login: str
    similar_logins: List[str]

# Response model
class AnomalyResponse(BaseModel):
    login_text: str
    anomaly: int  # 0 = normal, 1 = suspicious
    reason: str
    raw_response: str

# Core detection function
def detect_anomaly(original_login_text: str, similar_logins_texts: List[str]) -> Dict:
    # Build the similar logins list
    similar_logins_str = "\n".join([f"{i}. {s}" for i, s in enumerate(similar_logins_texts, 1)])
    
    prompt = f"""Decide if 2FA is required for this login based on geographic risk.

Current: {original_login_text}
Past: {similar_logins_str}

CRITICAL RULES (automatic anomaly=1):
- Login from DIFFERENT COUNTRY than all past logins → REQUIRES 2FA

YOUR JUDGMENT NEEDED:
- New city in SAME country → assess if travel pattern makes sense
- Different IP range but same region → assess if legitimate ISP change
- Timezone shift within same country → consider if reasonable

Analyze the geographic/IP patterns and decide:
- anomaly=1 → Trigger 2FA (suspicious or critical risk)
- anomaly=0 → Allow without 2FA (normal behavior)

Reply ONLY with valid JSON (no explanation, no markdown):
{{"login_text": "{original_login_text}", "anomaly": 0, "reason": "brief"}}"""

    try:
        print(f"🔍 Calling LLM...")
        print(f"📝 Original: {original_login_text}")
        
        completion = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": "Security expert. Output valid JSON only. No explanations."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=150,
            timeout=30
        )

        text = completion.choices[0].message.content.strip()
        print(f"✅ LLM Response: {text}")
        
        # Clean markdown
        text = re.sub(r"```json\s*|\s*```", "", text, flags=re.IGNORECASE).strip()
        
        # Try parsing JSON
        try:
            result = json.loads(text)
            print(f"✅ JSON parsed successfully")
        except json.JSONDecodeError as je:
            print(f"⚠️ JSON parse failed: {je}")
            print(f"Raw text: {text}")
            
            # Extract with regex
            anomaly_match = re.search(r'"anomaly"\s*:\s*(\d+)', text)
            reason_match = re.search(r'"reason"\s*:\s*"([^"]*)"', text)
            
            result = {
                "login_text": original_login_text,
                "anomaly": int(anomaly_match.group(1)) if anomaly_match else 0,
                "reason": reason_match.group(1) if reason_match else "Parse failed",
                "raw_response": text
            }
        
        # Ensure required fields
        result.setdefault("login_text", original_login_text)
        result.setdefault("reason", "No reason")
        result.setdefault("raw_response", text)
        result.setdefault("anomaly", 0)
        
        print(f"🎯 Result: anomaly={result['anomaly']}, reason={result['reason'][:50]}...")
        return result

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {
            "login_text": original_login_text,
            "anomaly": 0,
            "reason": f"Error: {str(e)}",
            "raw_response": f"ERROR: {str(e)}"
        }

# FastAPI endpoint
@app.post("/detect_anomaly", response_model=AnomalyResponse)
def detect_anomaly_endpoint(req: AnomalyRequest):
    result = detect_anomaly(req.original_login, req.similar_logins)
    return result


