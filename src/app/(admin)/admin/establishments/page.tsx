'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Search, Filter, MoreVertical, ExternalLink, ShieldCheck, Zap, XCircle, LayoutDashboard } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { differenceInDays, format } from "date-fns"
import { useRouter } from "next/navigation"

export default function EstablishmentsPage() {
  const { allEstablishments, loading, switchEstablishment } = useAppContext()
  const router = useRouter()

  if (loading) {
    return (
      <div className="p-6 h-screen bg-[#0F0F1A] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleEnterBar = async (id: string) => {
    await switchEstablishment(id)
    router.push('/dashboard')
  }

  return (
    <div className="p-6 space-y-8 bg-[#0F0F1A] text-[#F4E4BC] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white italic">
            Annuaire <span className="text-[#D4AF37]">Établissements</span>
          </h1>
          <p className="text-[#A0A0B8]">Registre complet des clients SaaS Ivoire Bar VIP.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
            <Input 
              placeholder="Rechercher un bar..." 
              className="pl-10 w-[300px] border-[#3A3A5A] bg-[#1A1A2E] text-white" 
            />
          </div>
          <Button variant="outline" className="border-[#3A3A5A] text-[#A0A0B8]">
            <Filter className="h-4 w-4 mr-2" /> Filtres
          </Button>
        </div>
      </div>

      <Card className="bg-[#1A1A2E] border-[#3A3A5A]">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5 border-b border-[#3A3A5A]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[#A0A0B8] font-bold py-4">ID / Création</TableHead>
                <TableHead className="text-[#A0A0B8] font-bold py-4">Établissement</TableHead>
                <TableHead className="text-[#A0A0B8] font-bold py-4">Abonnement</TableHead>
                <TableHead className="text-[#A0A0B8] font-bold py-4">Statut</TableHead>
                <TableHead className="text-right text-[#A0A0B8] font-bold py-4 pr-6">Accès / Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allEstablishments.length === 0 ? (
                 <TableRow><TableCell colSpan={5} className="text-center py-20 text-[#A0A0B8]">Aucun établissement synchronisé.</TableCell></TableRow>
              ) : (
                allEstablishments.map((est) => (
                  <TableRow key={est.id} className="border-b-[#3A3A5A] hover:bg-white/5 transition-colors">
                    <TableCell className="text-xs font-mono text-[#A0A0B8]">
                      {est.id.substring(0, 8)}...<br/>
                      {est.createdAt ? format(new Date(est.createdAt), 'dd MMM yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{est.name}</p>
                          <p className="text-xs text-[#A0A0B8]">{est.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={est.plan === 'Trial' ? 'bg-blue-500/10 text-blue-400' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}>
                            {est.plan}
                          </Badge>
                          {est.plan === 'Trial' && <Zap className="h-3 w-3 text-blue-400" />}
                        </div>
                        <p className="text-[10px] text-[#A0A0B8]">
                          {est.trialEndsAt ? `Fin : ${format(new Date(est.trialEndsAt), 'dd/MM/yy')}` : ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        est.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                        est.status === 'Pending' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-red-500/10 text-red-400'
                      }>
                        {est.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleEnterBar(est.id)}
                          className="bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A2E] border border-[#D4AF37]/20 transition-all font-bold"
                        >
                          Gérer ce Bar <LayoutDashboard className="h-4 w-4 ml-2" />
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
    </div>
  )
}
