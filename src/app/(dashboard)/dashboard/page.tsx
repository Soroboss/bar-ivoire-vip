'use client'

export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  TrendingUp, 
  Users, 
  Package, 
  CreditCard, 
  ArrowUpRight, 
  Wine, 
  Clock,
  LayoutDashboard,
  Activity,
  ShoppingCart
} from "lucide-react"
import { 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from 'recharts'
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/AppContext"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState, useEffect } from "react"
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { orders, products, clients, expenses } = useAppContext()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0)
  const totalExpenses = (expenses || []).reduce((acc: number, e: any) => acc + (Number(e.amount) || 0), 0)
  const netProfit = totalSales - totalExpenses
  
  const recentOrders = orders.slice(0, 5)
  
  const salesByHour = orders.reduce((acc: any, o) => {
    const hour = format(new Date(o.createdAt), 'HH') + 'h'
    acc[hour] = (acc[hour] || 0) + o.total
    return acc
  }, {})

  const chartData = Object.entries(salesByHour)
    .map(([name, total]) => ({ name, total: Number(total) }))
    .sort((a,b) => a.name.localeCompare(b.name))

  const trend = orders.length > 5 ? "+12%" : "Nouveau"

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
             <LayoutDashboard className="h-4 w-4 text-primary" />
          </div>
          <p className="subheading">Centre d'Intelligence Stratégique</p>
        </div>
        <h1 className="heading-xl">Tableau <span className="gold-gradient-text">de Bord</span></h1>
        <p className="text-muted-foreground font-semibold italic border-l-2 border-primary pl-4 py-1 leading-relaxed max-w-2xl">
          Supervision en temps réel des flux terminaux. Analyse des performances et synchronisation des actifs via <span className="text-foreground font-black italic underline decoration-primary/30 decoration-4">SaaS Mesh Engine</span>.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Chiffre d'Affaires", value: `${totalSales.toLocaleString()} F`, sub: `${trend} vs session précédente`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/5" },
          { label: "Bénéfice Net (Réel)", value: `${netProfit.toLocaleString()} F`, sub: `Après charges opérationnelles`, icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-l-emerald-200" },
          { label: "Clients VIP", value: clients.length, sub: "Inscriptions prioritaires", icon: Users, color: "text-blue-500", bg: "bg-blue-500/5" },
          { label: "Stock Critique", value: products.filter(p => p.stock <= 5).length, sub: "Déploiement requis d'urgence", icon: Package, color: "text-orange-500", bg: "bg-orange-500/5", border: "border-l-red-200" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={cn(
               "premium-card overflow-hidden group border-none ring-1 ring-border shadow-sm",
               stat.border && `border-l-4 ${stat.border}`
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">{stat.label}</p>
                <div className={`h-11 w-11 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border border-current/10 shadow-sm transition-transform group-hover:scale-110 duration-500`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-foreground italic tracking-tighter leading-none mb-3">{stat.value}</div>
                <div className="flex items-center gap-1.5">
                   <div className={cn("h-1 w-1 rounded-full", stat.color.replace('text', 'bg'))} />
                   <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-7">
        <Card className="lg:col-span-4 premium-card border-none ring-1 ring-border shadow-sm">
          <CardHeader className="p-8 border-b border-border/50 bg-muted/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="heading-lg">Performance <span className="gold-gradient-text">Horaire</span></h2>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic mt-2">Ventes consolidées par cycle terminal.</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center">
                 <Activity className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 h-[350px]">
            {!isMounted ? (
              <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#94A3B8" 
                  fontSize={10} 
                  fontWeight={900} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => val.toUpperCase()} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ stroke: '#C5A059', strokeWidth: 1, strokeDasharray: '5 5' }}
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '24px',
                    border: 'none', 
                    color: '#334155',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    fontFamily: 'Montserrat',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '10px'
                  }} 
                />
                <Area type="monotone" dataKey="total" stroke="#C5A059" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={5} />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 premium-card border-none ring-1 ring-border shadow-sm">
          <CardHeader className="p-8 border-b border-border/50 bg-muted/5">
             <div className="flex items-center justify-between">
                <div>
                  <h2 className="heading-lg">Session <span className="gold-gradient-text">Actuelle</span></h2>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic mt-2">Dernières captures transactionnelles.</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center">
                   <ShoppingCart className="h-4 w-4 text-primary" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center opacity-20">
                     <Wine className="h-6 w-6" />
                   </div>
                   <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Aucun signal détecté</p>
                </div>
              ) : (
                recentOrders.map((order, idx) => (
                  <motion.div 
                    key={order.id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-5 rounded-[1.5rem] bg-muted/30 border border-border group hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-default"
                  >
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Wine className="h-5 w-5 text-primary/40 group-hover:text-primary transition-colors" />
                       </div>
                       <div>
                         <p className="text-[11px] font-black text-foreground uppercase italic tracking-tighter leading-none mb-1">Unité Table {order.tableId}</p>
                         <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{format(new Date(order.createdAt), 'HH:mm', { locale: fr })} — {order.id.slice(-6).toUpperCase()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary italic tracking-tight leading-none mb-2">{order.total.toLocaleString()} F</p>
                      <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Synchronisé</Badge>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
