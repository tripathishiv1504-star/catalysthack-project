from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from ai_extractor import extract_profile_from_text
from database import get_db, init_db
import os

app = FastAPI(title="VaaniAccess API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    text: str

def get_schemes_from_profile(profile: dict):
    conn = get_db()
    c = conn.cursor()
    
    # Base query to get all schemes
    c.execute("SELECT * FROM schemes")
    all_schemes = c.fetchall()
    
    # Score them based on matching criteria
    query = """
    SELECT s.*, COUNT(m.id) as match_score
    FROM schemes s
    LEFT JOIN match_criteria m ON s.id = m.scheme_id
    WHERE 
        (m.criteria_type = 'occupation' AND ? LIKE '%' || m.value || '%')
        OR (m.criteria_type = 'education' AND ? LIKE '%' || m.value || '%')
        OR (m.criteria_type = 'intent' AND ? LIKE '%' || m.value || '%')
    GROUP BY s.id
    ORDER BY match_score DESC
    """
    
    occ = profile.get('occupation') or "NONE"
    edu = profile.get('education') or "NONE"
    intt = profile.get('intent') or "NONE"
    
    c.execute(query, (occ, edu, intt))
    matched = c.fetchall()
    
    conn.close()
    
    results = []
    for row in matched:
        r = dict(row)
        r['documents'] = json.loads(r['documents'])
        r['steps'] = json.loads(r['steps'])
        results.append(r)
        
    return results

@app.on_event("startup")
def startup_event():
    db_path = os.path.join(os.path.dirname(__file__), 'schemes.db')
    if not os.path.exists(db_path):
        import seed
        seed.seed_data()

@app.post("/api/analyze")
def analyze_text(req: AnalyzeRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text is empty")
        
    profile = extract_profile_from_text(req.text)
    schemes = get_schemes_from_profile(profile)
    
    if not schemes:
        audio_msg = "Maaf karein, mujhe is jankari ke aadhar par koi yojana nahi mili. Kripya thoda aur vistaar se batayen."
    else:
        top_scheme = schemes[0]
        audio_msg = f"Aapki jankari ke anusar, aapke liye {top_scheme['name']} sabse sahi lag rahi hai."
        
    return {
        "extracted_profile": profile,
        "matched_schemes": schemes,
        "audio_message": audio_msg
    }

@app.get("/api/schemes")
def list_schemes():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM schemes")
    rows = c.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        r = dict(row)
        r['documents'] = json.loads(r['documents'])
        r['steps'] = json.loads(r['steps'])
        results.append(r)
    return {"schemes": results}
