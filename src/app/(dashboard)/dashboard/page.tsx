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
import { DashboardFilters } from "@/components/dashboard/DashboardFilters"
import { useState, useEffect, useMemo } from "react"
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { orders, products, clients, expenses, staff, userRole } = useAppContext()
  const [isMounted, setIsMounted] = useState(false)
  const [dateRange, setDateRange] = useState('today')
  const [selectedStaff, setSelectedStaff] = useState('all')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Filter Orders based on selected date range (client side for immediate UI response)
  const filteredOrders = useMemo(() => {
    const now = new Date()
    return orders.filter(o => {
      const orderDate = new Date(o.createdAt)
      const oStaffId = o.staffId || o.staff_id
      if (selectedStaff !== 'all' && oStaffId !== selectedStaff && selectedStaff !== 'active') return false
      
      if (dateRange === 'today') {
        return orderDate.toDateString() === now.toDateString()
      } else if (dateRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return orderDate >= weekAgo
      } else if (dateRange === 'month') {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
      }
      return true
    })
  }, [orders, dateRange, selectedStaff])

  const totalSales = filteredOrders.reduce((acc, o) => acc + o.total, 0)
  const totalExpenses = (expenses || []).reduce((acc: number, e: any) => acc + (Number(e.amount) || 0), 0)
  const netProfit = totalSales - totalExpenses
  
  const recentOrders = filteredOrders.slice(0, 5)

  // Top Staff calculation
  const staffSales = filteredOrders.reduce((acc: any, o) => {
    const sId = o.staffId || o.staff_id
    if (!sId) return acc
    acc[sId] = (acc[sId] || 0) + o.total
    return acc
  }, {})
  
  let bestStaffName = "Non assigné"
  let bestStaffSales = 0
  Object.entries(staffSales).forEach(([sId, total]: [string, any]) => {
     if (total > bestStaffSales) {
       bestStaffSales = total
       const s = staff?.find(x => x.id === sId)
       bestStaffName = s ? s.name : `Staff #${sId.slice(-4)}`
     }
  })
  
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
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-12 bg-primary rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] leading-none">Intelligence Opérationnelle</p>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
          Dashboard <span className="gold-gradient-text">Elite</span>
        </h1>
        <p className="text-muted-foreground/60 text-base font-black leading-relaxed max-w-2xl border-l-2 border-primary pl-6 uppercase tracking-tight">
          Supervision temps réel du noyau <span className="text-white">Ivoire Bar VIP</span>. Flux de données synchronisés et analyses prédictives.
        </p>
      </div>

      <DashboardFilters 
        onDateChange={setDateRange}
        onStaffChange={setSelectedStaff}
      />

      {/* Stats Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Chiffre d'Affaires", value: `${totalSales.toLocaleString()} F`, sub: `${dateRange === 'today' ? "Aujourd'hui" : "Période"}`, icon: TrendingUp, color: "text-primary", bg: "bg-white/5", restrictedTo: ['Admin', 'Financier', 'Gérant'] },
          { label: "Bénéfice Net", value: `${netProfit.toLocaleString()} F`, sub: `Après charges`, icon: CreditCard, color: "text-emerald-500", bg: "bg-white/5", restrictedTo: ['Admin', 'Financier'] },
          { label: "Top Serveur", value: bestStaffName, sub: `${bestStaffSales.toLocaleString()} F générés`, icon: Users, color: "text-indigo-400", bg: "bg-white/5" },
          { label: "Stock Critique", value: products.filter(p => p.stock <= 5).length, sub: "Action requise", icon: Package, color: "text-red-500", bg: "bg-white/5" },
        ]
        .filter(stat => !stat.restrictedTo || (userRole && stat.restrictedTo.includes(userRole)))
        .map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <Card className="premium-card bg-card/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all duration-500 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">{stat.label}</p>
                <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-all duration-500 shadow-xl`}>
                  <stat.icon className="h-7 w-7" />
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
                <div className="flex items-center gap-2 mt-2">
                   <div className="h-1 w-1 rounded-full bg-primary" />
                   <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4 premium-card bg-card/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-10 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black uppercase gold-gradient-text leading-none mb-2">Performance <span className="text-white">Flux</span></CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Volume des ventes sur les dernières 24 heures</CardDescription>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl group-hover:rotate-12 transition-all duration-500">
                 <Activity className="h-8 w-8 text-primary shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 h-[400px]">
            {!isMounted ? (
              <div className="w-full h-full bg-white/5 animate-pulse rounded-3xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#334155" 
                  fontSize={10} 
                  fontWeight={900} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontStyle: '' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderRadius: '20px',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(20px)',
                    fontFamily: 'Montserrat',
                    padding: '16px'
                  }} 
                  itemStyle={{ 
                    color: '#D4AF37',
                    fontWeight: '900',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    fontStyle: ''
                  }}
                  labelStyle={{
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: '900',
                    fontSize: '10px',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em'
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#D4AF37" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={4} dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4, stroke: '#0F172A' }} activeDot={{ r: 8, stroke: '#D4AF37', strokeWidth: 2, fill: '#0F172A' }} />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 premium-card bg-card/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-10 border-b border-white/5 bg-white/[0.02]">
             <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black uppercase gold-gradient-text leading-none mb-2">Ventes <span className="text-white">Registre</span></CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Dernières transactions sécurisées</CardDescription>
                </div>
                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
                   <ShoppingCart className="h-8 w-8 text-emerald-500" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center gap-6">
                   <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                      <Wine className="h-10 w-10 text-white/10" />
                   </div>
                   <p className="text-[10px] text-muted-foreground/20 font-black uppercase tracking-[0.4em]">Archive vide</p>
                </div>
              ) : (
                recentOrders.map((order, idx) => (
                  <motion.div 
                    key={order.id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="flex items-center justify-between p-6 rounded-[2rem] border border-white/5 hover:bg-white/[0.03] hover:border-primary/20 transition-all duration-500 group"
                  >
                    <div className="flex items-center gap-5">
                       <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                          <Wine className="h-6 w-6 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                       </div>
                       <div>
                         <p className="text-sm font-black text-white uppercase tracking-tighter">Table {order.tableId}</p>
                         <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest mt-1">{format(new Date(order.createdAt), 'HH:mm', { locale: fr })} — TRx_{order.id.slice(-4).toUpperCase()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary tracking-tighter">{order.total.toLocaleString()} F</p>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase tracking-widest px-3 py-1 mt-1 rounded-lg">SÉCURISÉ</Badge>
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
