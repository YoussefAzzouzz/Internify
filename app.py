from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import mysql.connector
import json
from datetime import datetime
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
# ---------------------------
# Init FastAPI and model
# ---------------------------
app = FastAPI(title="Login Embedding API")
model = SentenceTransformer("all-MiniLM-L6-v2")

# ---------------------------
# MySQL connection
# ---------------------------
conn = mysql.connector.connect(
    user="root",
    password="",
    database="Internify"
)
cursor = conn.cursor(dictionary=True)

# ---------------------------
# Request model
# ---------------------------
class LoginRequest(BaseModel):
    user_id: int
    client_ip: str
    lat: float | None = None
    lon: float | None = None
    timezone: str | None = None
    country: str | None = None
    country_code: str | None = None
    region: str | None = None
    region_name: str | None = None
    city: str | None = None

# ---------------------------
# Add login endpoint
# ---------------------------
@app.post("/add_login")
def add_login(req: LoginRequest):
    # Build semantic text
    login_text = (
        f"Login from {req.country or 'unknown'} "
        f"{req.region_name or req.region or 'unknown'} "
        f"{req.city or 'unknown'} "
        f"timezone {req.timezone or 'unknown'} "
        f"IP {req.client_ip or 'unknown'}"
    )

    # Compute embedding
    embedding = model.encode(login_text).tolist()
    embedding_json = json.dumps(embedding)

    # Store in MySQL
    cursor.execute("""
        INSERT INTO login_attempt
        (user_id, client_ip, lat, lon, timezone, country, country_code,
         region, region_name, city, login_text, embedding, attempt_time)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        req.user_id, req.client_ip, req.lat, req.lon, req.timezone,
        req.country, req.country_code, req.region, req.region_name,
        req.city, login_text, embedding_json, datetime.utcnow()
    ))
    conn.commit()
    
    return {
        "message": "Login saved with embedding",
        "user_id": req.user_id,
        "login_text": login_text
    }

# ---------------------------
# Query similar logins
# ---------------------------
@app.post("/query_similar")
def query_similar(req: LoginRequest, top_k: int = 5):
    # Compute embedding for query
    query_text = (
        f"Login from {req.country or 'unknown'} "
        f"{req.region_name or req.region or 'unknown'} "
        f"{req.city or 'unknown'} "
        f"timezone {req.timezone or 'unknown'} "
        f"IP {req.client_ip or 'unknown'}"
    )
    query_embedding = model.encode(query_text)

    # Fetch user's past logins
    cursor.execute("SELECT id, login_text, embedding FROM login_attempt WHERE user_id=%s", (req.user_id,))
    rows = cursor.fetchall()

    # Track unique login_texts to skip duplicates
    seen_texts = set()
    similarities = []

    for row in rows:
        login_text = row['login_text']
        if login_text in seen_texts:
            continue  # skip duplicates
        seen_texts.add(login_text)

        emb = np.array(json.loads(row['embedding']))
        score = cosine_similarity([query_embedding], [emb])[0][0]
        similarities.append((score, row['id'], login_text))

    # Sort top K
    similarities.sort(reverse=True, key=lambda x: x[0])
    top = similarities[:top_k]

    return {
        "query": query_text,
        "user_id": req.user_id,
        "top_similar": [{"score": s[0], "id": s[1], "login_text": s[2]} for s in top]
    }



@app.post("/add_static_europe_logins_user4")
def add_static_europe_logins_user4():
    """
    Add 10 predefined login attempts from Europe for user_id 4, for testing.
    """
    static_logins = [
        {"user_id": 1, "client_ip": "88.12.34.1", "lat": 48.8566, "lon": 2.3522, "timezone": "Europe/Paris",
         "country": "France", "country_code": "FR", "region": "IDF", "region_name": "Île-de-France", "city": "Paris"},
        {"user_id": 1, "client_ip": "88.12.34.2", "lat": 50.8503, "lon": 4.3517, "timezone": "Europe/Brussels",
         "country": "Belgium", "country_code": "BE", "region": "BRU", "region_name": "Brussels-Capital", "city": "Brussels"},
        {"user_id": 1, "client_ip": "88.12.34.3", "lat": 51.5074, "lon": -0.1278, "timezone": "Europe/London",
         "country": "UK", "country_code": "GB", "region": "ENG", "region_name": "England", "city": "London"},
        {"user_id": 1, "client_ip": "88.12.34.4", "lat": 52.52, "lon": 13.405, "timezone": "Europe/Berlin",
         "country": "Germany", "country_code": "DE", "region": "BE", "region_name": "Berlin", "city": "Berlin"},
        {"user_id": 1, "client_ip": "88.12.34.5", "lat": 41.9028, "lon": 12.4964, "timezone": "Europe/Rome",
         "country": "Italy", "country_code": "IT", "region": "RM", "region_name": "Lazio", "city": "Rome"},
        {"user_id": 1, "client_ip": "88.12.34.6", "lat": 40.4168, "lon": -3.7038, "timezone": "Europe/Madrid",
         "country": "Spain", "country_code": "ES", "region": "MD", "region_name": "Madrid", "city": "Madrid"},
        {"user_id": 1, "client_ip": "88.12.34.7", "lat": 59.3293, "lon": 18.0686, "timezone": "Europe/Stockholm",
         "country": "Sweden", "country_code": "SE", "region": "STH", "region_name": "Stockholm", "city": "Stockholm"},
        {"user_id": 1, "client_ip": "88.12.34.8", "lat": 60.1695, "lon": 24.9354, "timezone": "Europe/Helsinki",
         "country": "Finland", "country_code": "FI", "region": "HEL", "region_name": "Helsinki", "city": "Helsinki"},
        {"user_id": 1, "client_ip": "88.12.34.9", "lat": 55.6761, "lon": 12.5683, "timezone": "Europe/Copenhagen",
         "country": "Denmark", "country_code": "DK", "region": "CPH", "region_name": "Copenhagen", "city": "Copenhagen"},
        {"user_id": 1, "client_ip": "88.12.34.10", "lat": 45.4642, "lon": 9.19, "timezone": "Europe/Milan",
         "country": "Italy", "country_code": "IT", "region": "LO", "region_name": "Lombardy", "city": "Milan"},
    ]

    added = []

    for login in static_logins:
        # Build semantic text
        login_text = (
            f"Login from {login['country']} {login['region_name']} "
            f"{login['city']} timezone {login['timezone']} IP {login['client_ip']}"
        )
        # Compute embedding
        embedding = model.encode(login_text).tolist()
        embedding_json = json.dumps(embedding)

        # Insert into MySQL
        cursor.execute("""
            INSERT INTO login_attempt
            (user_id, client_ip, lat, lon, timezone, country, country_code,
             region, region_name, city, login_text, embedding, attempt_time)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            login["user_id"], login["client_ip"], login["lat"], login["lon"],
            login["timezone"], login["country"], login["country_code"],
            login["region"], login["region_name"], login["city"],
            login_text, embedding_json, datetime.utcnow()
        ))
        conn.commit()
        added.append(login_text)

    return {"message": "Static Europe logins added for user 4", "total_added": len(added), "logins": added}
