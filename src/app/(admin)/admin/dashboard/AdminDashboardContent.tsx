'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp,
  Clock, 
  Building2,
  Activity,
  Zap,
  XCircle,
  ChevronRight,
  CheckCircle2,
  Globe,
  Lock,
  ArrowUpRight
} from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminDashboardContent() {
  const context = useAppContext()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !context || context.loading) {
    return (
      <div className="p-8 md:p-12 space-y-12 bg-background min-h-screen">
        <div className="h-32 bg-white/5 rounded-[2.5rem] animate-pulse" />
        <div className="grid gap-8 md:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white/5 rounded-[2.5rem] animate-pulse" />)}
        </div>
      </div>
    )
  }

  const { allEstablishments = [], saasTransactions = [], validateEstablishment } = context
  const pending = allEstablishments.filter(e => e.status === 'Pending')
  const activeCount = allEstablishments.filter(e => e.status === 'Active').length
  
  const mrr = saasTransactions.reduce((acc: number, t: any) => acc + (Number(t.amount) || 0), 0)
  
  const revenueChartData = (saasTransactions || []).length > 0 
    ? saasTransactions
        .filter((t: any) => t.created_at && !isNaN(new Date(t.created_at).getTime()))
        .map((t: any) => ({
          date: format(new Date(t.created_at), 'dd/MM'),
          revenue: Number(t.amount) || 0
        })).reverse()
    : [
        { date: '01/03', revenue: 45000 },
        { date: '05/03', revenue: 52000 },
        { date: '10/03', revenue: 48000 },
        { date: '15/03', revenue: 61000 },
        { date: '20/03', revenue: 58000 },
        { date: '25/03', revenue: 75000 },
      ]

  const handleAction = async (id: string, name: string, status: 'Active' | 'Suspended' | 'Pending') => {
    try {
      await validateEstablishment(id, status)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 md:p-12 space-y-12 bg-background min-h-screen selection:bg-primary/20"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-12 bg-primary rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] leading-none">Régie Centrale SaaS</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Control <span className="gold-gradient-text">Center</span>
            </h1>
            <p className="text-muted-foreground/60 text-base font-black leading-relaxed max-w-2xl border-l-2 border-primary pl-6 uppercase tracking-tight">
              Supervision globale du réseau <span className="text-white">Ivoire VIP</span>. Management des flux financiers et validation des entités.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Activity className="h-6 w-6 text-emerald-500 animate-pulse" />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest leading-none mb-1">Status Réseau</p>
              <p className="text-xs font-black text-emerald-500 uppercase tracking-tight">Performances Optimales</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Établissements", value: activeCount, sub: "Entités Actives", icon: Building2, color: "text-primary" },
          { label: "MRR Plateforme", value: `${mrr.toLocaleString()} F`, sub: "Revenus Mensuels", icon: TrendingUp, color: "text-emerald-500" },
          { label: "En Attente", value: pending.length, sub: "Nouveaux Inscrits", icon: Clock, color: "text-amber-500" },
          { label: "Santé Système", value: "99.9%", sub: "Disponibilité", icon: Globe, color: "text-blue-400" },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="premium-card bg-card/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all duration-500 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">{kpi.label}</p>
                <div className={`h-14 w-14 rounded-2xl bg-white/5 ${kpi.color} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-all duration-500`}>
                  <kpi.icon className="h-7 w-7" />
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="text-3xl font-black text-white tracking-tighter">{kpi.value}</div>
                <div className="flex items-center gap-2 mt-2">
                   <div className={`h-1 w-1 rounded-full ${kpi.color === 'text-primary' ? 'bg-primary' : kpi.color.replace('text-', 'bg-')}`} />
                   <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">{kpi.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Validation Center */}
        <Card className="lg:col-span-4 premium-card bg-card/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-10 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black uppercase gold-gradient-text leading-none mb-2">Gate <span className="text-white">Keeper</span></CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Inscriptions en attente de validation stratégique</CardDescription>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
                 <Lock className="h-8 w-8 text-amber-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="pl-10 font-black uppercase text-[10px] tracking-widest text-muted-foreground/60 h-16">Entité</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground/60">Responsable</TableHead>
                    <TableHead className="text-right pr-10 font-black uppercase text-[10px] tracking-widest text-muted-foreground/60">Décision</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {pending.length === 0 ? (
                      <TableRow className="hover:bg-transparent border-none">
                        <TableCell colSpan={3} className="text-center py-32 text-muted-foreground">
                          <div className="flex flex-col items-center gap-6">
                            <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                              <CheckCircle2 className="h-12 w-12 text-emerald-500/20" />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Canal de validation libre</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pending.map((est, idx) => (
                        <motion.tr 
                          key={est.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group hover:bg-white/[0.02] border-b border-white/5 transition-colors"
                        >
                          <TableCell className="pl-10 py-8">
                            <div className="flex items-center gap-5">
                              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                                <Building2 className="h-7 w-7 text-primary/40 group-hover:text-primary transition-colors" />
                              </div>
                              <div>
                                <p className="font-black text-white uppercase tracking-tighter text-lg leading-tight">{est.name}</p>
                                <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest mt-1">{est.location} • Plan {est.plan}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-8">
                            <p className="font-black text-white/80 uppercase text-xs tracking-tight">{est.owner}</p>
                            <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest mt-1">{est.phone}</p>
                          </TableCell>
                          <TableCell className="py-8 pr-10 text-right">
                            <div className="flex justify-end gap-3">
                              <Button 
                                onClick={() => handleAction(est.id, est.name, 'Active')}
                                size="sm"
                                className="h-11 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-500/20"
                              >
                                Approuver
                              </Button>
                              <Button 
                                onClick={() => handleAction(est.id, est.name, 'Suspended')}
                                variant="outline" 
                                size="icon"
                                className="h-11 w-11 text-red-500 border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/20 rounded-xl"
                              >
                                <XCircle className="h-5 w-5" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Financial Flow */}
        <Card className="lg:col-span-3 premium-card bg-card/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
          <CardHeader className="p-10 border-b border-white/5 bg-white/[0.02]">
             <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black uppercase gold-gradient-text leading-none mb-2">SaaS <span className="text-white">Pulse</span></CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Courbe de croissance des abonnements</CardDescription>
                </div>
                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl group">
                   <Activity className="h-8 w-8 text-primary shadow-[0_0_15px_rgba(212,175,55,0.5)] group-hover:rotate-12 transition-transform" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-10 flex-1">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }}
                    dy={10} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderRadius: '24px',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(24px)',
                      padding: '20px'
                    }}
                    itemStyle={{ color: '#D4AF37', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', fontSize: '10px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#D4AF37" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorAdminRev)" 
                    dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4, stroke: '#0F172A' }}
                    activeDot={{ r: 8, stroke: '#D4AF37', strokeWidth: 2, fill: '#0F172A' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-12 space-y-6 pt-10 border-t border-white/5">
              <div className="flex items-center justify-between bg-white/[0.02] p-6 rounded-3xl border border-white/5 group hover:border-primary/20 transition-all">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Dernière Entrée</p>
                   <p className="text-xl font-black text-white uppercase tracking-tighter">
                      {saasTransactions.length > 0 ? (saasTransactions[0] as any).amount.toLocaleString() : "75,000"} F
                   </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                   <ArrowUpRight className="h-6 w-6" />
                </div>
              </div>
              <p className="text-[9px] text-center font-black uppercase tracking-[0.4em] text-muted-foreground/20">Flux Sécurisé Protocole 256-bit</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

