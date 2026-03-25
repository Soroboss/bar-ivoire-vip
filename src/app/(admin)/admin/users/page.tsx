'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Search, ShieldCheck, UserPlus, Loader2, Star, ShieldAlert, Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { insforgeService } from "@/services/insforgeService"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { CreateUserModal } from "./CreateUserModal"
import { EditUserModal } from "./EditUserModal"

export default function SaaSUsersPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [promoteEmail, setPromoteEmail] = useState('')
  const [promoteRole, setPromoteRole] = useState('CASHIER')
  const [isPromoting, setIsPromoting] = useState(false)
  const [search, setSearch] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const data = await insforgeService.getTeamMembers()
      setAdmins(data)
    } catch (e) {
      toast.error("Échec de la récupération des membres")
    } finally {
      setLoading(false)
    }
  }

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoteEmail || !promoteRole) return
    
    setIsPromoting(true)
    try {
      await insforgeService.assignRoleByEmail(promoteEmail, promoteRole)
      toast.success(`${promoteEmail} a été promu ${promoteRole}`)
      setPromoteEmail('')
      setPromoteRole('CASHIER')
      fetchAdmins()
    } catch (e: any) {
      if (e.message?.includes('non trouvé') || e.message?.includes('not found')) {
        toast.error("Cet utilisateur n'existe pas encore. Il doit d'abord créer un compte via la page d'inscription (/register).")
      } else {
        toast.error(e.message || "Erreur de promotion")
      }
    } finally {
      setIsPromoting(false)
    }
  }

  const handleRevoke = async (userId: string) => {
    if (!window.confirm("Voulez-vous vraiment révoquer les accès de cet administrateur ?")) return
    try {
      await insforgeService.revokeAccess(userId)
      toast.success("Accès retiré avec succès")
      fetchAdmins()
    } catch (e) {
      toast.error("Erreur lors de la révocation")
    }
  }

  const handleDelete = async (userId: string) => {
    if (!window.confirm("ÊTES-VOUS SÛR ? Cette action supprimera définitivement le compte utilisateur et son profil. Cette action est irréversible.")) return
    try {
      setLoading(true)
      await insforgeService.deleteUser(userId)
      toast.success("Utilisateur supprimé définitivement")
      fetchAdmins()
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la suppression")
    } finally {
      setLoading(false)
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
    (admin.email?.toLowerCase().includes(search.toLowerCase()) ||
    admin.full_name?.toLowerCase().includes(search.toLowerCase()))
  )

  const getRoleLabel = (role: string) => {
    const map: Record<string, string> = {
      'ADMIN': 'Administrateur',
      'CASHIER': 'Gérant (Caisse)',
      'WAITER': 'Serveur',
      'BARMAN': 'Barman',
      'SUPER_ADMIN': 'Super Admin'
    }
    return map[role] || role
  }

  if (!isMounted) return null

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <p className="subheading text-primary font-black uppercase tracking-widest text-[10px]">Équipe & Gouvernance</p>
          </div>
          <h1 className="heading-xl tracking-tighter uppercase font-black">Gestion des Accès</h1>
          <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">
            Gérez les privilèges de vos collaborateurs et administrateurs. Attribuez des rôles précis pour sécuriser vos données.
          </p>
        </div>
        
        <div className="w-full lg:max-w-xl space-y-4">
          <div className="flex items-center gap-4 justify-end">
            <CreateUserModal onSuccess={fetchAdmins} />
          </div>
          <form onSubmit={handlePromote} className="relative group flex gap-2">
            <Input 
              placeholder="Email du compte déjà inscrit..." 
              type="email"
              value={promoteEmail}
              onChange={(e) => setPromoteEmail(e.target.value)}
              className="h-16 pl-6 rounded-2xl border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl font-black text-white placeholder:text-muted-foreground/30 focus:ring-primary/20 transition-all flex-1" 
            />
            <select
              value={promoteRole}
              onChange={(e) => setPromoteRole(e.target.value)}
              className="h-16 px-4 rounded-2xl border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl font-black text-white focus:ring-primary/20 transition-all"
            >
              <option value="ADMIN" className="text-black">Administrateur</option>
              <option value="CASHIER" className="text-black">Gérant (Caisse)</option>
              <option value="WAITER" className="text-black">Serveur</option>
              <option value="BARMAN" className="text-black">Barman</option>
            </select>
            <Button 
              type="submit"
              disabled={isPromoting}
              className="h-16 px-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all"
            >
              {isPromoting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assigner existant'}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground/60 font-medium px-2 text-right">
            ℹ️ Ou assignez un rôle à un utilisateur déjà inscrit.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Administrateurs', count: admins.filter(a => a.role === 'ADMIN').length, icon: Star, color: "text-primary", bg: "bg-primary/10" },
          { label: 'Gérants', count: admins.filter(a => a.role === 'CASHIER').length, icon: ShieldCheck, color: "text-white", bg: "bg-white/10" },
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
                  <p className="text-2xl font-black text-white leading-none tracking-tight">{stat.count}</p>
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
              <CardTitle className="text-xl font-black text-white uppercase tracking-tighter">Registre Collaborateurs</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Audit complet des accès administratifs et SaaS</CardDescription>
            </div>
            <div className="relative w-full md:w-96 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
               <Input 
                placeholder="Rechercher un membre..." 
                className="pl-12 h-14 rounded-2xl border-white/5 bg-white/[0.03] text-sm font-black text-white placeholder:text-muted-foreground/20 focus:ring-primary/20 transition-all" 
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
                <TableHead className="py-6 pl-8 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">Utilisateur</TableHead>
                <TableHead className="py-6 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">Rôle Elite</TableHead>
                <TableHead className="py-6 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">Privilèges Actifs</TableHead>
                <TableHead className="text-right py-6 pr-8 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">Actions</TableHead>
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
              ) : (
                <AnimatePresence>
                  {filteredAdmins.map((admin) => (
                    <motion.tr 
                      key={admin.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="border-white/5 hover:bg-white/[0.02] transition-all group"
                    >
                      <TableCell className="pl-8 py-8">
                        <div className="flex items-center gap-6">
                          <div className="h-14 w-14 rounded-[1.2rem] bg-white/5 flex items-center justify-center text-primary font-black border border-white/10 shadow-2xl group-hover:rotate-6 transition-all duration-500 text-xl">
                            {admin.email?.[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-white text-lg leading-none mb-2 uppercase tracking-tighter">{admin.full_name || 'Collaborateur'}</p>
                            <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest">{admin.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border-white/10 shadow-2xl",
                          admin.role === 'ADMIN' || admin.role === 'SUPER_ADMIN' ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground border-white/5"
                        )}>
                          {getRoleLabel(admin.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2.5">
                            {Object.entries(admin.permissions || {}).map(([key, isActive]) => (
                              <button
                                key={key}
                                onClick={() => togglePermission(admin.id, admin.permissions, key)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all duration-500",
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
                        <div className="flex items-center justify-end gap-2">
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             onClick={() => {
                               setEditingUser(admin)
                               setIsEditModalOpen(true)
                             }}
                             title="Modifier le profil"
                             className="h-10 w-10 text-muted-foreground/10 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                           >
                             <Pencil className="h-4 w-4" />
                           </Button>

                           <Button 
                             variant="ghost" 
                             size="icon" 
                             onClick={() => handleRevoke(admin.id)}
                             title="Révoquer l'accès"
                             className="h-10 w-10 text-muted-foreground/10 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all"
                           >
                             <ShieldAlert className="h-4 w-4" />
                           </Button>

                           <Button 
                             variant="ghost" 
                             size="icon" 
                             onClick={() => handleDelete(admin.id)}
                             title="Supprimer définitivement"
                             className="h-10 w-10 text-muted-foreground/10 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditUserModal 
        user={editingUser} 
        open={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen} 
        onSuccess={fetchAdmins} 
      />
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
