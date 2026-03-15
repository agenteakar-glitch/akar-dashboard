import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DonutChartProps {
  title: string;
  data: readonly { readonly canal?: string; readonly tipo?: string; readonly valor: number; readonly color: string }[];
  centerValue: string | number;
  centerLabel: string;
  onHoverSegment?: (index: number | null) => void;
  tooltipInfo?: string;
}

export function DonutChart({ title, data, centerValue, centerLabel, onHoverSegment, tooltipInfo }: DonutChartProps) {
  const isAllZeroes = data.every(d => Number(d.valor) === 0);
  
  const chartData = useMemo(() => {
    if (isAllZeroes) {
      return [{ valor: 1, color: "#e2e8f0" }]; // color muted fijo
    }
    return data.map(d => ({ ...d, valor: Number(d.valor) }));
  }, [data, isAllZeroes]);

  return (
    <div className="bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-4">
        <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
        {tooltipInfo && (
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger type="button" className="cursor-help text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <Info className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs">{tooltipInfo}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="valor"
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              strokeWidth={0}
              onMouseEnter={(_, index) => onHoverSegment?.(!isAllZeroes ? index : null)}
              onMouseLeave={() => onHoverSegment?.(null)}
              isAnimationActive={!isAllZeroes}
            >
              {chartData.map((entry, i) => (
                <Cell 
                  key={`cell-${i}`} 
                  fill={entry.color} 
                  className={isAllZeroes ? "" : "transition-opacity duration-200 hover:opacity-80 cursor-pointer"} 
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display text-2xl font-bold text-foreground">{centerValue}</span>
          <span className="text-xs text-muted-foreground font-body">{centerLabel}</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        {data.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{(entry as any).canal || (entry as any).tipo}</span>
            <span className="font-display font-semibold text-foreground">{entry.valor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
