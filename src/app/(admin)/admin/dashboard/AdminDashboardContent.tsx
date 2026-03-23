'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp,
  Clock, 
  ShieldCheck,
  Building2,
  Activity,
  Zap,
  XCircle,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { motion, AnimatePresence, Variants } from "framer-motion"

export default function AdminDashboardContent() {
  const context = useAppContext()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !context || context.loading) {
    return (
      <div className="p-6 space-y-8 bg-background min-h-screen">
        <div className="h-32 bg-muted/50 rounded-3xl border border-border animate-pulse" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-muted/50 rounded-3xl border border-border animate-pulse" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-96 bg-muted/50 rounded-3xl border border-border animate-pulse" />
          <div className="h-96 bg-muted/50 rounded-3xl border border-border animate-pulse" />
        </div>
      </div>
    )
  }

  const { allEstablishments = [], saasTransactions = [], validateEstablishment } = context
  const pending = allEstablishments.filter(e => e.status === 'Pending')
  const trial = allEstablishments.filter(e => e.plan === 'Trial')
  
  const mrr = saasTransactions.reduce((acc: number, t: any) => acc + (Number(t.amount) || 0), 0)
  
  const revenueChartData = (saasTransactions || []).length > 0 
    ? saasTransactions
        .filter((t: any) => t.created_at && !isNaN(new Date(t.created_at).getTime()))
        .map((t: any) => ({
          date: format(new Date(t.created_at), 'dd/MM', { locale: fr }),
          revenue: Number(t.amount) || 0
        })).reverse()
    : []

  const handleAction = async (id: string, name: string, status: 'Active' | 'Suspended' | 'Pending') => {
    try {
      await validateEstablishment(id, status)
    } catch (e) {
      console.error(e)
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 md:p-10 space-y-10 bg-background text-foreground min-h-screen selection:bg-primary/20"
    >
      {/* Dynamic Master Header */}
      <motion.div 
        variants={itemVariants}
        className="relative group overflow-hidden rounded-[2.5rem] p-8 md:p-12 glass-card"
      >
        <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-primary opacity-[0.05] blur-[100px] pointer-events-none group-hover:opacity-[0.1] transition-opacity duration-1000" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="h-1.5 w-1.5 rounded-full bg-primary heartbeat-glow" />
                Network Live
              </div>
              <span className="text-muted-foreground text-[10px] font-bold tracking-tight uppercase italic underline decoration-primary/30">v2.0.26 Stratégie</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground uppercase italic leading-none">
              Super <span className="gold-gradient-text">Régie</span>
            </h1>
            <p className="max-w-xl text-muted-foreground text-lg leading-relaxed font-semibold">
              Système de contrôle orbital pour l'écosystème <span className="text-foreground">Ivoire Bar VIP</span>. Monitoring en temps réel des actifs stratégiques et flux transactionnels.
            </p>
          </div>
          
          <div className="flex items-center gap-6 p-5 rounded-[2rem] bg-secondary/50 border border-border backdrop-blur-2xl">
            <div className="flex flex-col items-end">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Status Système</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">Opérationnel</span>
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Galaxy Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { title: "Unités Actives", value: allEstablishments.length, icon: Building2, trend: "Expansion constante", color: "#C5A059", bg: "from-primary/10" },
          { title: "Volume MRR", value: `${mrr.toLocaleString()} F`, icon: TrendingUp, trend: "Croissance organique", color: "#10B981", bg: "from-emerald-500/10" },
          { title: "Cycles Trial", value: trial.length, icon: Zap, trend: "Conversion en cours", color: "#3B82F6", bg: "from-blue-500/10" },
          { title: "Validations", value: pending.length, icon: Clock, trend: pending.length > 0 ? "Action Immédiate" : "Flux Optimal", color: "#F97316", bg: "from-orange-500/10" },
        ].map((kpi, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="bg-card border-border group hover:border-primary/40 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 rounded-[2rem] overflow-hidden cursor-pointer h-full border-b-4" style={{ borderBottomColor: kpi.color }}>
              <div className={`absolute -bottom-10 -right-10 h-32 w-32 bg-gradient-to-br ${kpi.bg} to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700`} />
              <CardHeader className="pb-2 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-muted border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                    <kpi.icon className="h-6 w-6" style={{ color: kpi.color }} />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                    Live <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
                <CardDescription className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.2em]">{kpi.title}</CardDescription>
                <CardTitle className="text-4xl font-black text-foreground mt-1 tracking-tighter lowercase"><span className="uppercase">{kpi.value.toString().split(' ')[0]}</span> {kpi.value.toString().split(' ')[1] || ''}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-4">
                <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: kpi.color }}>{kpi.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Validation Strategic List */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-foreground text-2xl font-black italic uppercase">Flux <span className="text-primary">D'Adhésion</span></CardTitle>
                  <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase heartbeat-glow">Urgent</div>
                </div>
                <CardDescription className="text-muted-foreground text-sm font-semibold">Validation stratégique des nouvelles unités de la régie.</CardDescription>
              </div>
              <Button variant="ghost" className="text-primary hover:bg-primary/10 rounded-xl group font-black text-[10px] uppercase tracking-widest">
                Manager <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="text-muted-foreground uppercase text-[10px] font-black tracking-widest pl-8 py-6">Plateforme / ID</TableHead>
                      <TableHead className="text-muted-foreground uppercase text-[10px] font-black tracking-widest py-6">Commandant</TableHead>
                      <TableHead className="text-muted-foreground uppercase text-[10px] font-black tracking-widest py-6">Statut Initial</TableHead>
                      <TableHead className="text-right text-muted-foreground uppercase text-[10px] font-black tracking-widest pr-8 py-6">Protocole</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {pending.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={4} className="text-center py-20">
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex flex-col items-center gap-4 opacity-20"
                            >
                              <Activity className="h-12 w-12 text-primary" />
                              <p className="text-lg font-bold uppercase text-muted-foreground">Aucun protocole en attente</p>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        pending.map((est) => (
                          <TableRow key={est.id} className="border-border hover:bg-muted/30 transition-colors group">
                            <TableCell className="pl-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary border border-border flex items-center justify-center text-primary group-hover:scale-105 transition-all">
                                  <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                  <p className="font-black text-foreground text-base group-hover:text-primary transition-colors uppercase italic">{est.name}</p>
                                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{est.location} • {est.type}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-5">
                              <p className="text-sm font-bold text-foreground tracking-tight">{est.owner}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{est.phone}</p>
                            </TableCell>
                            <TableCell className="py-5">
                              <Badge variant="outline" className="border-orange-500/20 text-orange-600 bg-orange-50 text-[9px] font-black uppercase italic tracking-widest">7 JOURS TRIAL</Badge>
                            </TableCell>
                            <TableCell className="text-right pr-8 py-5">
                              <div className="flex justify-end gap-3">
                                <Button 
                                  onClick={() => handleAction(est.id, est.name, 'Active')}
                                  className="bg-primary hover:bg-primary/90 text-white h-10 px-6 font-black text-[10px] uppercase shadow-lg shadow-primary/20 rounded-xl transition-all active:scale-95"
                                >
                                  Approuver
                                </Button>
                                <Button 
                                  onClick={() => handleAction(est.id, est.name, 'Suspended')}
                                  variant="ghost" 
                                  className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-border"
                                >
                                  <XCircle className="h-5 w-5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Flow Orbital Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-full">
            <CardHeader className="p-8 border-b border-border">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-xl font-black uppercase italic">Flux <span className="text-primary">SaaS</span></CardTitle>
                  <CardDescription className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Performance mensuelle</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 py-10 flex-1 relative">
              <div className="h-[280px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="orbitColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94A3B8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10} 
                      fontStyle="italic" 
                    />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '16px', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }}
                      itemStyle={{ color: 'var(--primary)', fontWeight: '900', fontSize: '12px' }}
                      labelStyle={{ color: '#1E293B', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', fontStyle: 'italic' }}
                      cursor={{ stroke: 'rgba(197,160,89,0.2)', strokeWidth: 2 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--primary)" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#orbitColor)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-secondary/30 border border-border group hover:border-primary/40 transition-all cursor-crosshair">
                  <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                    Dernière <Sparkles className="h-2 w-2 text-primary heartbeat-glow" />
                  </p>
                  {saasTransactions.length > 0 ? (
                    <div className="space-y-1">
                      <p className="text-sm font-black text-foreground truncate italic uppercase tracking-tighter">{(saasTransactions[0] as any).establishments?.name || 'Unité'}</p>
                      <p className="text-xl font-black text-primary">{(saasTransactions[0] as any).amount.toLocaleString()} F</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-bold italic uppercase mt-2">Néant</p>
                  )}
                </div>
                <div className="p-5 rounded-3xl bg-secondary/30 border border-border flex flex-col justify-center items-center gap-2 group hover:bg-primary/5 transition-all">
                   <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">Status Global</p>
                   <Badge className="w-fit bg-emerald-100 text-emerald-700 border-none font-black text-[9px] px-3 shadow-sm">OPTIMAL</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
