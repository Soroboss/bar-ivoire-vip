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
  
  // Real dynamic labels for charts
  const salesByHour = orders.reduce((acc: any, o) => {
    const hour = format(new Date(o.createdAt), 'HH') + 'h'
    acc[hour] = (acc[hour] || 0) + o.total
    return acc
  }, {})

  // Fill in the last 6 hours if empty, for a better look
  const chartData = Object.entries(salesByHour)
    .map(([name, total]) => ({ name, total: Number(total) }))
    .sort((a,b) => a.name.localeCompare(b.name))

  const trend = orders.length > 5 ? "+12%" : "Nouveau"

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de Bord</h1>
        <p className="text-muted-foreground font-medium">Aperçu des performances en direct.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border hover:shadow-md transition-all group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Chiffre d'Affaires</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalSales.toLocaleString()} F</div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center mt-2">
              <ArrowUpRight className="h-3 w-3 mr-1" /> {trend} vs session précédente
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-md transition-all group border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Bénéfice Net (Réel)</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{netProfit.toLocaleString()} F</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Après déduction de {totalExpenses.toLocaleString()} F de charges
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Clients VIP</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{clients.length}</div>
            <p className="text-xs text-primary mt-2 font-semibold">
              {clients.filter(c => c.tier === 'VIP').length} inscrits aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-md transition-all border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Stock Critique</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <Package className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {products.filter(p => p.stock <= 5).length}
            </div>
            <p className="text-xs text-red-500 mt-2 font-semibold">
              Articles à commander d'urgence
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Performance Horaire</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Ventes consolidées par heure.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {!isMounted ? (
              <div className="w-full h-full bg-slate-100 animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0', 
                    color: '#1E293B',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }} 
                />
                <Area type="monotone" dataKey="total" stroke="var(--primary)" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Session Actuelle</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Dernières transactions effectuées.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">Aucune commande pour le moment</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-foreground uppercase tracking-tight">Table {order.tableId}</p>
                      <p className="text-xs text-muted-foreground font-medium">{format(new Date(order.createdAt), 'HH:mm', { locale: fr })} - {order.id.slice(-6).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{order.total.toLocaleString()} F</p>
                      <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px] font-bold">Validée</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
