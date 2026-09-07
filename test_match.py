import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
from main import get_schemes_from_profile

profile = {
    "occupation": "student",
    "education": "college",
    "intent": "scholarship"
}
schemes = get_schemes_from_profile(profile)
print("Matched schemes:", [s['name'] for s in schemes])
