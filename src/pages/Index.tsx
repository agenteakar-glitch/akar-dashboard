import { useState, useEffect } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAvailablePeriods } from "@/hooks/useAvailablePeriods";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { DonutChart } from "@/components/dashboard/DonutChart";
import { TopVehiculos } from "@/components/dashboard/TopVehiculos";
import { VendedoresTable } from "@/components/dashboard/VendedoresTable";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [highlightIA, setHighlightIA] = useState(false);
  const { data: availablePeriods } = useAvailablePeriods();
  const [periodo, setPeriodo] = useState<string>('');

  useEffect(() => {
    if (availablePeriods && availablePeriods.length > 0 && !periodo) {
      setPeriodo(availablePeriods[0]); // El más reciente por defecto
    }
  }, [availablePeriods, periodo]);

  const { data, isLoading: isDashboardLoading, error } = useDashboardData(periodo || '2026-03-09');
  const isLoading = isDashboardLoading || !periodo;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error al cargar los datos</h2>
          <p className="text-muted-foreground">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics;

  const renderKPIs = () => metrics ? (
    <>
      <KPICard
        label="Leads recibidos por la ia (whatsapp)"
        value={metrics.leadsRecibidosIA.toLocaleString()}
        accentColor="#4DD0E1"
        tooltipInfo="Total de leads que se registraron este mes y fueron atendidos por la IA."
      />
      <KPICard
        label="Derivaciones WhatsApp"
        value={metrics.derivacionesWhatsApp.toLocaleString()}
        accentColor="#64B5F6"
        tooltipInfo="Cantidad de leads derivados para una asignación de vendedor"
      />
      <KPICard
        label="Tasa de Conversión"
        value={`${metrics.conversionRate}%`}
        accentColor="#1a80ff"
        tooltipInfo="Porcentaje de derivaciones exitosas logradas por la IA en base a todos los leads recibidos por whatsapp"
      />
      <KPICard
        label={<>Total Leads Perdidos <span className="font-bold text-foreground">humano</span></>}
        value={metrics.leadsPerdidosHumano.toLocaleString()}
        accentColor="#e67700"
        tooltipInfo="Total de leads no vendidos por un humano"
      />
      <KPICard
        label={<>Total Leads Perdidos <span className="font-bold text-foreground">IA</span></>}
        value={metrics.leadsPerdidosIA.toLocaleString()}
        accentColor="#e67700"
        tooltipInfo="Total de leads que luego de dos seguimientos hechos por la IA no lograron ser derivados a un vendedor."
      />
    </>
  ) : null;

  const renderCharts = () => metrics ? (
    <>
      <DonutChart
        title="Consultas por Canal"
        data={metrics.consultasPorCanal}
        centerValue={metrics.leadsTotales.toLocaleString()}
        centerLabel="recibidos"
        tooltipInfo="Del total de leads ingresados al crm, cuántos entraron en cada red social"
      />
      <DonutChart
        title="Derivaciones: IA vs Manual"
        data={metrics.derivacionesTipo}
        centerValue={metrics.derivacionesWhatsApp.toLocaleString()}
        centerLabel="totales"
        onHoverSegment={(index) => setHighlightIA(index === 0)}
        tooltipInfo="Muestra una comparativa entre leads que lograron ser derivados por la IA con éxito y leads que fueron derivados manualmente porque hubo un error"
      />
      <DonutChart
        title="Derivaciones IA (Seguimientos)"
        data={metrics.derivacionesIA}
        centerValue={(
          metrics.derivacionesTipo?.find((t: any) => t.tipo === "Automáticas (IA)")?.valor || 0
        ).toLocaleString()}
        centerLabel="por IA"
        tooltipInfo="Muestra el total de derivaciones logradas gracias a seguimientos y en qué número de seguimiento"
      />
    </>
  ) : null;

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          currentPeriod={periodo} 
          availablePeriods={availablePeriods || ['2026-03-09']}
          onPeriodChange={setPeriodo}
        />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-auto">
          {/* Diseño Responsivo (Pantallas < 1200px / < xl breakpoint) */}
          <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={`left-${i}`} className="h-[400px] w-full rounded-2xl" />)
              ) : renderCharts()}
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <>
                  {Array(5).fill(0).map((_, i) => <Skeleton key={`right-kpi-${i}`} className="h-32 w-full rounded-2xl" />)}
                  <Skeleton className="h-[300px] w-full rounded-2xl mt-6" />
                </>
              ) : (
                <>
                  {renderKPIs()}
                  <div className="pt-2">
                    <TopVehiculos vehiculos={data?.topVehiculos || []} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Diseño Original Escritorio (Pantallas >= 1280px / xl breakpoint) */}
          <div className="hidden xl:block space-y-6">
            <div className="grid grid-cols-5 gap-4">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => <Skeleton key={`kpi-desk-${i}`} className="h-32 w-full rounded-2xl" />)
              ) : renderKPIs()}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => <Skeleton key={`chart-desk-${i}`} className="h-64 w-full rounded-2xl" />)
              ) : (
                <>
                  {renderCharts()}
                  <TopVehiculos vehiculos={data?.topVehiculos || []} />
                </>
              )}
            </div>
          </div>

          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-2xl" />
          ) : (
            <VendedoresTable vendedores={data?.vendedores || []} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
