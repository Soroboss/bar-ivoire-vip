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
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-8 bg-blue-600 rounded-full" />
          <p className="subheading text-blue-600">Vue d'ensemble opérationnelle</p>
        </div>
        <h1 className="heading-xl">Tableau de Bord</h1>
        <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
          Suivez les performances de votre établissement en temps réel. Analysez vos ventes, gérez votre stock et supervisez vos équipes depuis une interface épurée.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Chiffre d'Affaires", value: `${totalSales.toLocaleString()} F`, sub: `${trend} vs hier`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Bénéfice Net", value: `${netProfit.toLocaleString()} F`, sub: `Après dépenses`, icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Clients VIP", value: clients.length, sub: "Total actifs", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Stock Critique", value: products.filter(p => p.stock <= 5).length, sub: "Articles à réapprovisionner", icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="premium-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <div className={`h-10 w-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 premium-card">
          <CardHeader className="p-6 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Performance Horaire</CardTitle>
                <CardDescription>Volume des ventes sur les dernières 24 heures</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                 <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            {!isMounted ? (
              <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#94A3B8" 
                  fontSize={11} 
                  fontWeight={500} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontFamily: 'Montserrat',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="total" stroke="#2563EB" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 premium-card">
          <CardHeader className="p-6 border-b border-slate-50">
             <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Ventes Récentes</CardTitle>
                  <CardDescription>Dernières transactions enregistrées</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                   <ShoppingCart className="h-5 w-5 text-emerald-600" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center gap-3">
                   <Wine className="h-8 w-8 text-slate-200" />
                   <p className="text-sm text-slate-400">Aucune vente enregistrée</p>
                </div>
              ) : (
                recentOrders.map((order, idx) => (
                  <motion.div 
                    key={order.id} 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                          <Wine className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                       </div>
                       <div>
                         <p className="text-sm font-semibold text-slate-900">Table {order.tableId}</p>
                         <p className="text-xs text-slate-500">{format(new Date(order.createdAt), 'HH:mm', { locale: fr })} — ID: {order.id.slice(-4).toUpperCase()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{order.total.toLocaleString()} F</p>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] mt-1">Payé</Badge>
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
