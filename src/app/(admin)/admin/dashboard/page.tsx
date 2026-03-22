'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  BarChart3, 
  TrendingUp,
  Clock, 
  ShieldCheck,
  Building2,
  MoreVertical,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { useState, useEffect } from "react"

const MOCK_REVENUE_DATA = [
  { date: 'Lun', revenue: 45000 },
  { date: 'Mar', revenue: 52000 },
  { date: 'Mer', revenue: 48000 },
  { date: 'Jeu', revenue: 61000 },
  { date: 'Ven', revenue: 85000 },
  { date: 'Sam', revenue: 120000 },
  { date: 'Dim', revenue: 95000 },
]

export default function AdminDashboard() {
  const { allEstablishments, validateEstablishment, loading } = useAppContext()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-[#0F0F1A] min-h-screen animate-pulse">
        <div className="h-20 bg-[#1A1A2E] rounded-2xl border border-[#3A3A5A]" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-[#1A1A2E] rounded-2xl border border-[#3A3A5A]" />)}
        </div>
        <div className="h-96 bg-[#1A1A2E] rounded-2xl border border-[#3A3A5A]" />
      </div>
    )
  }

  const pending = allEstablishments.filter(e => e.status === 'Pending')
  const trial = allEstablishments.filter(e => e.plan === 'Trial')

  const handleAction = async (id: string, name: string, status: 'Active' | 'Suspended' | 'Pending') => {
    try {
      await validateEstablishment(id, status)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="p-6 space-y-8 bg-[#0F0F1A] text-[#F4E4BC] min-h-screen">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-[#D4AF37] text-[#1A1A2E] font-bold">SUPER RÉGIE</Badge>
            <span className="text-[#A0A0B8] text-sm">• v1.0.4 Premium</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">
            Vue d'ensemble <span className="text-[#D4AF37]">SaaS</span>
          </h1>
          <p className="text-[#A0A0B8] border-l-2 border-[#D4AF37] pl-3">Tableau de bord de gestion stratégique Ivoire Bar VIP.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-[#1A1A2E] p-2 rounded-2xl border border-[#3A3A5A]">
          <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-[#A0A0B8] uppercase">Santé Système</p>
            <p className="text-sm font-bold text-white">100% Opérationnel</p>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Établissements", value: allEstablishments.length, icon: Building2, trend: "+12%", color: "#D4AF37" },
          { title: "Revenu Mensuel", value: "485.000 F", icon: TrendingUp, trend: "+8.5%", color: "#4CAF50" },
          { title: "En Trial", value: trial.length, icon: Zap, trend: "-2", color: "#3B82F6" },
          { title: "Validations", value: pending.length, icon: Clock, trend: "Urgent", color: "#F97316" },
        ].map((kpi, i) => (
          <Card key={i} className="bg-[#1A1A2E] border-[#3A3A5A] relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <kpi.icon className="h-16 w-16" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="text-[#A0A0B8] font-medium uppercase text-[10px] tracking-widest">{kpi.title}</CardDescription>
              <CardTitle className="text-3xl font-bold text-white mt-1">{kpi.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs">
                <span className={kpi.trend.includes('+') ? 'text-green-500' : 'text-orange-400'}>{kpi.trend}</span>
                <span className="text-[#A0A0B8]">depuis 30 jours</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Validation List (Main Focus) */}
        <Card className="lg:col-span-2 bg-[#1A1A2E] border-[#3A3A5A] shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[#F4E4BC]">Demandes en Attente</CardTitle>
              <CardDescription className="text-[#A0A0B8]">Nouveaux bar et maquis inscrits sur la plateforme.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-[#D4AF37] hover:bg-[#D4AF37]/10">Voir tout</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="border-b border-[#3A3A5A]">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[#A0A0B8] uppercase text-[10px]">Établissement</TableHead>
                  <TableHead className="text-[#A0A0B8] uppercase text-[10px]">Contact</TableHead>
                  <TableHead className="text-[#A0A0B8] uppercase text-[10px]">Trial</TableHead>
                  <TableHead className="text-right text-[#A0A0B8] uppercase text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-[#A0A0B8]">Aucune demande en attente.</TableCell>
                  </TableRow>
                ) : (
                  pending.map((est) => (
                    <TableRow key={est.id} className="border-b-[#3A3A5A] hover:bg-white/5 transition-colors group">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/10">
                            <Building2 className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">{est.name}</p>
                            <p className="text-[10px] text-[#A0A0B8]">{est.type} • {est.location}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-white">{est.owner}</p>
                        <p className="text-[10px] text-[#A0A0B8]">{est.phone}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-orange-500/20 text-orange-400 text-[10px]">7 JOURS</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            onClick={() => handleAction(est.id, est.name, 'Active')}
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 h-9 font-bold px-4 shadow-lg shadow-green-900/20"
                          >
                            Approuver
                          </Button>
                          <Button 
                             onClick={() => handleAction(est.id, est.name, 'Suspended')}
                            variant="ghost" 
                            size="icon" 
                            className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                          >
                            <XCircle className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* SaaS Revenue Chart */}
        <Card className="bg-[#1A1A2E] border-[#3A3A5A] shadow-2xl">
          <CardHeader>
            <CardTitle className="text-[#F4E4BC] flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#D4AF37]" /> Croissance SaaS
            </CardTitle>
            <CardDescription className="text-[#A0A0B8]">Performance des abonnements hebdomadaires.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[250px] w-full">
              {!isMounted ? (
                <div className="w-full h-full bg-white/5 animate-pulse rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3A3A5A" vertical={false} />
                  <XAxis dataKey="date" stroke="#A0A0B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A2E', border: '1px solid #3A3A5A', borderRadius: '8px' }}
                    itemStyle={{ color: '#D4AF37' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </div>
            <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-white font-bold text-sm mb-1">Dernier Paiement reçu</h4>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-[#A0A0B8]">Le Caveau des Elites</p>
                  <p className="text-lg font-bold text-[#4CAF50]">15.000 F</p>
                </div>
                <Badge className="bg-[#4CAF50]/20 text-[#4CAF50] border-none">COMPLET</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
