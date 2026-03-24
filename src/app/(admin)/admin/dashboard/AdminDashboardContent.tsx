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
        className="relative group overflow-hidden rounded-[2.5rem] p-8 md:p-12 border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl"
      >
        <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-primary opacity-[0.05] blur-[100px] pointer-events-none group-hover:opacity-[0.1] transition-opacity duration-1000" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="h-1.5 w-1.5 rounded-full bg-primary heartbeat-glow" />
                Network Live
              </div>
              <span className="text-muted-foreground text-[10px] font-bold tracking-tight uppercase underline decoration-primary/30">v2.0.26 Stratégie</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white uppercase leading-none">
              Super <span className="gold-gradient-text">Régie</span>
            </h1>
            <p className="max-w-xl text-muted-foreground text-lg leading-relaxed font-semibold">
              Système de contrôle orbital pour l'écosystème <span className="text-white">Ivoire Bar VIP</span>. Monitoring en temps réel des actifs stratégiques et flux transactionnels.
            </p>
          </div>
          
          <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
            <div className="flex flex-col items-end">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2">Status Système</p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-white uppercase tracking-tighter">Opérationnel</span>
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Galaxy Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { title: "Unités Actives", value: allEstablishments.length, icon: Building2, trend: "Expansion constante", color: "#C5A059", bg: "from-primary/10" },
          { title: "Volume MRR", value: `${mrr.toLocaleString()} F`, icon: TrendingUp, trend: "Croissance organique", color: "#10B981", bg: "from-emerald-500/10" },
          { title: "Cycles Trial", value: trial.length, icon: Zap, trend: "Conversion en cours", color: "#3B82F6", bg: "from-blue-500/10" },
          { title: "Validations", value: pending.length, icon: Clock, trend: pending.length > 0 ? "Action Immédiate" : "Flux Optimal", color: "#F97316", bg: "from-orange-500/10" },
        ].map((kpi, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="premium-card rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl transition-all duration-500 hover:-translate-y-2 border-b-4 group" style={{ borderBottomColor: kpi.color }}>
              <div className={`absolute -bottom-10 -right-10 h-32 w-32 bg-gradient-to-br ${kpi.bg} to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700`} />
              <CardHeader className="pb-4 relative z-10 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                    <kpi.icon className="h-7 w-7" style={{ color: kpi.color }} />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Live <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
                <CardDescription className="text-muted-foreground/40 font-black uppercase text-[10px] tracking-[0.3em]">{kpi.title}</CardDescription>
                <CardTitle className="text-4xl font-black text-white mt-1 tracking-tighter lowercase"><span className="uppercase">{kpi.value.toString().split(' ')[0]}</span> {kpi.value.toString().split(' ')[1] || ''}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-4 p-8">
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: kpi.color }}>{kpi.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Validation Strategic List */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="premium-card rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl h-full">
            <CardHeader className="flex flex-row items-center justify-between p-10 border-b border-white/5 bg-white/[0.02]">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-white text-2xl font-black uppercase tracking-tighter">Flux <span className="gold-gradient-text">D'Adhésion</span></CardTitle>
                  <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase heartbeat-glow">Urgent</div>
                </div>
                <CardDescription className="text-muted-foreground/60 text-xs font-semibold uppercase tracking-widest">Validation stratégique des nouvelles unités de la régie.</CardDescription>
              </div>
              <Button variant="ghost" className="text-primary hover:bg-primary/10 rounded-2xl group font-black text-[10px] uppercase tracking-widest h-12 px-6">
                Manager <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/5">
                      <TableHead className="text-muted-foreground/40 uppercase text-[10px] font-black tracking-widest pl-10 py-8">Plateforme / ID</TableHead>
                      <TableHead className="text-muted-foreground/40 uppercase text-[10px] font-black tracking-widest py-8">Commandant</TableHead>
                      <TableHead className="text-muted-foreground/40 uppercase text-[10px] font-black tracking-widest py-8">Statut Initial</TableHead>
                      <TableHead className="text-right text-muted-foreground/40 uppercase text-[10px] font-black tracking-widest pr-10 py-8">Protocole</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {pending.length === 0 ? (
                        <TableRow className="hover:bg-transparent border-none">
                          <TableCell colSpan={4} className="text-center py-32">
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex flex-col items-center gap-6"
                            >
                              <div className="h-20 w-20 rounded-[1.8rem] bg-white/5 flex items-center justify-center">
                                <Activity className="h-10 w-10 text-muted-foreground/20" />
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/20">Aucun protocole en attente</p>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        pending.map((est) => (
                          <TableRow key={est.id} className="border-white/5 hover:bg-white/[0.02] transition-all duration-500 group">
                            <TableCell className="pl-10 py-8">
                              <div className="flex items-center gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl group-hover:rotate-6">
                                  <Building2 className="h-7 w-7" />
                                </div>
                                <div className="">
                                  <p className="font-black text-white text-base group-hover:text-primary transition-colors uppercase tracking-tight">{est.name}</p>
                                  <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest mt-1">{est.location} • {est.type}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-8">
                              <p className="text-sm font-black text-white tracking-tight uppercase">{est.owner}</p>
                              <p className="text-[10px] text-muted-foreground/40 font-black tracking-widest mt-1">{est.phone}</p>
                            </TableCell>
                            <TableCell className="py-8">
                              <Badge className="border-primary/20 text-primary bg-primary/10 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-lg border">7 JOURS TRIAL</Badge>
                            </TableCell>
                            <TableCell className="text-right pr-10 py-8">
                              <div className="flex justify-end gap-3">
                                <Button 
                                  onClick={() => handleAction(est.id, est.name, 'Active')}
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6 font-black text-[10px] uppercase shadow-2xl shadow-primary/20 rounded-2xl transition-all active:scale-95 tracking-widest"
                                >
                                  Approuver
                                </Button>
                                <Button 
                                  onClick={() => handleAction(est.id, est.name, 'Suspended')}
                                  variant="ghost" 
                                  className="h-12 w-12 text-muted-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-2xl border border-white/5 transition-all"
                                >
                                  <XCircle className="h-6 w-6" />
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
          <Card className="premium-card rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl flex flex-col h-full">
            <CardHeader className="p-10 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-1">
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-xl">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl font-black uppercase tracking-tighter">Flux <span className="gold-gradient-text">SaaS</span></CardTitle>
                  <CardDescription className="text-muted-foreground/40 text-[10px] font-black uppercase tracking-[0.3em]">Performance orbitale</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 py-12 flex-1 relative">
              <div className="h-[300px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="orbitColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={15} 
                      fontStyle="" 
                    />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(10, 15, 30, 0.9)', 
                        border: '1px solid rgba(212, 175, 55, 0.2)', 
                        borderRadius: '24px', 
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(16px)'
                      }}
                      itemStyle={{ color: 'var(--primary)', fontWeight: '900', fontSize: '14px' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontSize: '10px', textTransform: 'uppercase', fontStyle: '', fontWeight: '900', letterSpacing: '0.1em' }}
                      cursor={{ stroke: 'rgba(212, 175, 55, 0.2)', strokeWidth: 2 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--primary)" 
                      strokeWidth={5} 
                      fillOpacity={1} 
                      fill="url(#orbitColor)" 
                      animationDuration={3000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6">
                <div className="p-7 rounded-[1.8rem] bg-white/[0.02] border border-white/5 group hover:border-primary/40 transition-all duration-500">
                  <p className="text-[9px] text-muted-foreground/30 uppercase font-black tracking-widest mb-3 flex items-center gap-2">
                    Dernière <Sparkles className="h-2.5 w-2.5 text-primary heartbeat-glow" />
                  </p>
                  {saasTransactions.length > 0 ? (
                    <div className="space-y-1">
                      <p className="text-xs font-black text-white truncate uppercase tracking-tighter">{(saasTransactions[0] as any).establishments?.name || 'Unité'}</p>
                      <p className="text-2xl font-black text-primary">{(saasTransactions[0] as any).amount.toLocaleString()} F</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground/20 font-black uppercase mt-2 tracking-widest">Néant</p>
                  )}
                </div>
                <div className="p-7 rounded-[1.8rem] bg-white/[0.02] border border-white/5 flex flex-col justify-center items-center gap-3 group hover:bg-primary/5 transition-all duration-500">
                   <p className="text-[9px] text-muted-foreground/30 uppercase font-black tracking-[0.2em] leading-none">Status Global</p>
                   <Badge className="w-fit bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black text-[9px] px-5 py-2 rounded-xl tracking-widest border">OPTIMAL</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
