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
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center text-foreground">
      <div className="space-y-6 animate-pulse">
        <div className="relative">
           <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
             <TrendingUp className="h-8 w-8 text-primary" />
           </div>
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2">
             <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
           </div>
        </div>
        <p className="text-primary text-xs font-black uppercase tracking-[0.3em] italic">Analyse des Flux Financiers...</p>
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
      className="p-6 md:p-10 space-y-10 bg-background text-foreground min-h-screen selection:bg-primary/20"
    >
      {/* Financial Strategic Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
               <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic">Terminal de Contrôle Financier</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter italic uppercase leading-none">
            Flux <span className="gold-gradient-text">Monétaire</span>
          </h1>
          <p className="text-muted-foreground text-base border-l-2 border-primary pl-4 max-w-xl font-medium">
             Analyse orbitale des revenus SaaS. Monitoring des abonnements et flux de trésorerie du réseau <span className="text-foreground italic">Ivoire Bar VIP</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-border bg-card text-muted-foreground h-12 rounded-2xl hover:bg-secondary transition-all px-6 font-black text-[10px] uppercase tracking-widest border">
            <Download className="h-4 w-4 mr-2" /> RELEVÉ UNITAIRE
           </Button>
           <Button className="bg-primary text-white h-12 rounded-2xl shadow-lg shadow-primary/20 font-black text-[10px] uppercase tracking-widest px-8 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
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
          { label: 'Revenu Cumulé (MRR)', value: `${totalMRR.toLocaleString()} F`, icon: TrendingUp, trend: 'Net Orbital', color: '#C5A059', bg: 'from-primary/10', pulse: true },
          { label: 'Abonnements Enrôlés', value: transactions.length, icon: Globe, trend: '+12% ce mois', color: '#3B82F6', bg: 'from-blue-500/10' },
          { label: 'Panier Moyen Strat.', value: `${transactions.length > 0 ? Math.round(totalMRR / transactions.length).toLocaleString() : 0} F`, icon: Zap, trend: 'Optimisation Auto', color: '#F97316', bg: 'from-orange-500/10' },
        ].map((kpi, i) => (
          <Card key={i} className="bg-card border-border group hover:border-primary/40 transition-all duration-500 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className={`absolute -bottom-10 -right-10 h-32 w-32 bg-gradient-to-br ${kpi.bg} to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl`} />
            <CardContent className="p-8 relative">
              <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 rounded-2xl bg-muted border border-border flex items-center justify-center transition-transform group-hover:scale-110 duration-500" style={{ color: kpi.color }}>
                   <kpi.icon className="h-7 w-7" />
                </div>
                <Badge variant="outline" className="border-border text-muted-foreground text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-muted/50">Live Monitor</Badge>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">{kpi.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-4xl font-black text-foreground tracking-tighter leading-none">{kpi.value}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mb-1" style={{ color: kpi.color }}>
                       <ArrowUpRight className="h-3 w-3" /> {kpi.trend}
                    </span>
                    {kpi.pulse && <div className="h-1 w-12 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full animate-pulse" />}
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
          <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden flex flex-col h-full shadow-sm">
            <CardHeader className="p-8 border-b border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                     <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground text-2xl font-black uppercase italic">Performance <span className="gold-gradient-text">Réseau</span></CardTitle>
                    <CardDescription className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] italic mt-1">Vitesse de croissance quotidienne</CardDescription>
                  </div>
                </div>
                <div className="group relative">
                   <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-xl border border-border group-hover:border-primary/30 transition-all cursor-pointer">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Optimisé</span>
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
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94A3B8" 
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
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '20px', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }}
                      itemStyle={{ color: 'var(--primary)', fontWeight: '900', fontSize: '14px', fontStyle: 'italic' }}
                      labelStyle={{ color: '#1E293B', marginBottom: '6px', fontSize: '9px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.2em' }}
                      cursor={{ stroke: 'rgba(197,160,89,0.2)', strokeWidth: 2 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="var(--primary)" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#finColor)"
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction Orbital Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden flex flex-col h-full shadow-sm">
            <CardHeader className="p-8 border-b border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-foreground text-xl font-black uppercase italic">Flux <span className="gold-gradient-text">Temps Réel</span></CardTitle>
                  <CardDescription className="text-muted-foreground text-[9px] font-bold uppercase tracking-[0.2em] italic">Données Interceptées</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[440px] scrollbar-hide">
              <Table>
                <TableHeader className="bg-muted/30 border-b border-border">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-primary uppercase text-[8px] font-black tracking-widest pl-8 py-6">Unité / Date</TableHead>
                    <TableHead className="text-right text-primary uppercase text-[8px] font-black tracking-widest pr-8 py-6">Volume XOF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {transactions.length === 0 ? (
                       <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={2} className="text-center py-24">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                            <Sparkles className="h-10 w-10 text-primary" />
                            <p className="text-sm font-black uppercase text-muted-foreground tracking-widest italic text-center px-6 leading-relaxed">Aucune transaction interceptée sur le réseau actuel</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : transactions.map((trx, idx) => (
                      <motion.tr 
                        key={trx.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="border-border hover:bg-muted/50 transition-all group cursor-default"
                      >
                        <TableCell className="pl-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-11 w-11 rounded-[1.25rem] bg-gradient-to-br from-primary/10 to-transparent border border-border flex items-center justify-center text-primary group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                               <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-black text-foreground text-sm group-hover:text-primary transition-colors uppercase italic tracking-tighter leading-none mb-1.5">{trx.establishments?.name || 'UNITÉ INCONNUE'}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`
                                  text-[7px] px-2 py-0 border-border font-black uppercase tracking-widest
                                  ${trx.plan === 'VIP' ? 'text-primary border-primary/20 bg-primary/5' : 'text-muted-foreground'}
                                `}>
                                   {trx.plan}
                                </Badge>
                                <span className="text-[8px] text-muted-foreground font-semibold opacity-60 uppercase">{format(new Date(trx.created_at), 'dd MMM • HH:mm')}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8 py-5">
                           <p className="text-lg font-black text-foreground tracking-tighter italic group-hover:text-primary transition-all">+{Number(trx.amount).toLocaleString()} F</p>
                           <p className="text-[8px] text-emerald-600 font-black uppercase tracking-widest flex items-center justify-end gap-1">
                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> SÉCURISÉ
                           </p>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
            <div className="p-6 border-t border-border bg-muted/20">
               <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary flex items-center justify-center gap-3 font-black text-[9px] uppercase tracking-[0.2em] h-12 rounded-2xl border border-border hover:border-primary/30 transition-all">
                  Grand Registre des Flux <ChevronRight className="h-3 w-3" />
               </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
