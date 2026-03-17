import urllib.request
import json
import os

env_vars = {}
with open('.env', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, val = line.split('=', 1)
            env_vars[key] = val

supabase_url = env_vars.get("VITE_SUPABASE_URL")
supabase_key = env_vars.get("VITE_SUPABASE_ANON_KEY")

url = f"{supabase_url}/rest/v1/dashboard?periodo=eq.2026-03-09&select=*"

req = urllib.request.Request(url, headers={
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}"
})

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f"Error: {e}")
