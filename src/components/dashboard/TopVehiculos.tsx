import { VehiculoSolicitadoRow } from "@/types/database";

interface TopVehiculosProps {
  vehiculos: VehiculoSolicitadoRow[];
}

export function TopVehiculos({ vehiculos }: TopVehiculosProps) {
  const max = vehiculos[0]?.cantidad_consultas || 1;

  return (
    <div className="bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
      <h3 className="font-display text-sm font-semibold text-foreground mb-6">
        Top 3 Vehículos Más Solicitados
      </h3>
      <div className="flex-1 flex flex-col justify-center gap-6">
        {(vehiculos || []).map((v, i) => (
          <div key={v.id || i} className="relative">
            {/* Faded rank number */}
            <span className="absolute -left-1 -top-3 font-display text-5xl font-bold text-muted/60 select-none leading-none">
              {i + 1}
            </span>
            <div className="ml-10">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-body text-sm font-semibold text-foreground">
                  {v.marca} {v.modelo}
                </span>
                <span className="font-display text-sm font-bold text-primary">{v.cantidad_consultas}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${(v.cantidad_consultas / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
