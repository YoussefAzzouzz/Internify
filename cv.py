# python
import os
import sys
import json

# fail early with a helpful message if optional packages are missing
try:
    import fitz  # PyMuPDF
    import requests
except ImportError as exc:
    missing = exc.name if hasattr(exc, "name") else str(exc)
    print(json.dumps({
        "error": "Missing dependency",
        "message": f"Module {missing} not found. Install with: python -m pip install PyMuPDF requests"
    }))
    sys.exit(1)

import re

TECH_SKILLS = {
    "html", "css", "javascript", "python", "java", "sql",
    "react", "node.js", "docker", "kubernetes", "c++", "c#", "typescript",
    "flask", "django", "spring", "angular", "vue", "tensorflow"
}

NON_TECH_KEYWORDS = {
    "leadership", "communication", "teamwork", "management",
    "organization", "problem solving"
}

def extract_skills_with_ai(text):
    """Use Groq API (if GROQ_API_KEY is set) to extract skills; otherwise fallback."""
    api_key = "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"

    if not api_key:
        # No key -> fallback
        print("Warning: No GROQ_API_KEY found, using regex fallback", file=sys.stderr)
        return extract_skills_regex(text)

    prompt = f"""Analyze this resume and extract skills in two categories:

Technical skills reference: {', '.join(TECH_SKILLS)}
Non-technical skills reference: {', '.join(NON_TECH_KEYWORDS)}

Resume text:
{text[:3000]}

Return ONLY a JSON object with this structure:
{{"technical_skills": ["skill1", "skill2"], "non_technical_skills": ["skill1", "skill2"]}}"""

    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {"role": "system", "content": "You are a resume analyzer. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.1,
                "max_tokens": 1000
            },
            timeout=30
        )

        if resp.status_code == 200:
            content = resp.json()["choices"][0]["message"]["content"]
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                json_str = content[json_start:json_end]
                result = json.loads(json_str)
                return result.get("technical_skills", []), result.get("non_technical_skills", [])
            else:
                print("AI response did not contain JSON, falling back to regex", file=sys.stderr)
                return extract_skills_regex(text)
        else:
            # Print full response for debugging (status code 400 -> inspect body)
            print(f"API error: {resp.status_code}, response: {resp.text}", file=sys.stderr)
            return extract_skills_regex(text)

    except Exception as e:
        print(f"AI extraction error: {e}, using fallback", file=sys.stderr)
        return extract_skills_regex(text)

def extract_skills_regex(text):
    text = text.lower()
    tech = [skill for skill in TECH_SKILLS if re.search(r'\b' + re.escape(skill.lower()) + r'\b', text)]
    non_tech = [skill for skill in NON_TECH_KEYWORDS if re.search(r'\b' + re.escape(skill.lower()) + r'\b', text)]
    return tech, non_tech

def score_features(found_tech, found_non_tech):
    tech_score = min(1.0, len(found_tech) / len(TECH_SKILLS))
    non_tech_score = min(1.0, len(found_non_tech) / len(NON_TECH_KEYWORDS))
    return {
        "niveau_competences_techniques": round(tech_score, 4),
        "niveau_competences_non_techniques": round(non_tech_score, 4),
    }


def main(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        text = "".join(page.get_text() for page in doc)

        if not text.strip():
            print(json.dumps({"error": "No text extracted from PDF"}))
            return

        tech_skills, soft_skills = extract_skills_with_ai(text)
        features = score_features(tech_skills, soft_skills)

        response = {
            "skills": tech_skills + soft_skills,
            "features": features,
            "summary": text[:300]
        }

        print(json.dumps(response, indent=2))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main(sys.argv[1])
    else:
        print(json.dumps({"error": "No PDF path provided"}))
