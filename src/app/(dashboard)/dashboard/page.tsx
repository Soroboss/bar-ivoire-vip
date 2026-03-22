'use client'

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

export default function DashboardPage() {
  const { orders, products, clients } = useAppContext()

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0)
  const recentOrders = orders.slice(0, 5)

  // Demo dynamic labels for charts
  const salesByHour = orders.reduce((acc: any, o) => {
    const hour = format(new Date(o.createdAt), 'HH') + 'h'
    acc[hour] = (acc[hour] || 0) + o.total
    return acc
  }, {})

  const chartData = [
    { name: '18h', total: 45000 },
    { name: '19h', total: 82000 },
    { name: '20h', total: 125000 },
    { name: '21h', total: 250000 },
    { name: '22h', total: 450000 },
    // Merged with actual orders if any
    ...Object.entries(salesByHour).map(([name, total]) => ({ name, total: Number(total) }))
  ].sort((a,b) => a.name.localeCompare(b.name))

  return (
    <div className="p-6 space-y-8 bg-[#1A1A2E] text-[#F4E4BC] animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#D4AF37]">Tableau de Bord</h1>
        <p className="text-[#A0A0B8]">Aperçu des performances en direct.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#252545] border-[#3A3A5A] hover:border-[#D4AF37] transition-all group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#A0A0B8]">Ventes ce soir</CardTitle>
            <div className="h-8 w-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{(1845000 + totalSales).toLocaleString()} F</div>
            <p className="text-xs text-[#4CAF50] flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +{orders.length > 0 ? (totalSales / 1845000 * 100).toFixed(1) : '0'} %
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#252545] border-[#3A3A5A] hover:border-[#D4AF37] transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#A0A0B8]">Clients VIP</CardTitle>
            <div className="h-8 w-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{clients.length}</div>
            <p className="text-xs text-[#D4AF37] mt-1">
              {clients.filter(c => c.tier === 'VIP').length} inscrits aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#252545] border-[#3A3A5A] hover:border-[#D4AF37] transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#A0A0B8]">Stock Critique</CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {products.filter(p => p.stock <= 5).length}
            </div>
            <p className="text-xs text-red-400 mt-1">
              Articles à commander d'urgence
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#252545] border-[#3A3A5A] hover:border-[#D4AF37] transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#A0A0B8]">Commandes</CardTitle>
            <div className="h-8 w-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{orders.length}</div>
            <p className="text-xs text-[#A0A0B8] mt-1">
              Nouvelles commandes cette session
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-[#252545] border-[#3A3A5A]">
          <CardHeader>
            <CardTitle className="text-[#F4E4BC]">Performance Horaire</CardTitle>
            <CardDescription className="text-[#A0A0B8]">Ventes consolidées par heure.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#A0A0B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A0A0B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A2E', border: '1px solid #3A3A5A', color: '#F4E4BC' }} />
                <Area type="monotone" dataKey="total" stroke="#D4AF37" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-[#252545] border-[#3A3A5A]">
          <CardHeader>
            <CardTitle className="text-[#F4E4BC]">Session Actuelle</CardTitle>
            <CardDescription className="text-[#A0A0B8]">Dernières transactions effectuées.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-10 text-center text-[#A0A0B8]">Aucune commande pour le moment</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-[#1A1A2E] border border-[#3A3A5A]/50">
                    <div>
                      <p className="text-sm font-bold text-white">Table {order.tableId}</p>
                      <p className="text-xs text-[#A0A0B8]">{format(new Date(order.createdAt), 'HH:mm', { locale: fr })} - {order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#D4AF37]">{order.total.toLocaleString()} F</p>
                      <Badge className="bg-green-500/10 text-green-500 text-[10px]">Validée</Badge>
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
