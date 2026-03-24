import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Filter, Users } from "lucide-react"

interface DashboardFiltersProps {
  onDateChange?: (range: string) => void
  onStaffChange?: (staffId: string) => void
}

export function DashboardFilters({ onDateChange, onStaffChange }: DashboardFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex items-center gap-3 bg-card/40 backdrop-blur-3xl border border-white/5 px-6 py-4 rounded-2xl w-full md:w-auto">
        <Calendar className="h-5 w-5 text-primary" />
        <Select defaultValue="today" onValueChange={(val) => onDateChange?.(val || 'today')}>
          <SelectTrigger className="w-full md:w-[200px] border-none bg-transparent shadow-none focus:ring-0 text-white font-black uppercase tracking-widest text-[10px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-white">
            <SelectItem value="today" className="font-black text-[10px] uppercase tracking-widest focus:bg-primary/20">Aujourd'hui</SelectItem>
            <SelectItem value="week" className="font-black text-[10px] uppercase tracking-widest focus:bg-primary/20">Cette semaine</SelectItem>
            <SelectItem value="month" className="font-black text-[10px] uppercase tracking-widest focus:bg-primary/20">Ce mois</SelectItem>
            <SelectItem value="all" className="font-black text-[10px] uppercase tracking-widest focus:bg-primary/20">Global</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-3 bg-card/40 backdrop-blur-3xl border border-white/5 px-6 py-4 rounded-2xl w-full md:w-auto">
        <Users className="h-5 w-5 text-primary" />
        <Select defaultValue="all" onValueChange={(val) => onStaffChange?.(val || 'all')}>
          <SelectTrigger className="w-full md:w-[200px] border-none bg-transparent shadow-none focus:ring-0 text-white font-black uppercase tracking-widest text-[10px]">
            <SelectValue placeholder="Staff" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-white">
            <SelectItem value="all" className="font-black text-[10px] uppercase tracking-widest focus:bg-primary/20">Tous les serveurs</SelectItem>
            <SelectItem value="active" className="font-black text-[10px] uppercase tracking-widest focus:bg-primary/20">Serveurs Actifs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1" />
      
      <div className="flex flex-col items-end justify-center">
        <div className="flex items-center gap-2 text-muted-foreground/40 text-[9px] font-black uppercase tracking-widest">
          <Filter className="h-3 w-3" />
          Filtres Actifs
        </div>
      </div>
    </div>
  )
}
