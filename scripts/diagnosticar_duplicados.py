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

        # Análisis de duplicados por nombre exacto
        names_count = {}
        for row in rows:
            name = row.get("nombre_vendedor", "SIN NOMBRE")
            id_val = row.get("id")
            periodo = row.get("periodo", "N/A")
            
            if name not in names_count:
                names_count[name] = []
            names_count[name].append({"id": id_val, "periodo": periodo, "raw_name": f"'{name}'"})

        print("\n--- Análisis de Duplicados ---")
        duplicates_found = False
        for name, records in names_count.items():
            if len(records) > 1:
                duplicates_found = True
                print(f"\nVendedor: {name}")
                for r in records:
                    print(f"  - ID: {r['id']}, Periodo: {r['periodo']}")
        
        if not duplicates_found:
            print("No se encontraron registros con el mismo nombre exacto.")

        # Análisis de inconsistencias (espacios o capitalización)
        print("\n--- Análisis de Inconsistencias (Espacios/Capitalización) ---")
        normalized_names = {}
        for name in names_count.keys():
            norm = name.strip().lower()
            if norm not in normalized_names:
                normalized_names[norm] = []
            normalized_names[norm].append(name)
        
        inconsistencies_found = False
        for norm, originals in normalized_names.items():
            if len(originals) > 1:
                inconsistencies_found = True
                print(f"\nVariaciones para '{norm}':")
                for orig in originals:
                    print(f"  - '{orig}'")
        
        if not inconsistencies_found:
            print("No se encontraron inconsistencias de formato (espacios/mayúsculas).")

    except Exception as e:
        print(f"Error durante el análisis: {e}")

if __name__ == "__main__":
    analyze_vendedores()
