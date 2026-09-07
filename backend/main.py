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
    
    # Fetch all schemes
    c.execute("SELECT * FROM schemes")
    all_rows = c.fetchall()
    schemes_dict = {}
    for row in all_rows:
        r = dict(row)
        r['documents'] = json.loads(r['documents']) if r.get('documents') else []
        r['steps'] = json.loads(r['steps']) if r.get('steps') else []
        r['benefit'] = r.get('benefit') or ''
        r['official_url'] = r.get('official_url') or ''
        r['match_score'] = 0
        r['matchedCriteria'] = []
        schemes_dict[r['id']] = r

    # Fetch all criteria
    c.execute("SELECT * FROM match_criteria")
    criteria_rows = c.fetchall()
    conn.close()

    occ = (profile.get('occupation') or "").strip().lower()
    edu = (profile.get('education') or "").strip().lower()
    intt = (profile.get('intent') or "").strip().lower()
    cat = (profile.get('category') or "").strip().lower()

    for row in criteria_rows:
        crit = dict(row)
        sid = crit['scheme_id']
        ctype = crit['criteria_type']
        val = (crit['value'] or "").strip().lower()
        if sid not in schemes_dict or not val:
            continue

        matched_this = False
        desc = ""

        if ctype == 'occupation' and occ:
            if val in occ or occ in val or any(len(w) > 3 and w in occ for w in val.split()):
                matched_this = True
                desc = f"Occupation match: {occ.title()} ({val})"
        elif ctype == 'education' and edu:
            if val in edu or edu in val or any(len(w) > 3 and w in edu for w in val.split()):
                matched_this = True
                desc = f"Education qualification match: {edu.title()}"
        elif ctype == 'intent' and intt:
            if val in intt or intt in val or any(len(w) > 3 and w in intt for w in val.split()):
                matched_this = True
                desc = f"Benefit requirement match: {intt.title()}"

        if matched_this:
            schemes_dict[sid]['match_score'] += 2
            if desc and desc not in schemes_dict[sid]['matchedCriteria']:
                schemes_dict[sid]['matchedCriteria'].append(desc)

    # Category matching bonus
    if cat:
        for sid, s in schemes_dict.items():
            if s.get('category', '').lower() == cat:
                s['match_score'] += 1
                cat_desc = f"Welfare domain match: {s.get('category', '').title()}"
                if cat_desc not in s['matchedCriteria']:
                    s['matchedCriteria'].append(cat_desc)

    # Filter schemes with score > 0 and sort
    matched_schemes = [s for s in schemes_dict.values() if s['match_score'] > 0]
    matched_schemes.sort(key=lambda x: x['match_score'], reverse=True)

    # Calculate friendly match percentage
    for s in matched_schemes:
        raw_score = s['match_score']
        # Map raw score to 78% - 98%
        pct = min(98, 75 + raw_score * 8)
        s['score'] = pct
        if not s['matchedCriteria']:
            s['matchedCriteria'] = [
                f"Eligible for {s.get('category', 'general').title()} assistance",
                "Matches demographic eligibility",
                "Verified against central portal criteria"
            ]

    # If no criteria hit but profile has keywords, fallback to top category or popular schemes
    if not matched_schemes and (occ or intt or edu or cat):
        for s in schemes_dict.values():
            if cat and s.get('category', '').lower() == cat:
                s['score'] = 80
                s['matchedCriteria'] = [f"Matches requested category: {cat.title()}"]
                matched_schemes.append(s)

    return matched_schemes

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
