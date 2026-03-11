import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'ERROR CRÍTICO: No se encontraron las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. ' +
    'Asegúrate de configurarlas en tu Dashboard de Netlify o Lovable (Settings > Environment Variables).'
  );
}

// Creamos el cliente; si faltan datos, cualquier llamada fallará pero no detendrá el renderizado inicial de la app
export const supabase = createClient(
  supabaseUrl || 'https://missing-url.supabase.co', 
  supabaseAnonKey || 'missing-key'
);
