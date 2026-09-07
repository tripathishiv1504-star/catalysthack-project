import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Try to use Gemini if API key is present
API_KEY = os.environ.get("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

def extract_profile_from_text(text: str) -> dict:
    """Extracts occupation, education, and intent from Hindi/Hinglish text."""
    if model:
        prompt = f"""
        Extract the following information from the user's input.
        The input might be in Hindi, English, or Hinglish.
        Return ONLY a raw JSON object with no markdown formatting.
        
        Fields:
        - occupation: The person's job or role (e.g. "student", "farmer", "street vendor", "business").
        - education: Educational status if mentioned (e.g. "college", "10th pass", "graduate").
        - intent: What they want (e.g. "scholarship", "loan", "financial help").
        
        User input: "{text}"
        
        JSON format:
        {{
            "occupation": "value or null",
            "education": "value or null",
            "intent": "value or null"
        }}
        """
        try:
            response = model.generate_content(prompt)
            raw = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(raw)
        except Exception as e:
            print("LLM Error:", e)
            # fallback to keyword
            pass
            
    # Robust Mock/Keyword fallback if no API key or LLM fails
    text_lower = text.lower()
    profile = {
        "occupation": None,
        "education": None,
        "intent": None
    }
    
    if "student" in text_lower or "chhatra" in text_lower or "vidyarthi" in text_lower:
        profile["occupation"] = "student"
    if "college" in text_lower or "degree" in text_lower or "graduation" in text_lower:
        profile["education"] = "college"
    if "scholarship" in text_lower or "fees" in text_lower:
        profile["intent"] = "scholarship"
        
    if "farmer" in text_lower or "kisan" in text_lower or "kheti" in text_lower:
        profile["occupation"] = "farmer"
    if "financial help" in text_lower or "paise" in text_lower or "sahayata" in text_lower:
        if not profile["intent"]: profile["intent"] = "financial help"
    
    if "vendor" in text_lower or "thela" in text_lower or "rehdi" in text_lower:
        profile["occupation"] = "street vendor"
        
    if "business" in text_lower or "loan" in text_lower or "vyapar" in text_lower:
        if not profile["intent"]: profile["intent"] = "loan"
        if "business" in text_lower or "vyapar" in text_lower:
            profile["occupation"] = "business"
            
    return profile
