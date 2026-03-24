'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download,
  ArrowUpRight,
  TrendingDown,
  Loader2,
  PieChart as PieChartIcon,
  ShoppingCart,
  Zap,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState, useEffect } from "react"
import { motion } from 'framer-motion'

const COLORS = ['#2563eb', '#64748b', '#94a3b8', '#cbd5e1', '#f1f5f9']

export default function ReportsPage() {
  const { orders, products, loading } = useAppContext()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
             <Activity className="h-8 w-8 text-blue-600" />
           </div>
           <p className="text-sm font-medium text-slate-500">Analyse des données...</p>
        </div>
      </div>
    )
  }

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0)
  
  const categoryRevenue = orders.reduce((acc: any, order) => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId)
      const category = product?.category || 'Inconnu'
      acc[category] = (acc[category] || 0) + (item.price * item.quantity)
    })
    return acc
  }, {})

  const categoryData = Object.entries(categoryRevenue).map(([name, value]) => ({
    name,
    value: Number(value)
  })).sort((a,b) => b.value - a.value).slice(0, 5)

  const salesByDay = orders.reduce((acc: any, o) => {
    const day = format(new Date(o.createdAt), 'EEE', { locale: fr })
    acc[day] = (acc[day] || 0) + o.total
    return acc
  }, {})

  const dailyData = Object.entries(salesByDay).map(([day, sales]) => ({
    day,
    sales: Number(sales)
  })).sort((a,b) => {
    const days = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.']
    return days.indexOf(a.day.toLowerCase()) - days.indexOf(b.day.toLowerCase())
  })

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-blue-600 rounded-full" />
            <p className="subheading text-blue-600">Analytique</p>
          </div>
          <h1 className="heading-xl">Rapports & Analyses</h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
            Visualisez vos performances de vente, suivez vos produits phares et optimisez votre stratégie commerciale basée sur les données.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-6 rounded-xl transition-all shadow-sm">
            <Calendar className="mr-2 h-4 w-4" /> {format(new Date(), 'MMM yyyy', { locale: fr })}
          </Button>
          <Button className="bg-blue-600 text-white font-bold h-12 px-8 hover:bg-blue-700 shadow-lg shadow-blue-100 rounded-xl flex items-center gap-2 transition-all">
            <Download className="mr-2 h-4 w-4" /> Export Z-Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Chiffre d\'affaires', value: `${totalRevenue.toLocaleString()} F`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
          { label: 'Croissance moyenne', value: '+14.2%', icon: ArrowUpRight, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: 'Volume commandes', value: orders.length, icon: ShoppingCart, color: "text-slate-600", bg: "bg-slate-50" },
        ].map((stat, i) => (
          <Card key={i} className="premium-card rounded-2xl overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className={cn(
                    "h-14 w-14 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm",
                    stat.bg, stat.color
                )}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="premium-card rounded-2xl overflow-hidden border-none shadow-sm">
          <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/20">
             <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Ventes Hebdomadaires</h2>
                  <p className="text-xs font-medium text-slate-500 mt-1">Évolution de votre CA sur les 7 derniers jours.</p>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight={700} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => val.toUpperCase()}
                  tick={{ dy: 10 }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} 
                />
                <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="premium-card rounded-2xl overflow-hidden border-none shadow-sm">
          <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/20">
             <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Top Catégories</h2>
                  <p className="text-xs font-medium text-slate-500 mt-1">Répartition de vos revenus par type de produit.</p>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-8 h-[400px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  innerRadius={80} 
                  outerRadius={120} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              {categoryData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 transition-all">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
