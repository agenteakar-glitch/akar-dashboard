import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  title: string;
  data: readonly { readonly canal?: string; readonly tipo?: string; readonly valor: number; readonly color: string }[];
  centerValue: string;
  centerLabel: string;
  onHoverSegment?: (index: number | null) => void;
}

export function DonutChart({ title, data, centerValue, centerLabel, onHoverSegment }: DonutChartProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
      <h3 className="font-display text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="relative flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data as any[]}
              dataKey="valor"
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              strokeWidth={0}
              onMouseEnter={(_, index) => onHoverSegment?.(index)}
              onMouseLeave={() => onHoverSegment?.(null)}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} className="transition-opacity duration-200 hover:opacity-80 cursor-pointer" />
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
