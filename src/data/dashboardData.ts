// TODO: reemplazar con llamada a Supabase Realtime
// Datos ficticios pero realistas para Akar Automotores

export const DASHBOARD_DATA = {
  currentMonth: "Marzo 2026",

  // Fila 1 – KPIs
  kpis: {
    totalConsultas: 847,
    consultasPorCanal: { whatsapp: 512, instagram: 198, facebook: 137 },
    totalDerivaciones: 623,
    derivacionesAutomaticas: 471,
    derivacionesManuales: 152,
    conversionRate: 73.6,
    leadsNoDerivedByAI: 224,
    // Sparkline data (últimos 30 días)
    consultasSpark: [22,28,31,25,30,35,27,24,29,33,26,21,28,34,30,27,32,29,25,31,28,26,33,30,27,29,31,28,25,30],
    derivacionesSpark: [16,20,23,19,22,26,20,18,21,24,19,15,21,25,22,20,24,21,18,23,20,19,24,22,20,21,23,20,18,22],
    conversionSpark: [72,71,74,76,73,74,74,75,72,73,73,71,75,74,73,74,75,72,72,74,71,73,73,73,74,72,74,71,72,73],
    leadsNoDerivSpark: [6,8,8,6,8,9,7,6,8,9,7,6,7,9,8,7,8,8,7,8,8,7,9,8,7,8,8,8,7,8],
  },

  // Fila 2 – Charts
  consultasPorCanal: [
    { canal: "WhatsApp", valor: 512, color: "#4DD0E1" },
    { canal: "Instagram", valor: 198, color: "#64B5F6" },
    { canal: "Facebook", valor: 137, color: "#1a80ff" },
  ],

  derivacionesTipo: [
    { tipo: "Automáticas (IA)", valor: 471, color: "#4DD0E1" },
    { tipo: "Manuales", valor: 152, color: "#64B5F6" },
  ],

  topVehiculos: [
    { nombre: "Chevrolet Silverado HIGH COUNTRY", consultas: 127 },
    { nombre: "Chevrolet Tracker RS AT TURBO", consultas: 98 },
    { nombre: "Chevrolet Captiva PHEV", consultas: 84 },
  ],

  // Fila 3 – Vendedores
  vendedores: [
    {
      nombre: "Martín Gutiérrez",
      derivacionesIA: 68,
      leadsPerdidos: 4,
      tiempoRespuestaInicial: 8,   // minutos
      tiempoRespuestaConv: 3,      // minutos
    },
    {
      nombre: "Lucía Fernández",
      derivacionesIA: 82,
      leadsPerdidos: 2,
      tiempoRespuestaInicial: 5,
      tiempoRespuestaConv: 2,
    },
    {
      nombre: "Diego Romero",
      derivacionesIA: 54,
      leadsPerdidos: 9,
      tiempoRespuestaInicial: 18,
      tiempoRespuestaConv: 7,
    },
    {
      nombre: "Camila Torres",
      derivacionesIA: 73,
      leadsPerdidos: 3,
      tiempoRespuestaInicial: 6,
      tiempoRespuestaConv: 2,
    },
    {
      nombre: "Facundo López",
      derivacionesIA: 61,
      leadsPerdidos: 7,
      tiempoRespuestaInicial: 14,
      tiempoRespuestaConv: 5,
    },
    {
      nombre: "Valentina Ruiz",
      derivacionesIA: 45,
      leadsPerdidos: 11,
      tiempoRespuestaInicial: 22,
      tiempoRespuestaConv: 9,
    },
  ],
} as const;
