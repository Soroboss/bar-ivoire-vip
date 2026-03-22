'use client'

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
  Calendar
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

const REVENUE_BY_MONTH = [
  { month: 'Oct', total: 280000 },
  { month: 'Nov', total: 350000 },
  { month: 'Déc', total: 420000 },
  { month: 'Jan', total: 390000 },
  { month: 'Fév', total: 485000 },
]

const RECENT_TRANSACTIONS = [
  { id: 'TRX-982', bar: 'Le Caveau des Elites', plan: 'Business', amount: '15.000 F', date: 'Aujourd\'hui', status: 'Réussi' },
  { id: 'TRX-981', bar: 'L\'Escale Lounge', plan: 'Business', amount: '15.000 F', date: 'Hier', status: 'Réussi' },
  { id: 'TRX-980', bar: 'Bar Central', plan: 'SaaS Starter', amount: '7.500 F', date: '01 Mars', status: 'Échoué' },
]

export default function SaaSRevenuePage() {
  return (
    <div className="p-6 space-y-8 bg-[#0F0F1A] text-[#F4E4BC] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white italic underline decoration-[#D4AF37]">Finances <span className="text-[#D4AF37]">SaaS</span></h1>
          <p className="text-[#A0A0B8]">Suivi des revenus d'abonnements et transactions.</p>
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
            <p className="text-xs text-[#A0A0B8] uppercase">Revenu Mensuel Récurrent (MRR)</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-3xl font-bold text-white">485.000 F</h3>
              <span className="text-green-500 text-sm flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> 12%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A2E] border-[#3A3A5A] border-l-4 border-l-[#3B82F6]">
          <CardContent className="pt-6">
            <p className="text-xs text-[#A0A0B8] uppercase">Taux de Rétention</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-3xl font-bold text-white">94.2%</h3>
              <span className="text-green-500 text-sm flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> 2.1%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A2E] border-[#3A3A5A] border-l-4 border-l-[#F97316]">
          <CardContent className="pt-6">
            <p className="text-xs text-[#A0A0B8] uppercase">Défauts de Paiement</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-3xl font-bold text-white">12.500 F</h3>
              <span className="text-red-500 text-sm flex items-center"><ArrowDownRight className="h-3 w-3 mr-1" /> 4%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#1A1A2E] border-[#3A3A5A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#D4AF37]" /> Évolution des Revenus
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
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {REVENUE_BY_MONTH.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === REVENUE_BY_MONTH.length - 1 ? '#D4AF37' : '#3A3A5A'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A2E] border-[#3A3A5A]">
          <CardHeader>
            <CardTitle className="text-white">Dernières Transactions</CardTitle>
            <CardDescription className="text-[#A0A0B8]">Historique des paiements via passerelle (Mobile Money).</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader className="border-b border-[#3A3A5A]">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-[#A0A0B8]">Client</TableHead>
                    <TableHead className="text-[#A0A0B8]">Montant</TableHead>
                    <TableHead className="text-[#A0A0B8]">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_TRANSACTIONS.map((trx) => (
                    <TableRow key={trx.id} className="border-b-[#3A3A5A] hover:bg-white/5 transition-colors">
                      <TableCell>
                        <p className="font-bold text-white text-sm">{trx.bar}</p>
                        <p className="text-[10px] text-[#A0A0B8]">{trx.date} • {trx.plan}</p>
                      </TableCell>
                      <TableCell className="font-bold text-white">{trx.amount}</TableCell>
                      <TableCell>
                         <Badge className={trx.status === 'Réussi' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-400'}>
                           {trx.status}
                         </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             </Table>
             <Button variant="link" className="text-[#D4AF37] w-full mt-4 text-xs">Voir l'historique complet</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
