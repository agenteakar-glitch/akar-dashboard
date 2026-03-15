import React from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KPICardProps {
  label: React.ReactNode;
  value: string | number;
  sparkData?: readonly number[];
  accentColor?: string;
  tooltipInfo?: string;
}

function MiniSparkline({ data, color }: { data: readonly number[]; color: string }) {
  if (!data || data.length === 0) return null;
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

export function KPICard({ label, value, sparkData = [], accentColor = "hsl(var(--primary))", tooltipInfo }: KPICardProps) {
  return (
    <div className="relative overflow-hidden bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col justify-between min-h-[120px]">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-body text-muted-foreground">{label}</span>
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
      <span className="text-right font-display text-4xl font-bold tracking-tight text-foreground mt-4">
        {value}
      </span>
      <MiniSparkline data={sparkData} color={accentColor} />
    </div>
  );
}
