interface KPICardProps {
  label: string;
  value: string;
  sparkData: readonly number[];
  accentColor?: string;
}

function MiniSparkline({ data, color }: { data: readonly number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="absolute right-4 bottom-4 opacity-20"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function KPICard({ label, value, sparkData, accentColor = "hsl(var(--primary))" }: KPICardProps) {
  return (
    <div className="relative overflow-hidden bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col justify-between min-h-[120px]">
      <span className="text-sm font-body text-muted-foreground">{label}</span>
      <span className="text-right font-display text-3xl font-bold tracking-tight text-foreground">
        {value}
      </span>
      <MiniSparkline data={sparkData} color={accentColor} />
    </div>
  );
}
