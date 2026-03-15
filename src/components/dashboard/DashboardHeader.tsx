import { Car, ChevronDown } from "lucide-react";

interface DashboardHeaderProps {
  currentPeriod: string;
  onPeriodChange?: (period: string) => void;
}

export function DashboardHeader({ currentPeriod, onPeriodChange }: DashboardHeaderProps) {
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
            <button 
              className="inline-flex items-center gap-1 text-primary font-medium hover:underline capitalize"
              onClick={() => {
                // Aquí en el futuro se abrirá un Dropdown para seleccionar el mes.
                // Por ahora no cambia de fecha ya que solo se ven meses a partir de marzo 2026.
              }}
            >
              {formatPeriod(currentPeriod)}
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      <div />
    </header>
  );
}
