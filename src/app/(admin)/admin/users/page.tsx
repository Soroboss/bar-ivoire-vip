'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Search, Mail, ShieldCheck, MoreVertical, UserPlus, Filter, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { supabaseService } from "@/services/supabaseService"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function SaaSUsersPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [promoteEmail, setPromoteEmail] = useState('')
  const [isPromoting, setIsPromoting] = useState(false)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const data = await supabaseService.getAdminUsers()
      setAdmins(data)
    } catch (e) {
      toast.error("Erreur lors de la récupération des admins")
    } finally {
      setLoading(false)
    }
  }

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoteEmail) return
    
    setIsPromoting(true)
    try {
      await supabaseService.promoteUserToAdmin(promoteEmail)
      toast.success(`${promoteEmail} a été promu SUPER_ADMIN`)
      setPromoteEmail('')
      fetchAdmins()
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la promotion")
    } finally {
      setIsPromoting(false)
    }
  }

  return (
    <div className="p-6 space-y-8 bg-[#0F0F1A] text-[#F4E4BC] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase italic">Équipe <span className="text-[#D4AF37]">Stratégique</span></h1>
          <p className="text-[#A0A0B8] border-l-2 border-[#D4AF37] pl-3">Gestion des accès administrateurs de la plateforme.</p>
        </div>
        
        <form onSubmit={handlePromote} className="flex gap-2 bg-[#1A1A2E] p-2 rounded-2xl border border-[#3A3A5A]">
          <Input 
            placeholder="Email à promouvoir..." 
            type="email"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            className="bg-black/50 border-none text-white w-64 h-10" 
          />
          <Button 
            type="submit"
            disabled={isPromoting}
            className="bg-[#D4AF37] text-black font-bold h-10 px-4 hover:bg-[#A68226]"
          >
            {isPromoting ? <Loader2 className="h-4 w-4 animate-spin" /> : "PROMOUVOIR ADMIN"}
          </Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Super Admins', count: admins.filter(a => a.role === 'SUPER_ADMIN').length, icon: ShieldCheck, color: "#D4AF37" },
          { label: 'Admins Support', count: admins.filter(a => a.role === 'ADMIN').length, icon: Mail, color: "#3B82F6" },
          { label: 'Total Équipe', count: admins.length, icon: Users, color: "#4CAF50" },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#1A1A2E] border-[#3A3A5A] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <stat.icon className="h-12 w-12" />
            </div>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center" style={{ color: stat.color }}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-[#A0A0B8] uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-bold text-white tracking-tighter">{stat.count}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[#1A1A2E] border-[#3A3A5A] overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-white/2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-lg">Membres Actifs</CardTitle>
              <CardDescription className="text-[#A0A0B8]">Liste des comptes ayant accès au panneau SaaS.</CardDescription>
            </div>
            <div className="flex gap-2">
               <Input placeholder="Rechercher..." className="w-64 bg-black/50 border-[#3A3A5A] text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="text-[#A0A0B8] font-bold uppercase text-[10px]">Identité</TableHead>
                <TableHead className="text-[#A0A0B8] font-bold uppercase text-[10px]">Rôle Système</TableHead>
                <TableHead className="text-[#A0A0B8] font-bold uppercase text-[10px]">Membre depuis</TableHead>
                <TableHead className="text-right text-[#A0A0B8] font-bold uppercase text-[10px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center text-[#A0A0B8]">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 opacity-20" />
                    Chargement de l'équipe...
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center text-[#A0A0B8]">
                    Aucun administrateur trouvé.
                  </TableCell>
                </TableRow>
              ) : admins.map((admin) => (
                <TableRow key={admin.id} className="border-white/5 hover:bg-white/5 transition-all group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#A68226] flex items-center justify-center text-[#1A1A2E] font-bold text-sm shadow-lg shadow-[#D4AF37]/10">
                         {admin.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">{admin.full_name || 'Utilisateur SaaS'}</p>
                        <p className="text-[10px] text-[#A0A0B8] font-mono">{admin.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={admin.role === 'SUPER_ADMIN' ? "bg-[#D4AF37]/10 text-[#D4AF37] border-none" : "bg-blue-500/10 text-blue-400 border-none"}>
                      {admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[#A0A0B8] font-mono">
                    {format(new Date(admin.created_at), 'dd MMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-[#3A3A5A] hover:text-red-400"><MoreVertical className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
