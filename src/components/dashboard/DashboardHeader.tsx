import { Car, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  currentPeriod: string;
  availablePeriods?: string[];
  onPeriodChange?: (period: string) => void;
}

export function DashboardHeader({ currentPeriod, availablePeriods = [], onPeriodChange }: DashboardHeaderProps) {
  // Formatear periodo para visualización (ej: 2026-03-09 -> Marzo 2026)
  const formatPeriod = (p: string) => {
    try {
      const date = new Date(p + 'T00:00:00');
      return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(date);
    } catch {
      return p;
    }
  };

  return (
    <header className="flex items-center justify-between px-6 lg:px-8 py-4 bg-card border-b border-border/50">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Car className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <span className="font-display text-base font-bold tracking-tight text-foreground">Akar</span>
            <span className="font-display text-[11px] block -mt-0.5 text-muted-foreground">Automotores</span>
          </div>
        </div>

        <div className="h-6 w-px bg-border/60" />

        <div>
          <h1 className="font-display text-xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
            <span>Actividad de</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="inline-flex items-center gap-1 text-primary font-medium hover:underline capitalize outline-none"
                >
                  {formatPeriod(currentPeriod)}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              {availablePeriods.length > 0 && (
                <DropdownMenuContent align="start">
                  {availablePeriods.map((period) => (
                    <DropdownMenuItem 
                      key={period}
                      onClick={() => onPeriodChange?.(period)}
                      className={period === currentPeriod ? "bg-accent/50 font-medium capitalize" : "capitalize"}
                    >
                      {formatPeriod(period)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div />
    </header>
  );
}
