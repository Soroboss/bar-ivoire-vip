'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Filter,
  BarChart3,
  Calendar,
  Loader2,
  ChevronRight,
  Zap,
  Globe,
  Sparkles,
  Building2
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell
} from 'recharts'
import { supabaseService } from '@/services/supabaseService'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion, AnimatePresence, Variants } from "framer-motion"

export default function SaaSRevenuePage() {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])
  const [totalMRR, setTotalMRR] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    async function loadData() {
      try {
        const data = await supabaseService.getSaaSTransactions()
        setTransactions(data)
        const total = data.reduce((sum, t) => sum + Number(t.amount), 0)
        setTotalMRR(total)
      } catch (e) {
        console.error('Error loading revenue:', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (!isMounted || loading) return (
    <div className="min-h-screen bg-[#05050A] flex items-center justify-center p-6 text-center text-[#F4E4BC]">
      <div className="space-y-6 animate-pulse">
        <div className="relative">
           <div className="h-16 w-16 rounded-3xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center mx-auto">
             <TrendingUp className="h-8 w-8 text-[#D4AF37]" />
           </div>
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2">
             <Loader2 className="h-20 w-20 animate-spin text-[#D4AF37] opacity-20" />
           </div>
        </div>
        <p className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.3em] italic">Analyse des Écarts Quantiques...</p>
      </div>
    </div>
  )

  const REVENUE_BY_DAY = transactions.map(t => ({
    date: format(new Date(t.created_at), 'dd/MM'),
    amount: Number(t.amount)
  })).reverse()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 md:p-10 space-y-10 bg-[#05050A] text-[#F4E4BC] min-h-screen selection:bg-[#D4AF37]/30"
    >
      {/* Financial Strategic Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
               <BarChart3 className="h-4 w-4 text-[#D4AF37]" />
            </div>
            <span className="text-[#A0A0B8] text-[10px] font-black uppercase tracking-widest italic">Terminal de Contrôle Financier</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase leading-none">
            Flux <span className="gold-gradient-text">Monétaire</span>
          </h1>
          <p className="text-[#A0A0B8] text-base border-l-2 border-[#D4AF37] pl-4 max-w-xl">
             Analyse orbitale des revenus SaaS. Monitoring des abonnements et flux de trésorerie du réseau <span className="text-white italic">Ivoire Bar VIP</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-white/5 bg-white/[0.02] text-[#A0A0B8] h-12 rounded-2xl hover:bg-white/[0.05] transition-all px-6 font-black text-[10px] uppercase tracking-widest border">
            <Download className="h-4 w-4 mr-2" /> RELEVÉ UNITAIRE
           </Button>
           <Button className="bg-[#D4AF37] text-black h-12 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.2)] font-black text-[10px] uppercase tracking-widest px-8 hover:bg-[#B6962E] transition-all hover:scale-105 active:scale-95">
            <CreditCard className="h-4 w-4 mr-2" /> PASSERELLE OPS
           </Button>
        </div>
      </motion.div>

      {/* KPI Financial Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid gap-6 md:grid-cols-3"
      >
        {[
          { label: 'Revenu Cumulé (MRR)', value: `${totalMRR.toLocaleString()} F`, icon: TrendingUp, trend: 'Net Orbital', color: '#D4AF37', bg: 'from-[#D4AF37]/10', pulse: true },
          { label: 'Abonnements Enrôlés', value: transactions.length, icon: Globe, trend: '+12% ce mois', color: '#3B82F6', bg: 'from-[#3B82F6]/10' },
          { label: 'Panier Moyen Strat.', value: `${transactions.length > 0 ? Math.round(totalMRR / transactions.length).toLocaleString() : 0} F`, icon: Zap, trend: 'Optimisation Auto', color: '#F97316', bg: 'from-[#F97316]/10' },
        ].map((kpi, i) => (
          <Card key={i} className="glass-card border-white/5 group hover:border-[#D4AF37]/40 transition-all duration-500 rounded-[2.5rem] overflow-hidden">
            <div className={`absolute -bottom-10 -right-10 h-32 w-32 bg-gradient-to-br ${kpi.bg} to-transparent opacity-5 group-hover:opacity-10 transition-all duration-700`} />
            <CardContent className="p-8 relative">
              <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-[0_0_15px_rgba(255,255,255,0.02)]" style={{ color: kpi.color }}>
                   <kpi.icon className="h-7 w-7" />
                </div>
                <Badge variant="outline" className="border-white/10 text-[#A0A0B8] text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/[0.02]">Live Monitor</Badge>
              </div>
              <div>
                <p className="text-[10px] text-[#A0A0B8] uppercase font-black tracking-[0.2em] mb-1">{kpi.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-4xl font-black text-white tracking-tighter leading-none">{kpi.value}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mb-1" style={{ color: kpi.color }}>
                       <ArrowUpRight className="h-3 w-3" /> {kpi.trend}
                    </span>
                    {kpi.pulse && <div className="h-1 w-12 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent rounded-full animate-pulse" />}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Performance Area Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="glass-card border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-full scanline">
            <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">
                     <TrendingUp className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-2xl font-black uppercase italic">Performance <span className="gold-gradient-text">Réseau</span></CardTitle>
                    <CardDescription className="text-[#A0A0B8] text-[10px] font-bold uppercase tracking-[0.2em] italic mt-1">Vitesse de croissance quotidienne</CardDescription>
                  </div>
                </div>
                <div className="group relative">
                   <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-3xl group-hover:border-[#D4AF37]/30 transition-all cursor-pointer">
                      <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#A0A0B8]">Optimisé</span>
                   </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-12 flex-1 flex flex-col justify-end">
              <div className="h-[320px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_BY_DAY}>
                    <defs>
                      <linearGradient id="finColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                      <filter id="shadow">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#D4AF37" floodOpacity="0.4"/>
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={15} 
                      fontStyle="italic"
                      fontWeight="900" 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(5,5,10,0.95)', 
                        border: '1px solid rgba(212,175,55,0.3)', 
                        borderRadius: '20px', 
                        backdropFilter: 'blur(15px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                      }}
                      itemStyle={{ color: '#D4AF37', fontWeight: '900', fontSize: '14px', fontStyle: 'italic' }}
                      labelStyle={{ color: '#A0A0B8', marginBottom: '6px', fontSize: '9px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.2em' }}
                      cursor={{ stroke: 'rgba(212,175,55,0.2)', strokeWidth: 2 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#D4AF37" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#finColor)"
                      animationDuration={2000}
                      style={{ filter: 'url(#shadow)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction Orbital Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass-card border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-full">
            <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-white text-xl font-black uppercase italic">Flux <span className="gold-gradient-text">Temps Réel</span></CardTitle>
                  <CardDescription className="text-[#A0A0B8] text-[9px] font-bold uppercase tracking-[0.2em] italic">Données Interceptées</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[440px] scrollbar-hide">
              <Table>
                <TableHeader className="bg-white/[0.02] border-b border-white/5">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-[#D4AF37] uppercase text-[8px] font-black tracking-widest pl-8 py-6">Unité / Date</TableHead>
                    <TableHead className="text-right text-[#D4AF37] uppercase text-[8px] font-black tracking-widest pr-8 py-6">Volume XOF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {transactions.length === 0 ? (
                       <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={2} className="text-center py-24">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                            <Sparkles className="h-10 w-10 text-[#D4AF37]" />
                            <p className="text-sm font-black uppercase text-[#A0A0B8] tracking-widest italic text-center px-6 leading-relaxed">Aucune transaction interceptée sur le réseau actuel</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : transactions.map((trx, idx) => (
                      <motion.tr 
                        key={trx.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="border-white/5 hover:bg-white/[0.03] transition-all group cursor-default"
                      >
                        <TableCell className="pl-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-11 w-11 rounded-[1.25rem] bg-gradient-to-br from-white/5 to-black border border-white/5 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
                               <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-black text-white text-sm group-hover:text-[#D4AF37] transition-colors uppercase italic tracking-tighter leading-none mb-1.5">{trx.establishments?.name || 'UNITÉ INCONNUE'}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`
                                  text-[7px] px-2 py-0 border-white/10 font-black uppercase tracking-widest
                                  ${trx.plan === 'VIP' ? 'text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/5' : 'text-[#A0A0B8]'}
                                `}>
                                   {trx.plan}
                                </Badge>
                                <span className="text-[8px] text-[#A0A0B8] font-mono opacity-40 uppercase">{format(new Date(trx.created_at), 'dd MMM • HH:mm')}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8 py-5">
                           <p className="text-lg font-black text-white tracking-tighter italic group-hover:text-[#D4AF37] transition-all">+{Number(trx.amount).toLocaleString()} F</p>
                           <p className="text-[8px] text-green-500 font-black uppercase tracking-widest flex items-center justify-end gap-1">
                             <div className="h-1 w-1 rounded-full bg-green-500" /> SÉCURISÉ
                           </p>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
               <Button variant="ghost" className="w-full text-[#A0A0B8] hover:text-[#D4AF37] flex items-center justify-center gap-3 font-black text-[9px] uppercase tracking-[0.2em] h-12 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 transition-all">
                  Grand Registre des Flux <ChevronRight className="h-3 w-3" />
               </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
