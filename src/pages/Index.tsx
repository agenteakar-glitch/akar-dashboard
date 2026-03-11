import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { DonutChart } from "@/components/dashboard/DonutChart";
import { TopVehiculos } from "@/components/dashboard/TopVehiculos";
import { VendedoresTable } from "@/components/dashboard/VendedoresTable";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [highlightIA, setHighlightIA] = useState(false);
  const [periodo, setPeriodo] = useState('2026-03-09'); // Único mes con datos actualmente
  const { data, isLoading, error } = useDashboardData(periodo);

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

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          currentPeriod={periodo} 
          onPeriodChange={setPeriodo}
        />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-auto">
          {/* Fila 1 – KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
            ) : metrics ? (
              <>
                <KPICard
                  label="Total Consultas del Mes"
                  value={metrics.totalConsultas.toLocaleString()}
                  sparkData={[]} // No hay sparkdata real aún en el esquema provisto
                  accentColor="#4DD0E1"
                />
                <KPICard
                  label="Derivaciones Logradas"
                  value={metrics.totalDerivaciones.toLocaleString()}
                  sparkData={[]}
                  accentColor="#64B5F6"
                />
                <KPICard
                  label="Tasa de Conversión"
                  value={`${metrics.conversionRate}%`}
                  sparkData={[]}
                  accentColor="#1a80ff"
                />
                <KPICard
                  label="Leads No Derivados (IA)"
                  value={metrics.leadsNoDerivedByAI.toLocaleString()}
                  sparkData={[]}
                  accentColor="#e67700"
                />
              </>
            ) : null}
          </div>

          {/* Fila 2 – Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
            ) : metrics ? (
              <>
                <DonutChart
                  title="Consultas por Canal"
                  data={metrics.consultasPorCanal}
                  centerValue={metrics.totalConsultas.toLocaleString()}
                  centerLabel="consultas"
                />
                <DonutChart
                  title="Derivaciones: IA vs Manual"
                  data={metrics.derivacionesTipo}
                  centerValue={metrics.totalDerivaciones.toLocaleString()}
                  centerLabel="derivaciones"
                  onHoverSegment={(index) => setHighlightIA(index === 0)}
                />
                <TopVehiculos vehiculos={data.topVehiculos} />
              </>
            ) : null}
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
