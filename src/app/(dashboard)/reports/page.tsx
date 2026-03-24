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

const COLORS = ['#D4AF37', '#94a3b8', '#64748b', '#475569', '#1e293b']

export default function ReportsPage() {
  const { orders, products, loading } = useAppContext()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
             <Activity className="h-8 w-8 text-primary" />
           </div>
           <p className="text-sm font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Calcul des KPIs...</p>
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
            <div className="h-2 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <p className="subheading text-primary font-bold">Analytique VIP</p>
          </div>
          <h1 className="heading-xl">Rapports & Analyses</h1>
          <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">
            Visualisez vos performances de vente, suivez vos produits phares et optimisez votre stratégie commerciale basée sur les données.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 font-black px-6 rounded-xl transition-all shadow-sm uppercase text-[10px] tracking-widest">
            <Calendar className="mr-2 h-4 w-4 text-primary" /> {format(new Date(), 'MMM yyyy', { locale: fr })}
          </Button>
          <Button className="bg-primary text-primary-foreground font-black h-12 px-8 hover:bg-primary/90 shadow-lg shadow-primary/10 rounded-xl flex items-center gap-2 transition-all uppercase text-[10px] tracking-widest">
            <Download className="mr-2 h-4 w-4" /> Export Z-Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Chiffre d\'affaires', value: `${totalRevenue.toLocaleString()} F`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          { label: 'Croissance moyenne', value: '+14.2%', icon: ArrowUpRight, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: 'Volume commandes', value: orders.length, icon: ShoppingCart, color: "text-white", bg: "bg-white/10" },
        ].map((stat, i) => (
          <Card key={i} className="premium-card rounded-2xl overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 border border-white/5",
                    stat.bg, stat.color
                )}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                  <p className="text-2xl font-black text-white leading-none tracking-tight italic">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="premium-card rounded-[2rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl">
          <CardHeader className="p-8 border-b border-white/5">
             <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Ventes Hebdomadaires</h2>
                  <p className="text-xs font-medium text-muted-foreground mt-1">Évolution de votre CA sur les 7 derniers jours.</p>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight={900} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => val.toUpperCase()}
                  tick={{ dy: 10 }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', fontWeight: 900, fontSize: '12px', color: '#fff' }} 
                />
                <Bar dataKey="sales" fill="#D4AF37" radius={[12, 12, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="premium-card rounded-[2rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl">
          <CardHeader className="p-8 border-b border-white/5">
             <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Top Catégories</h2>
                  <p className="text-xs font-medium text-muted-foreground mt-1">Répartition de vos revenus par type de produit.</p>
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
                <div key={item.name} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 transition-all hover:bg-white/10">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.name}</span>
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
