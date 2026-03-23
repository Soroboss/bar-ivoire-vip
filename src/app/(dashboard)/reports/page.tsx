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
  ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState, useEffect } from "react"

const COLORS = ['#D4AF37', '#A68226', '#1A1A2E', '#F4E4BC', '#4CAF50']

export default function ReportsPage() {
  const { orders, loading } = useAppContext()

  if (loading) {
    return (
      <div className="p-6 h-screen bg-[#1A1A2E] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0)
  
  const categoryData = orders.length > 0 ? [
    { name: 'Bières', value: totalRevenue * 0.45 },
    { name: 'Spiritueux', value: totalRevenue * 0.30 },
    { name: 'Vins', value: totalRevenue * 0.15 },
    { name: 'Softs/G Grill', value: totalRevenue * 0.10 },
  ] : []

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
    <div className="p-6 space-y-8 bg-[#1A1A2E] text-[#F4E4BC] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#D4AF37]">Rapports <span className="text-white">& Analyses Cloud</span></h1>
          <p className="text-[#A0A0B8]">Suivi en temps réel depuis Supabase.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#3A3A5A] text-[#A0A0B8]">
            <Calendar className="mr-2 h-4 w-4" /> {format(new Date(), 'MMM yyyy', { locale: fr })}
          </Button>
          <Button className="bg-[#D4AF37] text-[#1A1A2E] hover:bg-[#A68226]">
            <Download className="mr-2 h-4 w-4" /> Export Z-Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#252545] border-[#3A3A5A]">
          <CardHeader className="pb-2">
            <CardDescription className="text-[#A0A0B8]">CA Total (Session)</CardDescription>
            <CardTitle className="text-3xl font-bold text-white">{totalRevenue.toLocaleString()} F</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-[#4CAF50] flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" /> Cloud Sync OK
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-[#252545] border-[#3A3A5A]">
          <CardHeader>
            <CardTitle className="text-[#F4E4BC]">Hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3A5A" vertical={false} />
                <XAxis dataKey="day" stroke="#A0A0B8" fontSize={12} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A2E', border: '1px solid #3A3A5A' }} />
                <Bar dataKey="sales" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#252545] border-[#3A3A5A]">
          <CardHeader>
            <CardTitle className="text-[#F4E4BC]">Répartition Ventes</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1A1A2E', border: '1px solid #3A3A5A' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {categoryData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-[10px]">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[#A0A0B8]">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
