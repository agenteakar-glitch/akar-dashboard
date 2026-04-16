import os
import requests
import json
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

supabase_url = os.getenv("VITE_SUPABASE_URL")
supabase_key = os.getenv("VITE_SUPABASE_ANON_KEY")

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}"
}

def analyze_vendedores():
    print(f"Consultando tabla 'vendedores' en {supabase_url}...")
    try:
        response = requests.get(f"{supabase_url}/rest/v1/vendedores?select=*", headers=headers)
        response.raise_for_status()
        rows = response.json()
        
        print(f"Total de registros encontrados: {len(rows)}")
        
        if not rows:
            print("No se encontraron vendedores.")
            return

        # Verificación minuciosa de nombres
        seen_names = {}
        for row in rows:
            name = row.get("nombre_vendedor", "")
            # Representación hexadecimal para ver caracteres ocultos
            name_hex = name.encode('utf-8').hex()
            
            if name not in seen_names:
                seen_names[name] = {"count": 0, "hex": name_hex, "ids": []}
            
            seen_names[name]["count"] += 1
            seen_names[name]["ids"].append(row.get("id"))

        print("\n--- Conteo por Nombre Exacto ---")
        for name, info in seen_names.items():
            print(f"Nombre: '{name}' | Cantidad: {info['count']} | Hex: {info['hex']}")

        # Análisis de "Duplicados UI" (nombres que se ven iguales pero son diferentes strings)
        print("\n--- Análisis de Nombres Visualmente Similares (Potenciales Repetidos en UI) ---")
        normalized_map = {}
        for name in seen_names.keys():
            # Normalización: sin espacios al inicio/final, espacios internos colapsados
            norm = " ".join(name.split()).lower()
            if norm not in normalized_map:
                normalized_map[norm] = []
            normalized_map[norm].append(name)

        found_issues = False
        for norm, originals in normalized_map.items():
            if len(originals) > 1:
                found_issues = True
                print(f"\nPosible duplicado visual para: '{norm}'")
                for orig in originals:
                    print(f"  - Original: '{orig}' (Hex: {orig.encode('utf-8').hex()})")
        
        if not found_issues:
            print("No se encontraron nombres que se vean iguales pero sean diferentes strings.")

    except Exception as e:
        print(f"Error durante el análisis: {e}")

if __name__ == "__main__":
    analyze_vendedores()
