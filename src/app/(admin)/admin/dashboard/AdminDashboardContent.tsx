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
      <div className="p-6 space-y-8 bg-[#05050A] min-h-screen">
        <div className="h-32 bg-[#1A1A2E]/50 rounded-3xl border border-white/5 animate-pulse" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-[#1A1A2E]/50 rounded-3xl border border-white/5 animate-pulse" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-96 bg-[#1A1A2E]/50 rounded-3xl border border-white/5 animate-pulse" />
          <div className="h-96 bg-[#1A1A2E]/50 rounded-3xl border border-white/5 animate-pulse" />
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
      className="p-6 md:p-10 space-y-10 bg-[#05050A] text-[#F4E4BC] min-h-screen selection:bg-[#D4AF37]/30"
    >
      {/* Dynamic Master Header */}
      <motion.div 
        variants={itemVariants}
        className="relative group overflow-hidden rounded-[2.5rem] p-8 md:p-12 glass-card border-white/5 scanline"
      >
        <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-[#D4AF37] opacity-[0.03] blur-[100px] pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-1000" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] heartbeat-glow" />
                Network Live
              </div>
              <span className="text-white/20 text-[10px] font-medium tracking-tighter cursor-default hover:text-white/40 transition-colors uppercase italic underline decoration-[#D4AF37]/30">v2.0.26 Stratégie</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white uppercase italic leading-none">
              Super <span className="gold-gradient-text">Régie</span>
            </h1>
            <p className="max-w-xl text-[#A0A0B8] text-lg leading-relaxed font-medium">
              Système de contrôle orbital pour l'écosystème <span className="text-white">Ivoire Bar VIP</span>. Monitoring en temps réel des actifs stratégiques et flux transactionnels.
            </p>
          </div>
          
          <div className="flex items-center gap-6 p-4 rounded-[2rem] bg-black/40 border border-white/5 backdrop-blur-2xl">
            <div className="flex flex-col items-end">
              <p className="text-[10px] text-[#A0A0B8] uppercase font-black tracking-widest mb-1">Status Système</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Opérationnel</span>
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
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
          { title: "Unités Actives", value: allEstablishments.length, icon: Building2, trend: "Expansion constante", color: "#D4AF37", bg: "from-[#D4AF37]/10" },
          { title: "Volume MRR", value: `${mrr.toLocaleString()} F`, icon: TrendingUp, trend: "Croissance organique", color: "#4CAF50", bg: "from-[#4CAF50]/10" },
          { title: "Cycles Trial", value: trial.length, icon: Zap, trend: "Conversion en cours", color: "#3B82F6", bg: "from-[#3B82F6]/10" },
          { title: "Validations", value: pending.length, icon: Clock, trend: pending.length > 0 ? "Action Immédiate" : "Flux Optimal", color: "#F97316", bg: "from-[#F97316]/10" },
        ].map((kpi, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="glass-card border-white/5 group hover:border-[#D4AF37]/40 transition-all duration-500 hover:-translate-y-2 rounded-[2rem] overflow-hidden cursor-pointer h-full">
              <div className={`absolute -bottom-10 -right-10 h-32 w-32 bg-gradient-to-br ${kpi.bg} to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700`} />
              <CardHeader className="pb-2 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37]/10 transition-all duration-500">
                    <kpi.icon className="h-6 w-6" style={{ color: kpi.color }} />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-[#A0A0B8] uppercase tracking-tighter">
                    Live <div className="h-1 w-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                  </div>
                </div>
                <CardDescription className="text-[#A0A0B8] font-bold uppercase text-[10px] tracking-[0.2em]">{kpi.title}</CardDescription>
                <CardTitle className="text-4xl font-black text-white mt-1 tracking-tighter lowercase"><span className="uppercase">{kpi.value.toString().split(' ')[0]}</span> {kpi.value.toString().split(' ')[1] || ''}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: kpi.color }}>{kpi.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Validation Strategic List */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass-card border-white/5 rounded-[2.5rem] overflow-hidden h-full">
            <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-white text-2xl font-black italic uppercase">Flux <span className="text-[#D4AF37]">D'Adhésion</span></CardTitle>
                  <div className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-black uppercase heartbeat-glow">Urgent</div>
                </div>
                <CardDescription className="text-[#A0A0B8] text-sm font-medium">Validation stratégique des nouvelles unités de la régie.</CardDescription>
              </div>
              <Button variant="ghost" className="text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl group font-black text-[10px] uppercase tracking-widest">
                Manager <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/5">
                      <TableHead className="text-[#A0A0B8] uppercase text-[10px] font-black tracking-widest pl-8 py-6">Plateforme / ID</TableHead>
                      <TableHead className="text-[#A0A0B8] uppercase text-[10px] font-black tracking-widest py-6">Commandant</TableHead>
                      <TableHead className="text-[#A0A0B8] uppercase text-[10px] font-black tracking-widest py-6">Statut Initial</TableHead>
                      <TableHead className="text-right text-[#A0A0B8] uppercase text-[10px] font-black tracking-widest pr-8 py-6">Protocole</TableHead>
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
                              <Activity className="h-12 w-12 text-[#D4AF37]" />
                              <p className="text-lg font-bold uppercase text-[#A0A0B8]">Aucun protocole en attente</p>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        pending.map((est) => (
                          <TableRow key={est.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <TableCell className="pl-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-black border border-white/5 flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-all">
                                  <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                  <p className="font-black text-white text-base group-hover:text-[#D4AF37] transition-colors uppercase italic">{est.name}</p>
                                  <p className="text-[10px] text-[#A0A0B8] font-bold uppercase tracking-tighter">{est.location} • {est.type}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-5">
                              <p className="text-sm font-bold text-white tracking-tight">{est.owner}</p>
                              <p className="text-[10px] text-[#A0A0B8] font-mono">{est.phone}</p>
                            </TableCell>
                            <TableCell className="py-5">
                              <Badge variant="outline" className="border-orange-500/20 text-orange-400 bg-orange-500/5 text-[9px] font-black uppercase italic tracking-widest">7 JOURS TRIAL</Badge>
                            </TableCell>
                            <TableCell className="text-right pr-8 py-5">
                              <div className="flex justify-end gap-3">
                                <Button 
                                  onClick={() => handleAction(est.id, est.name, 'Active')}
                                  className="bg-[#D4AF37] hover:bg-[#B6962E] text-black h-10 px-6 font-black text-[10px] uppercase shadow-lg shadow-[#D4AF37]/20 rounded-xl transition-all active:scale-95"
                                >
                                  Approuver
                                </Button>
                                <Button 
                                  onClick={() => handleAction(est.id, est.name, 'Suspended')}
                                  variant="ghost" 
                                  className="h-10 w-10 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 rounded-xl border border-white/5"
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
          <Card className="glass-card border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-full">
            <CardHeader className="p-8 border-b border-white/5">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl font-black uppercase italic">Flux <span className="text-[#D4AF37]">SaaS</span></CardTitle>
                  <CardDescription className="text-[#A0A0B8] text-[10px] font-bold uppercase tracking-widest">Performance orbital mensuelle</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 py-10 flex-1 relative">
              <div className="h-[280px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="orbitColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10} 
                      fontStyle="italic" 
                    />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(5,5,10,0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '16px', 
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                      }}
                      itemStyle={{ color: '#D4AF37', fontWeight: '900', fontSize: '12px' }}
                      labelStyle={{ color: 'white', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', fontStyle: 'italic' }}
                      cursor={{ stroke: 'rgba(212,175,55,0.2)', strokeWidth: 2 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#D4AF37" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#orbitColor)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 group hover:border-[#D4AF37]/40 transition-all cursor-crosshair">
                  <p className="text-[9px] text-[#A0A0B8] uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                    Dernière <Sparkles className="h-2 w-2 text-[#D4AF37] heartbeat-glow" />
                  </p>
                  {saasTransactions.length > 0 ? (
                    <div className="space-y-1">
                      <p className="text-sm font-black text-white truncate italic uppercase tracking-tighter">{(saasTransactions[0] as any).establishments?.name || 'Unité'}</p>
                      <p className="text-xl font-black text-[#D4AF37]">{(saasTransactions[0] as any).amount.toLocaleString()} F</p>
                    </div>
                  ) : (
                    <p className="text-xs text-white/40 font-bold italic uppercase mt-2">Néant</p>
                  )}
                </div>
                <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col justify-center items-center gap-2 group hover:bg-[#D4AF37]/5 transition-all">
                   <p className="text-[9px] text-[#A0A0B8] uppercase font-black tracking-widest leading-none">Status Global</p>
                   <Badge className="w-fit bg-green-500/10 text-green-500 border-none font-black text-[9px] px-3 shadow-[0_0_10px_rgba(34,197,94,0.2)]">OPTIMAL</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
