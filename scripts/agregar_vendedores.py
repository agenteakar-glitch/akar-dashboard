import os
import json
import urllib.request
from urllib.error import URLError, HTTPError
import time

def load_env(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    k, v = line.split('=', 1)
                    os.environ[k.strip()] = v.strip()
    except Exception as e:
        print(f"Error leyendo env: {e}")

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_env(env_path)

supabase_url = os.environ.get('VITE_SUPABASE_URL')
supabase_key = os.environ.get('VITE_SUPABASE_ANON_KEY')

if not supabase_url or not supabase_key:
    print("Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env")
    exit(1)

vendedores = [
    "Alvarez Kevin Nicolas (Ventas 0KM)",
    "Aravena Braian (Ventas 0KM)",
    "Ascagorta Maximiliano Ezequiel (Ventas PDA)",
    "Buttaccio Cristian (Ventas PDA)",
    "Camila Segovia",
    "Cazon Fernandez Pablo (Ventas USADOS)",
    "Elgueta Domingo Alberto (Ventas USADOS)",
    "Gabriel Alarcon (Ventas PDA)",
    "Guzman Cintia (Ventas PDA)",
    "Jose (Desarrollador)",
    "Mellado Segundo (Ventas 0KM)",
    "Montiel Patricio (Ventas 0KM)",
    "Ocampo Santiago (Ventas PDA)",
    "Vidal Ezequiel (Ventas 0KM)",
    "Villar Wildo (Ventas 0KM)"
]

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

print("Consultando vendedores existentes...")
try:
    req = urllib.request.Request(
        f"{supabase_url}/rest/v1/vendedores?select=nombre_vendedor,chatwoot_id",
        headers=headers
    )
    with urllib.request.urlopen(req) as response:
        existentes_data = json.loads(response.read().decode('utf-8'))
        existentes_nombres = {v['nombre_vendedor'] for v in existentes_data}
        existentes_chatwoot_ids = {v['chatwoot_id'] for v in existentes_data if v.get('chatwoot_id')}
except Exception as e:
    print(f"Error al obtener vendedores existentes: {e}")
    existentes_nombres = set()
    existentes_chatwoot_ids = set()

payload = []
base_id = 990000

def normalize_name(name):
    # Eliminar paréntesis, guiones y espacios extra para comparación
    import re
    res = re.sub(r'\s+', ' ', name)
    res = re.sub(r'\(.*\)', '', res)
    res = re.sub(r'-.*', '', res)
    return res.strip().lower()

# Normalizar nombres existentes
existentes_norm = {normalize_name(n) for n in existentes_nombres}

for i, nombre in enumerate(vendedores):
    if normalize_name(nombre) not in existentes_norm:
        while base_id in existentes_chatwoot_ids:
            base_id += 1
        
        payload.append({
            "nombre_vendedor": nombre,
            "chatwoot_id": base_id,
            "tiempo_primera_respuesta": None,
            "tiempo_promedio_respuesta": None
        })
        existentes_chatwoot_ids.add(base_id)
        base_id += 1

if not payload:
    print("Todos los vendedores de la lista ya están en la base de datos.")
    exit(0)

print(f"Intentando insertar {len(payload)} nuevos vendedores...")
try:
    req = urllib.request.Request(
        f"{supabase_url}/rest/v1/vendedores",
        data=json.dumps(payload).encode('utf-8'),
        headers=headers,
        method="POST"
    )
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"¡Éxito! Se insertaron {len(result)} vendedores.")
except HTTPError as e:
    error_body = e.read().decode('utf-8')
    print(f"HTTPError {e.code}: {error_body}")
except Exception as e:
    print(f"Error al insertar vendedores: {e}")
