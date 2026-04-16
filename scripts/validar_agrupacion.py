import re

def normalize_name(name):
    # Simulación de la lógica en useDashboardData.ts
    res = re.sub(r'\s+', ' ', name)
    res = re.sub(r'\(.*\)', '', res)
    res = re.sub(r'-.*', '', res)
    return res.strip().lower()

test_names = [
    'Ocampo Santiago - Ventas PDA',
    'Ocampo Santiago (Ventas PDA)',
    'Montiel  Patricio -  Ventas 0KM',
    'Montiel Patricio (Ventas 0KM)',
    'Alvarez Kevin Nicolas - Ventas 0KM',
    'Alvarez Kevin Nicolas (Ventas 0KM)'
]

grouped = {}
for name in test_names:
    key = normalize_name(name)
    if key not in grouped:
        grouped[key] = []
    grouped[key].append(name)

print("--- Resultado de Agrupación con Nueva Lógica ---")
for key, originals in grouped.items():
    print(f"Key: '{key}' | Agrupados: {originals}")

if len(grouped) == 3:
    print("\n¡ÉXITO! Los 6 nombres se agruparon en 3 vendedores únicos.")
else:
    print(f"\nFALLO: Se obtuvieron {len(grouped)} grupos en lugar de 3.")
