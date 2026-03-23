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
  Cell
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
  PieChart as PieChartIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState, useEffect } from "react"
import { motion } from 'framer-motion'

const COLORS = ['#C5A059', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']

export default function ReportsPage() {
  const { orders, products, loading } = useAppContext()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center text-foreground font-montserrat">
        <div className="space-y-6 animate-pulse">
          <div className="relative">
             <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
               <TrendingUp className="h-8 w-8 text-primary" />
             </div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2">
               <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
             </div>
          </div>
          <p className="text-primary text-xs font-black uppercase tracking-[0.3em] italic">Calcul des Métriques...</p>
        </div>
      </div>
    )
  }

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0)
  
  // Real category distribution from order items
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 space-y-10 bg-background text-foreground min-h-screen font-montserrat"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
               <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic">Intelligence d'Affaires</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter italic uppercase leading-none">
            Rapports <span className="gold-gradient-text">& Analyses</span>
          </h1>
          <p className="text-muted-foreground text-base border-l-2 border-primary pl-4 max-w-xl font-medium">
            Visualisation des flux de trésorerie et performance produit. Interrogation des données via <span className="text-foreground italic">Supabase Cloud Analytics</span>.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 border-border text-foreground hover:bg-muted font-bold px-6 rounded-xl transition-all">
            <Calendar className="mr-2 h-4 w-4" /> {format(new Date(), 'MMM yyyy', { locale: fr })}
          </Button>
          <Button className="bg-primary text-white font-black uppercase italic text-[10px] h-12 px-6 hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl flex items-center gap-2 transition-all hover:scale-105">
            <Download className="mr-2 h-4 w-4" /> Export Z-Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Chiffre d\'Affaires Total', value: `${totalRevenue.toLocaleString()} F`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          { label: 'Croissance Hebdomadaire', value: '+12.4%', icon: ArrowUpRight, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: 'Volume de Commandes', value: orders.length, icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border rounded-[2rem] overflow-hidden shadow-sm hover:border-primary/40 transition-all duration-500">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border border-current/10 shadow-sm`}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-sm">
          <CardHeader className="p-8 border-b border-border bg-muted/20">
             <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black uppercase italic gold-gradient-text leading-none">Perspective <span className="text-foreground">Temporelle</span></CardTitle>
                  <CardDescription className="text-xs font-semibold italic mt-1">Évolution des ventes sur le cycle hebdomadaire.</CardDescription>
                </div>
                <div className="h-10 w-10 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-10 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight={900} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => val.toUpperCase()}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }} 
                />
                <Bar dataKey="sales" fill="url(#colorSales)" radius={[8, 8, 0, 0]} barSize={40} />
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-sm">
          <CardHeader className="p-8 border-b border-border bg-muted/20">
             <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black uppercase italic gold-gradient-text leading-none">Répartition <span className="text-foreground">Stratégique</span></CardTitle>
                  <CardDescription className="text-xs font-semibold italic mt-1">Top des catégories par performance financière.</CardDescription>
                </div>
                <div className="h-10 w-10 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-center">
                  <PieChartIcon className="h-4 w-4 text-primary" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-10 h-[400px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  innerRadius={80} 
                  outerRadius={120} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              {categoryData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
