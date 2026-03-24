'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Search, Mail, ShieldCheck, MoreVertical, UserPlus, Filter, Loader2, Star, Zap, ShieldAlert, LayoutDashboard, Fingerprint } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { insforgeService } from "@/services/insforgeService"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { motion, AnimatePresence, Variants } from "framer-motion"

export default function SaaSUsersPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [promoteEmail, setPromoteEmail] = useState('')
  const [isPromoting, setIsPromoting] = useState(false)
  const [search, setSearch] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const data = await insforgeService.getAdminUsers()
      setAdmins(data)
    } catch (e) {
      toast.error("Échec de la récupération des membres")
    } finally {
      setLoading(false)
    }
  }

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoteEmail) return
    
    setIsPromoting(true)
    try {
      await insforgeService.promoteUserToAdmin(promoteEmail)
      toast.success(`${promoteEmail} a été promu`)
      setPromoteEmail('')
      fetchAdmins()
    } catch (e: any) {
      toast.error(e.message || "Erreur de promotion")
    } finally {
      setIsPromoting(false)
    }
  }

  const handleRevoke = async (userId: string) => {
    if (!window.confirm("Voulez-vous vraiment révoquer les accès de cet administrateur ?")) return
    try {
      await insforgeService.revokeAdminAccess(userId)
      toast.success("Accès retiré avec succès")
      fetchAdmins()
    } catch (e) {
      toast.error("Erreur lors de la révocation")
    }
  }

  const togglePermission = async (userId: string, currentPermissions: any, permissionKey: string) => {
    const defaultPerms = {
      "dashboard": true,
      "inventory": true,
      "revenue": true,
      "staff": true,
      "settings": true,
      "establishments": true
    }
    const perms = currentPermissions || defaultPerms
    const newPermissions = {
      ...perms,
      [permissionKey]: !perms[permissionKey]
    }
    
    try {
      await insforgeService.updateUserPermissions(userId, newPermissions)
      
      toast.success('Permissions mises à jour')
      fetchAdmins()
    } catch (e) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const filteredAdmins = admins.filter(admin => 
    admin.email?.toLowerCase().includes(search.toLowerCase()) ||
    admin.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (!isMounted) return null

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <p className="subheading text-primary font-black uppercase tracking-widest text-[10px]">Équipe & Gouvernance</p>
          </div>
          <h1 className="heading-xl italic tracking-tighter uppercase font-black">Gestion des Accès</h1>
          <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl italic">
            Gérez les privilèges de vos collaborateurs et administrateurs. Attribuez des rôles précis pour sécuriser vos données.
          </p>
        </div>
        
        <form onSubmit={handlePromote} className="relative w-full lg:max-w-md group">
          <Input 
            placeholder="Email pour promotion admin..." 
            type="email"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            className="h-16 pl-6 pr-40 rounded-2xl border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl font-black text-white italic placeholder:text-muted-foreground/30 focus:ring-primary/20 transition-all" 
          />
          <Button 
            type="submit"
            disabled={isPromoting}
            className="absolute right-2 top-2 h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            {isPromoting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Promouvoir'}
          </Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Super Admins', count: admins.filter(a => a.role === 'SUPER_ADMIN').length, icon: Star, color: "text-primary", bg: "bg-primary/10" },
          { label: 'Administrateurs', count: admins.filter(a => a.role === 'ADMIN').length, icon: ShieldCheck, color: "text-white", bg: "bg-white/10" },
          { label: 'Total Membres', count: admins.length, icon: Users, color: "text-muted-foreground", bg: "bg-white/5" },
        ].map((stat, i) => (
          <Card key={i} className="premium-card rounded-2xl overflow-hidden group border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl transition-all group-hover:scale-110",
                    stat.bg, stat.color
                )}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-white leading-none tracking-tight italic">{stat.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="premium-card rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl">
        <CardHeader className="p-10 border-b border-white/5 bg-white/[0.02]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-xl font-black text-white italic uppercase tracking-tighter">Registre Collaborateurs</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Audit complet des accès administratifs et SaaS</CardDescription>
            </div>
            <div className="relative w-full md:w-96 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
               <Input 
                placeholder="Rechercher un membre..." 
                className="pl-12 h-14 rounded-2xl border-white/5 bg-white/[0.03] text-sm font-black text-white italic placeholder:text-muted-foreground/20 focus:ring-primary/20 transition-all" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="py-6 pl-8 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 italic">Utilisateur</TableHead>
                <TableHead className="py-6 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 italic">Rôle Elite</TableHead>
                <TableHead className="py-6 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 italic">Privilèges Actifs</TableHead>
                <TableHead className="text-right py-6 pr-8 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 italic">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-60 text-center">
                     <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-6" />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">Extraction de la base...</p>
                  </TableCell>
                </TableRow>
              ) : filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-60 text-center">
                     <Users className="h-12 w-12 text-muted-foreground/10 mx-auto mb-6" />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">Aucune archive correspondante</p>
                  </TableCell>
                </TableRow>
              ) : filteredAdmins.map((admin) => (
                <TableRow key={admin.id} className="border-white/5 hover:bg-white/[0.02] transition-all group">
                  <TableCell className="pl-8 py-8">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-[1.2rem] bg-white/5 flex items-center justify-center text-primary font-black border border-white/10 shadow-2xl group-hover:rotate-6 transition-all duration-500 text-xl italic">
                        {admin.email?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-white text-lg leading-none mb-2 uppercase tracking-tighter italic">{admin.full_name || 'Collaborateur'}</p>
                        <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest">{admin.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border-white/10 shadow-2xl",
                      admin.role === 'SUPER_ADMIN' ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground border-white/5"
                    )}>
                      {admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2.5">
                        {Object.entries(admin.permissions || {
                          "dashboard": true,
                          "inventory": true,
                          "revenue": true,
                          "staff": true,
                        }).map(([key, isActive]) => (
                          <button
                            key={key}
                            onClick={() => togglePermission(admin.id, admin.permissions, key)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all duration-500 italic",
                                isActive 
                                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-xl' 
                                  : 'bg-white/5 text-muted-foreground/20 border border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'
                            )}
                          >
                            {key}
                          </button>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       onClick={() => handleRevoke(admin.id)}
                       title="Révoquer l'accès"
                       className="h-12 w-12 text-muted-foreground/10 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all shadow-2xl"
                     >
                       <ShieldAlert className="h-5 w-5" />
                     </Button>
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
