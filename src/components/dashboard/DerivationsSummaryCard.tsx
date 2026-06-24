import React from "react";
import { Info, Bot, User, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DerivationsSummaryCardProps {
  totalLeadsWhatsApp: number;
  derivacionesIA: number;
  derivacionesManuales: number;
  derivacionesTotales: number;
}

export function DerivationsSummaryCard({
  totalLeadsWhatsApp,
  derivacionesIA,
  derivacionesManuales,
  derivacionesTotales,
}: DerivationsSummaryCardProps) {
  
  const porcentajeIA = totalLeadsWhatsApp > 0 ? ((derivacionesIA / totalLeadsWhatsApp) * 100).toFixed(1) : "0.0";
  const porcentajeHumano = totalLeadsWhatsApp > 0 ? ((derivacionesManuales / totalLeadsWhatsApp) * 100).toFixed(1) : "0.0";
  const porcentajeTotal = totalLeadsWhatsApp > 0 ? ((derivacionesTotales / totalLeadsWhatsApp) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-6 xl:col-span-3 flex flex-col gap-4 sm:gap-6 border border-border/50">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Resumen de Derivaciones WhatsApp
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger type="button" className="cursor-help text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  <Info className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="max-w-xs">Comparativa del rendimiento de derivación entre la Inteligencia Artificial y los Gestores Humanos basados en los leads totales ingresados por WhatsApp.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Análisis detallado de conversión</p>
        </div>
        
        <div className="bg-secondary/50 px-4 py-2 rounded-xl flex items-center gap-3 border border-border/50">
          <span className="text-sm font-medium text-muted-foreground">Leads Totales (WA)</span>
          <span className="text-2xl font-bold text-foreground">{totalLeadsWhatsApp.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-3 lg:gap-4">
        
        {/* IA Stats */}
        <div className="bg-background rounded-xl p-3 sm:p-4 xl:p-5 border border-border/40 relative overflow-hidden group flex flex-col justify-center">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Bot className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-1.5 mb-2 text-black dark:text-white">
            <Bot className="w-4 h-4 text-[#4DD0E1] shrink-0" />
            <span className="text-xs lg:text-sm font-bold uppercase tracking-wider leading-tight">Por IA</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl lg:text-4xl xl:text-5xl font-black text-[#4DD0E1] mb-1">{porcentajeIA}%</span>
            <span className="text-xs xl:text-sm font-medium text-muted-foreground leading-tight">{derivacionesIA.toLocaleString()} leads derivados</span>
          </div>
        </div>

        {/* Human Stats */}
        <div className="bg-background rounded-xl p-3 sm:p-4 xl:p-5 border border-border/40 relative overflow-hidden group flex flex-col justify-center">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <User className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-1.5 mb-2 text-black dark:text-white">
            <User className="w-4 h-4 text-[#64B5F6] shrink-0" />
            <span className="text-xs lg:text-sm font-bold uppercase tracking-wider leading-tight">Por Humanos</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl lg:text-4xl xl:text-5xl font-black text-[#64B5F6] mb-1">{porcentajeHumano}%</span>
            <span className="text-xs xl:text-sm font-medium text-muted-foreground leading-tight">{derivacionesManuales.toLocaleString()} leads derivados</span>
          </div>
        </div>

        {/* Total Conversions */}
        <div className="bg-background rounded-xl p-3 sm:p-4 xl:p-5 border border-border/40 relative overflow-hidden group flex flex-col justify-center">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <CheckCircle2 className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-1.5 mb-2 text-black dark:text-white">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs lg:text-sm font-bold uppercase tracking-wider leading-tight line-clamp-1">Total Derivaciones</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl lg:text-4xl xl:text-5xl font-black text-primary mb-1">{porcentajeTotal}%</span>
            <span className="text-xs xl:text-sm font-medium text-muted-foreground leading-tight">{derivacionesTotales.toLocaleString()} leads en total</span>
          </div>
        </div>

      </div>
    </div>
  );
}
