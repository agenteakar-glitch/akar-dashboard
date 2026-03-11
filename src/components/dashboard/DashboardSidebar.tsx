import {
  LayoutDashboard,
  Users,
  Car,
  MessageSquare,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: MessageSquare, label: "Consultas", active: false },
  { icon: Users, label: "Vendedores", active: false },
  { icon: Car, label: "Vehículos", active: false },
  { icon: BarChart3, label: "Reportes", active: false },
];

const bottomItems = [
  { icon: Settings, label: "Configuración" },
  { icon: HelpCircle, label: "Ayuda" },
];

export function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-gradient-to-b from-[hsl(var(--sidebar-bg-from))] to-[hsl(var(--sidebar-bg-to))] text-[hsl(var(--sidebar-foreground))]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <Car className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <span className="font-display text-lg font-bold tracking-tight text-primary-foreground">
            Akar
          </span>
          <span className="font-display text-sm block -mt-1 text-[hsl(var(--sidebar-foreground))]">
            Automotores
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${
                item.active
                  ? "bg-[hsl(var(--sidebar-hover))] text-primary"
                  : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-primary-foreground"
              }`}
          >
            <item.icon className={`w-[18px] h-[18px] ${item.active ? "text-primary" : ""}`} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-primary-foreground transition-colors"
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
