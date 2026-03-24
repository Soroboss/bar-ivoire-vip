'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp,
  Clock, 
  Building2,
  Activity,
  Zap,
  XCircle,
  ChevronRight,
  CheckCircle2
} from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminDashboardContent() {
  const context = useAppContext()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !context || context.loading) {
    return (
      <div className="p-6 md:p-10 space-y-8 bg-background min-h-screen">
        <div className="h-24 bg-muted/30 rounded-2xl animate-pulse" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted/30 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-96 bg-muted/30 rounded-2xl animate-pulse" />
          <div className="h-96 bg-muted/30 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  const { allEstablishments = [], saasTransactions = [], validateEstablishment } = context
  const pending = allEstablishments.filter(e => e.status === 'Pending')
  const trial = allEstablishments.filter(e => e.plan === 'Trial')
  
  const mrr = saasTransactions.reduce((acc: number, t: any) => acc + (Number(t.amount) || 0), 0)
  
  const revenueChartData = (saasTransactions || []).length > 0 
    ? saasTransactions
        .filter((t: any) => t.created_at && !isNaN(new Date(t.created_at).getTime()))
        .map((t: any) => ({
          date: format(new Date(t.created_at), 'dd/MM', { locale: fr }),
          revenue: Number(t.amount) || 0
        })).reverse()
    : []

  const handleAction = async (id: string, name: string, status: 'Active' | 'Suspended' | 'Pending') => {
    try {
      await validateEstablishment(id, status)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="p-6 md:p-10 space-y-8 bg-gray-50/30 dark:bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10 gap-1.5 font-medium px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Système Opérationnel
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Vue d'ensemble Régie
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Surveillez l'activité des établissements, validez les nouvelles inscriptions et analysez les revenus SaaS en temps réel.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Établissements Actifs", value: allEstablishments.length, icon: Building2, subtitle: "Total sur la plateforme" },
          { title: "Revenus (MRR)", value: `${mrr.toLocaleString()} F`, icon: TrendingUp, subtitle: "Abonnements mensuels" },
          { title: "En période d'essai", value: trial.length, icon: Zap, subtitle: "Comptes Trial en cours" },
          { title: "En attente de validation", value: pending.length, icon: Clock, subtitle: "Inscriptions récentes" },
        ].map((kpi, i) => (
          <Card key={i} className="border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <kpi.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{kpi.value.toString().split(' ')[0]} <span className="text-xl">{kpi.value.toString().split(' ')[1] || ''}</span></div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Validations Table */}
        <div className="lg:col-span-2">
          <Card className="h-full border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 px-6 py-4">
              <div>
                <CardTitle className="text-lg font-bold">Nouvelles Inscriptions</CardTitle>
                <CardDescription>Validez ou suspendez les établissements récents.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary font-medium hover:bg-primary/10">
                Voir tout <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-6 font-semibold">Établissement</TableHead>
                      <TableHead className="font-semibold">Responsable</TableHead>
                      <TableHead className="font-semibold text-center">Statut</TableHead>
                      <TableHead className="text-right pr-6 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {pending.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                            <div className="flex flex-col items-center gap-3">
                              <CheckCircle2 className="h-10 w-10 text-emerald-500/50" />
                              <p>Aucun établissement en attente de validation.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        pending.map((est) => (
                          <TableRow 
                            key={est.id} 
                            className="group transition-colors"
                          >
                            <TableCell className="pl-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                  <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">{est.name}</p>
                                  <p className="text-sm text-muted-foreground">{est.location} • {est.type}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <p className="font-medium text-foreground">{est.owner}</p>
                              <p className="text-sm text-muted-foreground">{est.phone}</p>
                            </TableCell>
                            <TableCell className="py-4 text-center">
                              <Badge variant="secondary" className="font-medium">Trial (7 Jours)</Badge>
                            </TableCell>
                            <TableCell className="py-4 pr-6 text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  onClick={() => handleAction(est.id, est.name, 'Active')}
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                                >
                                  Approuver
                                </Button>
                                <Button 
                                  onClick={() => handleAction(est.id, est.name, 'Suspended')}
                                  variant="outline" 
                                  size="icon"
                                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/50 dark:hover:bg-red-900/20"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <div>
          <Card className="h-full border bg-card shadow-sm flex flex-col">
            <CardHeader className="border-b bg-muted/20 px-6 py-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg font-bold">Évolution des Revenus</CardTitle>
              </div>
              <CardDescription>Transactions liées aux abonnements SaaS.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                      dy={10} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                      labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--primary)" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transaction Récente</p>
                  {saasTransactions.length > 0 ? (
                    <div>
                      <p className="font-semibold text-foreground truncate">{(saasTransactions[0] as any).establishments?.name || 'Inconnu'}</p>
                      <p className="text-lg font-bold text-primary mt-1">{(saasTransactions[0] as any).amount.toLocaleString()} F</p>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground mt-2">Aucune donnée</p>
                  )}
                </div>
                <div className="flex flex-col justify-center items-start border-l pl-4 border-border">
                   <p className="text-sm text-muted-foreground mb-2">Santé du réseau</p>
                   <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10 font-semibold px-3 py-1">Optimale</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
