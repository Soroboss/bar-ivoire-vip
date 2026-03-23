import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Filter,
  BarChart3,
  Calendar,
  Loader2
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { supabaseService } from '@/services/supabaseService'

export default function SaaSRevenuePage() {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])
  const [totalMRR, setTotalMRR] = useState(0)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await supabaseService.getSaaSTransactions()
        setTransactions(data)
        // Calculate MRR from active month transactions (simplification)
        const total = data.reduce((sum, t) => sum + Number(t.amount), 0)
        setTotalMRR(total)
      } catch (e) {
        console.error('Error loading revenue:', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F0F1A]">
      <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
    </div>
  )

  const REVENUE_BY_MONTH = [
    { month: 'Actuel', total: totalMRR },
  ]

  return (
    <div className="p-6 space-y-8 bg-[#0F0F1A] text-[#F4E4BC] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white italic underline decoration-[#D4AF37]">Finances <span className="text-[#D4AF37]">SaaS</span></h1>
          <p className="text-[#A0A0B8]">Suivi des revenus d'abonnements en temps réel.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#3A3A5A] text-[#A0A0B8]">
            <Download className="h-4 w-4 mr-2" /> Exporter PDF
          </Button>
          <Button className="bg-[#D4AF37] text-[#1A1A2E] font-bold">
            <CreditCard className="h-4 w-4 mr-2" /> Gérer Passerelle
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-[#1A1A2E] border-[#3A3A5A] border-l-4 border-l-[#D4AF37]">
          <CardContent className="pt-6">
            <p className="text-xs text-[#A0A0B8] uppercase">Revenu Cumulé</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-3xl font-bold text-white">{totalMRR.toLocaleString()} F</h3>
              <span className="text-green-500 text-sm flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> Direct</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A2E] border-[#3A3A5A] border-l-4 border-l-[#3B82F6]">
          <CardContent className="pt-6">
            <p className="text-xs text-[#A0A0B8] uppercase">Abonnements Actifs</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-3xl font-bold text-white">{transactions.length}</h3>
              <span className="text-green-500 text-sm flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> +1</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A2E] border-[#3A3A5A] border-l-4 border-l-[#F97316]">
          <CardContent className="pt-6">
            <p className="text-xs text-[#A0A0B8] uppercase">Panier Moyen</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-3xl font-bold text-white">
                {transactions.length > 0 ? (totalMRR / transactions.length).toLocaleString() : 0} F
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#1A1A2E] border-[#3A3A5A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#D4AF37]" /> Répartition par Mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_BY_MONTH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3A3A5A" vertical={false} />
                  <XAxis dataKey="month" stroke="#A0A0B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#1A1A2E', border: '1px solid #3A3A5A', borderRadius: '8px' }}
                    itemStyle={{ color: '#D4AF37' }}
                  />
                  <Bar dataKey="total" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A2E] border-[#3A3A5A]">
          <CardHeader>
            <CardTitle className="text-white">Flux Monétaire Temps Réel</CardTitle>
            <CardDescription className="text-[#A0A0B8]">Dernières transactions enregistrées sur la plateforme.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader className="border-b border-[#3A3A5A]">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-[#A0A0B8]">Bar / Client</TableHead>
                    <TableHead className="text-[#A0A0B8]">Forfait</TableHead>
                    <TableHead className="text-[#A0A0B8]">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((trx) => (
                    <TableRow key={trx.id} className="border-b-[#3A3A5A] hover:bg-white/5 transition-colors">
                      <TableCell>
                        <p className="font-bold text-white text-sm">{trx.establishments?.name || 'Inconnu'}</p>
                        <p className="text-[10px] text-[#A0A0B8]">{new Date(trx.created_at).toLocaleDateString()}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-[#3A3A5A] text-[#D4AF37]">
                          {trx.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-white">{Number(trx.amount).toLocaleString()} F</TableCell>
                    </TableRow>
                  ))}
                  {transactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-[#3A3A5A]">Aucune transaction enregistrée</TableCell>
                    </TableRow>
                  )}
                </TableBody>
             </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
