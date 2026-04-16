import { VendedorRow } from "@/types/database";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VendedoresTableProps {
  vendedores: VendedorRow[];
}

function formatTime(minutes: number): string {
  if (minutes >= 60) {
    const hours = minutes / 60;
    // Mostrar 1 decimal si no es entero
    const displayValue = hours % 1 === 0 ? hours.toFixed(0) : hours.toFixed(1);
    return `${displayValue} h`;
  }
  return `${minutes} min`;
}

function HeatBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  
  let barColor = "#4DD0E1"; // Azul (Menor a 30 min)
  
  if (value >= 60) {
    barColor = "#ef4444"; // Rojo (Mayor o igual a 1 hora)
  } else if (value >= 30) {
    barColor = "hsl(var(--warning))"; // Naranja (Entre 30 y 60 min)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
      <span className="font-display text-xs font-semibold text-foreground whitespace-nowrap">
        {formatTime(value)}
      </span>
    </div>
  );
}

export function VendedoresTable({ vendedores }: VendedoresTableProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 overflow-hidden">
      <h3 className="font-display text-sm font-semibold text-foreground mb-4">
        Métricas de Vendedores
      </h3>
      <div className="overflow-auto thin-scrollbar" style={{ maxHeight: 320 }}>
        <table className="w-full text-sm">
          <TooltipProvider>
            <thead>
              <tr className="text-left text-xs text-muted-foreground font-body border-b border-border">
                <th className="pb-3 pr-4 font-medium">Vendedor</th>
                <th className="pb-3 pr-4 font-medium">
                  <div className="flex items-center gap-1.5">
                    1ra Respuesta
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <button type="button" className="cursor-help transition-colors hover:text-foreground">
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs font-normal">Mide el tiempo promedio que tarda el vendedor en dar la primera respuesta a un lead derivado.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </th>
                <th className="pb-3 font-medium">
                  <div className="flex items-center gap-1.5">
                    Resp. Conversación
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <button type="button" className="cursor-help transition-colors hover:text-foreground">
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs font-normal">Mide el tiempo promedio de respuesta del vendedor durante toda la conversación.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </th>
              </tr>
            </thead>
          </TooltipProvider>
          <tbody>
            {(vendedores || []).map((v, i) => (
              <tr
                key={`${v.nombre_vendedor}-${i}`}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 pr-4 font-body font-semibold text-foreground">{v.nombre_vendedor}</td>
                <td className="py-3 pr-4">
                  <HeatBar value={v.tiempo_primera_respuesta || 0} max={30} />
                </td>
                <td className="py-3">
                  <HeatBar value={v.tiempo_promedio_respuesta || 0} max={30} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
