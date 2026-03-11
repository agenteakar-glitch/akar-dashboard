import { VendedorRow } from "@/types/database";

interface VendedoresTableProps {
  vendedores: VendedorRow[];
}

function HeatBar({ value, max, good }: { value: number; max: number; good: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const isGood = value <= good;
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: isGood ? "#4DD0E1" : "hsl(var(--warning))",
          }}
        />
      </div>
      <span className="font-display text-xs font-semibold text-foreground">{value} min</span>
    </div>
  );
}

export function VendedoresTable({ vendedores }: VendedoresTableProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm p-6">
      <h3 className="font-display text-sm font-semibold text-foreground mb-4">
        Métricas de Vendedores
      </h3>
      <div className="overflow-auto thin-scrollbar" style={{ maxHeight: 320 }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground font-body border-b border-border">
              <th className="pb-3 pr-4 font-medium">Vendedor</th>
              <th className="pb-3 pr-4 font-medium">1ra Respuesta</th>
              <th className="pb-3 font-medium">Resp. Conversación</th>
            </tr>
          </thead>
          <tbody>
            {(vendedores || []).map((v, i) => (
              <tr
                key={v.id || i}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 pr-4 font-body font-semibold text-foreground">{v.nombre_vendedor}</td>
                <td className="py-3 pr-4">
                  <HeatBar value={v.tiempo_primera_respuesta || 0} max={30} good={10} />
                </td>
                <td className="py-3">
                  <HeatBar value={v.tiempo_promedio_respuesta || 0} max={15} good={4} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
