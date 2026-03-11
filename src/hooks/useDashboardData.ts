import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DashboardRow, VendedorRow, VehiculoSolicitadoRow } from '@/types/database';

export const useDashboardData = (periodo: string = '2025-03-01') => {
  return useQuery({
    queryKey: ['dashboardData', periodo],
    queryFn: async () => {
      // 1. Obtener datos del dashboard para el periodo
      // Usamos .maybeSingle() para evitar el error 406 PGRST116 si no hay datos
      const { data: dashboard, error: dError } = await supabase
        .from('dashboard')
        .select('*')
        .eq('periodo', periodo)
        .maybeSingle();

      if (dError) throw dError;

      // 2. Obtener vendedores
      const { data: vendedores, error: vError } = await supabase
        .from('vendedores')
        .select('*');

      if (vError) throw vError;

      // 3. Obtener vehiculos mas solicitados
      // Traemos una lista amplia para filtrar con flexibilidad en el frontend
      const { data: allVehiculos, error: vehError } = await supabase
        .from('vehiculos_solicitados')
        .select('*')
        .order('cantidad_consultas', { ascending: false });

      if (vehError) throw vehError;

      const [year, month] = periodo.split('-');

      // Filtro flexible: capturamos el mes tanto si está en la posición de mes como en la de día
      // o si la fecha de creación (creado_en) coincide con el mes buscado.
      const filteredVehiculos = (allVehiculos || []).filter(v => {
        const parts = v.periodo.split('-');
        const createdDate = new Date(v.creado_en);
        const createdMonth = (createdDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const createdYear = createdDate.getUTCFullYear().toString();

        const matchInPeriodo = (parts[0] === year && (parts[1] === month || parts[2] === month));
        const matchInCreated = (createdYear === year && createdMonth === month);

        return matchInPeriodo || matchInCreated;
      }).slice(0, 3);

      const d = dashboard as DashboardRow | null;

      // Procesar cálculos (según contexto.txt) con valores por defecto
      const consultas_whatsapp = d?.consultas_whatsapp || 0;
      const consultas_instagram = d?.consultas_instagram || 0;
      const consultas_messenger = d?.consultas_messenger || 0;
      const derivaciones_totales = d?.derivaciones_totales || 0;
      const derivaciones_por_ia = d?.derivaciones_por_ia || 0;
      const leads_perdidos_ia = d?.leads_perdidos_ia || 0;

      const consultas_totales = consultas_whatsapp + consultas_instagram + consultas_messenger;
      const derivaciones_manuales = derivaciones_totales - derivaciones_por_ia;
      
      const porcentaje_conversion = consultas_totales > 0 
        ? parseFloat(((derivaciones_totales / consultas_totales) * 100).toFixed(2)) 
        : 0;

      return {
        metrics: {
          totalConsultas: consultas_totales,
          totalDerivaciones: derivaciones_totales,
          conversionRate: porcentaje_conversion,
          leadsNoDerivedByAI: leads_perdidos_ia,
          consultasPorCanal: [
            { canal: "WhatsApp", valor: consultas_whatsapp, color: "#4DD0E1" },
            { canal: "Instagram", valor: consultas_instagram, color: "#64B5F6" },
            { canal: "Messenger", valor: consultas_messenger, color: "#1a80ff" },
          ],
          derivacionesTipo: [
            { tipo: "Automáticas (IA)", valor: derivaciones_por_ia, color: "#4DD0E1" },
            { tipo: "Manuales", valor: derivaciones_manuales, color: "#64B5F6" },
          ]
        },
        vendedores: (vendedores || []) as VendedorRow[],
        topVehiculos: filteredVehiculos as VehiculoSolicitadoRow[],
      };
    },
  });
};
