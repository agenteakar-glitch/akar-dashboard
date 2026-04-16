import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DashboardRow, VendedorRow, VehiculoSolicitadoRow } from '@/types/database';

export const useDashboardData = (periodo: string = '2025-03-01') => {
  return useQuery({
    queryKey: ['dashboardData', periodo],
    enabled: !!periodo,
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
        if (!v.periodo) return false;
        const parts = v.periodo.split('-');
        const createdDate = new Date(v.creado_en || v.periodo);
        const createdMonth = (createdDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const createdYear = createdDate.getUTCFullYear().toString();

        const matchInPeriodo = (parts[0] === year && (parts[1] === month || parts[2] === month));
        const matchInCreated = (createdYear === year && createdMonth === month);

        return matchInPeriodo || matchInCreated;
      });

      // Agrupar por vehiculo (por ejemplo, "Chevrolet Onix") y sumar consultas
      const vehiculosAgrupados = filteredVehiculos.reduce((acc, v) => {
        const key = `${v.marca}-${v.modelo}`;
        if (!acc[key]) {
          acc[key] = { ...v, cantidad_consultas: 0 };
        }
        acc[key].cantidad_consultas += Number(v.cantidad_consultas) || 1;
        return acc;
      }, {} as Record<string, VehiculoSolicitadoRow>);

      // Obtener el Top 3
      const topVehiculos = (Object.values(vehiculosAgrupados) as VehiculoSolicitadoRow[])
        .sort((a, b) => b.cantidad_consultas - a.cantidad_consultas)
        .slice(0, 3);

      const d = dashboard as DashboardRow | null;

      // Extraer campos nuevos y antiguos con valores por defecto
      const consultas_whatsapp = d?.consultas_whatsapp || 0;
      const consultas_instagram = d?.consultas_instagram || 0;
      const consultas_messenger = d?.consultas_messenger || 0;
      const derivaciones_totales = d?.derivaciones_totales || 0;
      const leads_perdidos_ia = d?.leads_perdidos_ia || 0;
      const leads_perdidos_vendedor = d?.leads_perdidos_vendedor || 0;
      const derivacion_primer_seguimientoIA = Number(d?.derivacion_primer_seguimientoIA) || 0;
      const derivacion_segundo_seguimientoIA = Number(d?.derivacion_segundo_seguimientoIA) || 0;
      const lead_recibidos_ia = Number(d?.lead_recibido_ia) || 0;

      // Nuevas métricas
      // 1. Total leads marcados con etiqueta perdidos
      const total_leads_perdidos = leads_perdidos_ia + leads_perdidos_vendedor;
      
      // 2. Leads recibidos en el mes (Suma de todos los canales)
      const leads_recibidos = consultas_whatsapp + consultas_instagram + consultas_messenger;

      // Recuperar IA vs Manual
      const derivaciones_por_ia = d?.derivaciones_por_ia || 0;
      const derivaciones_manuales = derivaciones_totales - derivaciones_por_ia;

      // 3. Tasa de conversión (leads atendidos por IA vs derivaciones por IA)
      const porcentaje_conversion = lead_recibidos_ia > 0 
        ? parseFloat(((derivaciones_por_ia / lead_recibidos_ia) * 100).toFixed(2)) 
        : 0;

      // 9. Métricas de vendedores: mostrar una sola vez con promedios
      type GroupedVendedor = VendedorRow & { count_primera: number; count_promedio: number };
      const vMap: Record<string, GroupedVendedor> = {};
      (vendedores || []).forEach(v => {
        // Normalizar nombre: eliminar paréntesis, guiones y espacios extra para agrupar mejor
        const key = v.nombre_vendedor
          .replace(/\s+/g, ' ')           // Colapsar espacios extra
          .replace(/\(.*\)/g, '')         // Eliminar paréntesis y su contenido
          .replace(/-.*/g, '')            // Eliminar guiones y lo que sigue
          .trim()
          .toLowerCase();

        if (!vMap[key]) {
          vMap[key] = { 
            ...v, 
            count_primera: v.tiempo_primera_respuesta !== null ? 1 : 0,
            count_promedio: v.tiempo_promedio_respuesta !== null ? 1 : 0,
            tiempo_primera_respuesta: v.tiempo_primera_respuesta || 0,
            tiempo_promedio_respuesta: v.tiempo_promedio_respuesta || 0
          };
        } else {
          if (v.tiempo_primera_respuesta !== null) {
            vMap[key].tiempo_primera_respuesta = (vMap[key].tiempo_primera_respuesta || 0) + v.tiempo_primera_respuesta;
            vMap[key].count_primera += 1;
          }
          if (v.tiempo_promedio_respuesta !== null) {
            vMap[key].tiempo_promedio_respuesta = (vMap[key].tiempo_promedio_respuesta || 0) + v.tiempo_promedio_respuesta;
            vMap[key].count_promedio += 1;
          }
        }
      });
      const processedVendedores = Object.values(vMap).map(v => ({
        ...v,
        tiempo_primera_respuesta: v.count_primera > 0 ? Math.round(v.tiempo_primera_respuesta / v.count_primera) : null,
        tiempo_promedio_respuesta: v.count_promedio > 0 ? Math.round(v.tiempo_promedio_respuesta / v.count_promedio) : null,
      }))
        .sort((a, b) => {
          // Obtener el valor más bajo disponible para cada uno (ignorando nulos)
          const getBestTime = (v: VendedorRow) => {
            const t1 = v.tiempo_primera_respuesta;
            const t2 = v.tiempo_promedio_respuesta;
            if (t1 === null && t2 === null) return Infinity;
            if (t1 === null) return t2 as number;
            if (t2 === null) return t1 as number;
            return Math.min(t1, t2);
          };

          const scoreA = getBestTime(a);
          const scoreB = getBestTime(b);

          if (scoreA === scoreB) {
            // Si empatan (ej. ambos Infinity), mantener orden alfabético
            return a.nombre_vendedor.localeCompare(b.nombre_vendedor);
          }
          
          return scoreA - scoreB;
        }) as VendedorRow[];

      return {
        metrics: {
          leadsTotales: leads_recibidos, // Suma total de todos los canales
          leadsRecibidosIA: lead_recibidos_ia, // Especificamente de whatsapp/ia
          leadsPerdidosHumano: leads_perdidos_vendedor,
          leadsPerdidosIA: leads_perdidos_ia,
          derivacionesWhatsApp: derivaciones_totales,
          conversionRate: porcentaje_conversion,
          derivacionesTipo: [
            { tipo: "Automáticas (IA)", valor: derivaciones_por_ia, color: "#4DD0E1" },
            { tipo: "Manuales", valor: derivaciones_manuales, color: "#64B5F6" },
          ],
          derivacionesIA: [
            { tipo: "Seguimiento 1", valor: derivacion_primer_seguimientoIA, color: "#4DD0E1" },
            { tipo: "Seguimiento 2", valor: derivacion_segundo_seguimientoIA, color: "#64B5F6" }
          ],
          consultasPorCanal: [
            { canal: "WhatsApp", valor: consultas_whatsapp, color: "#4DD0E1" },
            { canal: "Instagram", valor: consultas_instagram, color: "#64B5F6" },
            { canal: "Messenger", valor: consultas_messenger, color: "#1a80ff" },
          ],
        },
        vendedores: processedVendedores,
        topVehiculos: topVehiculos,
      };
    },
  });
};
