import json
import os
from database import init_db, get_db

def seed_data():
    init_db()
    conn = get_db()
    c = conn.cursor()
    
    # clear existing
    c.execute('DELETE FROM match_criteria')
    c.execute('DELETE FROM schemes')
    
    json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src', 'data', 'schemes.json')
    if not os.path.exists(json_path):
        print("Error: schemes.json not found at", json_path)
        return

    with open(json_path, 'r') as f:
        schemes = json.load(f)
        
    for s in schemes:
        c.execute('''
            INSERT INTO schemes (id, name, category, description, documents, steps)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            s['id'], 
            s['name'], 
            s['category'], 
            s['description'], 
            json.dumps(s['documents']), 
            json.dumps(s['steps'])
        ))
        
        for criteria_type, values in s['match_criteria'].items():
            for v in values:
                c.execute('''
                    INSERT INTO match_criteria (scheme_id, criteria_type, value)
                    VALUES (?, ?, ?)
                ''', (s['id'], criteria_type, v.lower()))
                
    conn.commit()
    conn.close()
    print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()
