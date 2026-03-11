export type DashboardRow = {
  id: string;
  periodo: string;
  derivaciones_totales: number;
  derivaciones_por_ia: number;
  leads_perdidos_ia: number;
  leads_perdidos_vendedor: number;
  tiempo_respuesta_min: number | null;
  consultas_whatsapp: number;
  consultas_instagram: number;
  consultas_messenger: number;
  creado_en: string;
  actualizado_en: string;
};

export type VendedorRow = {
  id: string;
  chatwoot_id: number;
  nombre_vendedor: string;
  tiempo_primera_respuesta: number | null;
  tiempo_promedio_respuesta: number | null;
  creado_en: string;
  actualizado_en: string;
};

export type VehiculoSolicitadoRow = {
  id: string;
  periodo: string;
  marca: string;
  modelo: string;
  version: string | null;
  tipo: string | null;
  cantidad_consultas: number;
  creado_en: string;
};
