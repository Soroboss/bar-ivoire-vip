'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Plus, Check, Loader2, Key } from "lucide-react"
import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { insforgeService } from "@/services/insforgeService"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDesc, setNewRoleDesc] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchRBAC()
  }, [])

  const fetchRBAC = async () => {
    try {
      setLoading(true)
      const [fetchedRoles, fetchedPerms] = await Promise.all([
        insforgeService.getRoles(),
        insforgeService.getPermissions()
      ])
      setRoles(fetchedRoles)
      setPermissions(fetchedPerms)
    } catch (e) {
      toast.error("Erreur de récupération RBAC")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoleName) return
    setIsCreating(true)
    try {
      await insforgeService.createRole(newRoleName.toLowerCase().replace(/ /g, '_'), newRoleDesc)
      toast.success(`Rôle ${newRoleName} créé`)
      setNewRoleName('')
      setNewRoleDesc('')
      fetchRBAC()
    } catch (e: any) {
      toast.error("Création échouée")
    } finally {
      setIsCreating(false)
    }
  }

  const togglePermission = async (roleId: string, permId: string, currentPerms: any[]) => {
    const hasPerm = currentPerms.some(p => p.permissions?.id === permId)
    const newPermIds = hasPerm 
      ? currentPerms.filter(p => p.permissions?.id !== permId).map(p => p.permissions?.id)
      : [...currentPerms.map(p => p.permissions?.id), permId]

    try {
      await insforgeService.updateRolePermissions(roleId, newPermIds)
      toast.success('Permissions ajustées')
      fetchRBAC()
    } catch (e) {
      toast.error("Erreur de modification")
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <p className="subheading text-primary font-black uppercase tracking-widest text-[10px]">Sécurité Globale</p>
          </div>
          <h1 className="heading-xl italic tracking-tighter uppercase font-black">Rôles & Accès</h1>
          <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl italic">
            Définissez les privilèges (RBAC) granulaires. Ces rôles sont appliqués à l'ensemble du système et régissent l'accès aux différents modules.
          </p>
        </div>
        
        <form onSubmit={handleCreateRole} className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-2xl group">
          <Input 
            placeholder="Nom du rôle (ex: auditeur)" 
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            className="h-16 border-white/5 bg-card/40 backdrop-blur-3xl font-black text-white italic placeholder:text-muted-foreground/30 focus:ring-primary/20 rounded-2xl transition-all uppercase tracking-tight" 
          />
          <Input 
            placeholder="Description (optionnel)" 
            value={newRoleDesc}
            onChange={(e) => setNewRoleDesc(e.target.value)}
            className="h-16 border-white/5 bg-card/40 backdrop-blur-3xl font-black text-white italic placeholder:text-muted-foreground/30 focus:ring-primary/20 rounded-2xl transition-all" 
          />
          <Button 
            type="submit"
            disabled={isCreating}
            className="h-16 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px] whitespace-nowrap shadow-2xl shadow-primary/20 rounded-2xl transition-all hover:scale-105"
          >
            {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5 mr-3" />}
            Nouveau
          </Button>
        </form>
      </div>

      <div className="grid gap-8">
        {roles.map((role) => (
          <Card key={role.id} className="premium-card rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl">
            <CardHeader className="p-10 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-2xl group-hover:rotate-6 transition-all duration-500">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-white capitalize tracking-tighter italic">{role.name.replace(/_/g, ' ')}</CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Status: {role.name === 'super_admin' ? 'Clé Maîtresse' : 'Accès Restreint'}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-8 flex items-center gap-3">
                <Key className="h-4 w-4 text-primary" /> Matrice des Privilèges Elite
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {permissions.map(perm => {
                  const hasPerm = role.role_permissions?.some((rp: any) => rp.permissions?.id === perm.id)
                  const isLocked = role.name === 'super_admin'
                  
                  return (
                    <button
                      key={perm.id}
                      disabled={isLocked}
                      onClick={() => togglePermission(role.id, perm.id, role.role_permissions || [])}
                      className={`text-left flex items-start gap-4 p-6 rounded-[1.8rem] border transition-all duration-500 hover:shadow-2xl italic ${
                        hasPerm 
                          ? 'bg-primary/10 border-primary/30 shadow-[inset_0_0_30px_rgba(212,175,55,0.1)]' 
                          : 'bg-white/5 border-white/5 hover:border-white/20 opacity-40 hover:opacity-100'
                      } ${isLocked ? 'cursor-not-allowed grayscale' : ''}`}
                    >
                      <div className={`mt-1 flex-shrink-0 h-6 w-6 rounded-lg flex items-center justify-center transition-all ${hasPerm ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-white/10 text-transparent'}`}>
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${hasPerm ? 'text-primary' : 'text-white'}`}>{perm.name}</p>
                        <p className="text-[10px] text-muted-foreground/60 font-medium leading-tight mt-2">{perm.description || 'Permission Standard'}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
        {roles.length === 0 && !loading && (
           <div className="py-24 text-center bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem]">
             <ShieldCheck className="h-16 w-16 text-muted-foreground/10 mx-auto mb-6" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/20 italic">Initialisation RBAC requise</p>
           </div>
        )}
      </div>
    </div>
  )
}
