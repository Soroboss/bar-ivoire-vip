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

const COLORS = ['#C5A059', '#64748b', '#94a3b8', '#cbd5e1', '#f1f5f9']

export default function ReportsPage() {
  const { orders, products, loading } = useAppContext()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="space-y-6 animate-pulse">
           <div className="h-20 w-20 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto shadow-sm">
             <Activity className="h-10 w-10 text-primary" />
           </div>
           <p className="subheading">Compilation des Métriques Cloud...</p>
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
               <Activity className="h-4 w-4 text-primary" />
            </div>
            <p className="subheading">Centre d'Intelligence Orbitale</p>
          </div>
          <h1 className="heading-xl">Rapports <span className="gold-gradient-text">& Analyses</span></h1>
          <p className="text-muted-foreground font-semibold italic border-l-2 border-primary pl-4 py-1 leading-relaxed max-w-2xl">
            Surveillance en temps réel des performances financières. Interrogation granulaire des métriques via <span className="text-foreground font-black italic">Supabase Cloud Analytics</span>.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 border-border text-foreground hover:bg-muted font-bold px-6 rounded-2xl transition-all shadow-sm">
            <Calendar className="mr-3 h-4 w-4" /> {format(new Date(), 'MMM yyyy', { locale: fr })}
          </Button>
          <Button className="bg-primary text-white font-black uppercase italic text-[10px] h-12 px-8 hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl flex items-center gap-2 transition-all hover:scale-105">
            <Download className="mr-3 h-4 w-4" /> EXPORT Z-REPORT
          </Button>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        {[
          { label: 'Indice de Revenu Total', value: `${totalRevenue.toLocaleString()} F`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/5", ring: "ring-primary/10" },
          { label: 'Delta de Croissance', value: '+14.2%', icon: ArrowUpRight, color: "text-emerald-500", bg: "bg-emerald-500/5", ring: "ring-emerald-500/10" },
          { label: 'Force Transactionnelle', value: orders.length, icon: ShoppingCart, color: "text-slate-500", bg: "bg-muted/10", ring: "ring-muted/20" },
        ].map((stat, i) => (
          <Card key={i} className="premium-card border-none ring-1 ring-border rounded-[2.5rem] overflow-hidden shadow-sm hover:ring-primary/40 transition-all duration-700 group">
            <CardContent className="p-10">
              <div className="flex items-center gap-8">
                <div className={cn(
                    "h-16 w-16 rounded-[1.5rem] flex items-center justify-center border transition-all duration-700 group-hover:scale-110 group-hover:bg-white group-hover:shadow-2xl",
                    stat.bg, stat.color, stat.ring
                )}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="subheading text-muted-foreground/60">{stat.label}</p>
                  <p className="text-3xl font-black text-foreground italic tracking-tighter leading-none">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <Card className="premium-card border-none ring-1 ring-border rounded-[3rem] overflow-hidden shadow-sm">
          <CardHeader className="p-10 border-b border-border/50 bg-muted/10">
             <div className="flex items-center justify-between">
                <div>
                  <h2 className="heading-lg">Perspective <span className="gold-gradient-text">Temporelle</span></h2>
                  <p className="subheading mt-2">Projection des flux sur le cycle hebdomadaire.</p>
                </div>
                <div className="h-12 w-12 bg-white ring-1 ring-border rounded-2xl flex items-center justify-center text-primary shadow-sm">
                  <Activity className="h-5 w-5" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-12 h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight={900} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => val.toUpperCase()}
                  tick={{ dy: 10 }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.01)' }}
                  contentStyle={{ backgroundColor: '#fff', border: 'none', ring: '1px solid #e2e8f0', borderRadius: '20px', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }} 
                />
                <Bar dataKey="sales" fill="url(#reportGradient)" radius={[12, 12, 4, 4]} barSize={45} />
                <defs>
                  <linearGradient id="reportGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="premium-card border-none ring-1 ring-border rounded-[3rem] overflow-hidden shadow-sm">
          <CardHeader className="p-10 border-b border-border/50 bg-muted/10">
             <div className="flex items-center justify-between">
                <div>
                  <h2 className="heading-lg">Répartition <span className="gold-gradient-text">Stratégique</span></h2>
                  <p className="subheading mt-2">Dominance des catégories par volume financier.</p>
                </div>
                <div className="h-12 w-12 bg-white ring-1 ring-border rounded-2xl flex items-center justify-center text-primary shadow-sm">
                  <PieChartIcon className="h-5 w-5" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-12 h-[450px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  innerRadius={100} 
                  outerRadius={140} 
                  paddingAngle={10} 
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: 'none', ring: '1px solid #e2e8f0', borderRadius: '20px', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-6 mt-10 justify-center">
              {categoryData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl ring-1 ring-border shadow-sm hover:ring-primary/20 transition-all cursor-default">
                  <div className="h-3 w-3 rounded-full shadow-inner" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[10px] font-black uppercase text-foreground italic tracking-widest">{item.name}</span>
                </div>
              ))}
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
