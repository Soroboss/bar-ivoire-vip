'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Search, Mail, ShieldCheck, MoreVertical, UserPlus, Filter, Loader2, Star, Zap, ShieldAlert, LayoutDashboard, Fingerprint } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { supabaseService } from "@/services/supabaseService"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { supabase } from "@/lib/supabase"
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
      const data = await supabaseService.getAdminUsers()
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
      await supabaseService.promoteUserToAdmin(promoteEmail)
      toast.success(`${promoteEmail} a été promu`)
      setPromoteEmail('')
      fetchAdmins()
    } catch (e: any) {
      toast.error(e.message || "Erreur de promotion")
    } finally {
      setIsPromoting(false)
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
      const { error } = await supabase
        .from('profiles')
        .update({ permissions: newPermissions })
        .eq('id', userId)
      
      if (error) throw error
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
            <div className="h-2 w-8 bg-blue-600 rounded-full" />
            <p className="subheading text-blue-600">Équipe & Gouvernance</p>
          </div>
          <h1 className="heading-xl">Gestion des Accès</h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
            Gérez les privilèges de vos collaborateurs et administrateurs. Attribuez des rôles précis pour sécuriser vos données.
          </p>
        </div>
        
        <form onSubmit={handlePromote} className="relative w-full lg:max-w-md">
          <Input 
            placeholder="Email pour promotion admin..." 
            type="email"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            className="h-14 pl-4 pr-32 rounded-xl border-slate-200 bg-white shadow-sm font-semibold" 
          />
          <Button 
            type="submit"
            disabled={isPromoting}
            className="absolute right-1.5 top-1.5 h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-100 transition-all"
          >
            {isPromoting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Promouvoir'}
          </Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Super Admins', count: admins.filter(a => a.role === 'SUPER_ADMIN').length, icon: Star, color: "text-blue-600", bg: "bg-blue-50" },
          { label: 'Administrateurs', count: admins.filter(a => a.role === 'ADMIN').length, icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: 'Total Membres', count: admins.length, icon: Users, color: "text-slate-600", bg: "bg-slate-50" },
        ].map((stat, i) => (
          <Card key={i} className="premium-card">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="premium-card overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-lg font-bold">Liste des Utilisateurs</CardTitle>
              <CardDescription>Registre complet des accès administratifs</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
               <Input 
                placeholder="Rechercher un membre..." 
                className="pl-10 h-10 rounded-xl border-slate-200 text-sm font-medium" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-50 hover:bg-transparent">
                <TableHead className="py-6 pl-8 font-bold text-slate-600">Utilisateur</TableHead>
                <TableHead className="py-6 font-bold text-slate-600">Rôle</TableHead>
                <TableHead className="py-6 font-bold text-slate-600">Permissions Actives</TableHead>
                <TableHead className="text-right py-6 pr-8 font-bold text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-60 text-center">
                     <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                     <p className="text-slate-400 font-medium">Récupération des données...</p>
                  </TableCell>
                </TableRow>
              ) : filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-60 text-center">
                     <Users className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                     <p className="text-slate-400 font-medium">Aucun utilisateur trouvé</p>
                  </TableCell>
                </TableRow>
              ) : filteredAdmins.map((admin) => (
                <TableRow key={admin.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                  <TableCell className="pl-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                        {admin.email?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{admin.full_name || 'Utilisateur System'}</p>
                        <p className="text-xs text-slate-400 font-medium">{admin.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold border-none",
                      admin.role === 'SUPER_ADMIN' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      {admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
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
                                "px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all",
                                isActive 
                                  ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                                  : 'bg-slate-50 text-slate-400 border border-slate-100 grayscale opacity-60'
                            )}
                          >
                            {key}
                          </button>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                     <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-blue-600 rounded-xl transition-all">
                       <MoreVertical className="h-5 w-5" />
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
