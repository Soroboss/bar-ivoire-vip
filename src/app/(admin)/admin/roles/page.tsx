'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Plus, Check, Loader2, Key } from "lucide-react"
import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { supabaseService } from "@/services/supabaseService"
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
        supabaseService.getRoles(),
        supabaseService.getPermissions()
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
      await supabaseService.createRole(newRoleName.toLowerCase().replace(/ /g, '_'), newRoleDesc)
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
      await supabaseService.updateRolePermissions(roleId, newPermIds)
      toast.success('Permissions ajustées')
      fetchRBAC()
    } catch (e) {
      toast.error("Erreur de modification")
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-blue-600 rounded-full" />
            <p className="subheading text-blue-600">Sécurité Globale</p>
          </div>
          <h1 className="heading-xl">Rôles & Accès</h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
            Définissez les privilèges (RBAC) granulaires. Ces rôles sont appliqués à l'ensemble du système et régissent l'accès aux différents modules.
          </p>
        </div>
        
        <form onSubmit={handleCreateRole} className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-xl">
          <Input 
            placeholder="Nom du rôle (ex: auditeur)" 
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            className="h-12 border-slate-200 bg-white font-semibold" 
          />
          <Input 
            placeholder="Description (optionnel)" 
            value={newRoleDesc}
            onChange={(e) => setNewRoleDesc(e.target.value)}
            className="h-12 border-slate-200 bg-white" 
          />
          <Button 
            type="submit"
            disabled={isCreating}
            className="h-12 px-6 bg-slate-900 hover:bg-black text-white font-bold whitespace-nowrap"
          >
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Nouveau
          </Button>
        </form>
      </div>

      <div className="grid gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="premium-card overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 capitalize">{role.name.replace(/_/g, ' ')}</CardTitle>
                  <CardDescription className="text-sm font-medium text-slate-500">{role.description || 'Appliqué avec des permissions standard.'}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Key className="h-3 w-3" /> Privilèges d'Accès
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {permissions.map(perm => {
                  const hasPerm = role.role_permissions?.some((rp: any) => rp.permissions?.id === perm.id)
                  // Super Admin cannot be restricted via UI safely
                  const isLocked = role.name === 'super_admin'
                  
                  return (
                    <button
                      key={perm.id}
                      disabled={isLocked}
                      onClick={() => togglePermission(role.id, perm.id, role.role_permissions || [])}
                      className={`text-left flex items-start gap-3 p-4 rounded-xl border transition-all ${
                        hasPerm 
                          ? 'bg-blue-50/50 border-blue-200 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]' 
                          : 'bg-white border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100'
                      } ${isLocked ? 'cursor-not-allowed opacity-50 grayscale' : ''}`}
                    >
                      <div className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-md flex items-center justify-center ${hasPerm ? 'bg-blue-600 text-white' : 'bg-slate-100 text-transparent'}`}>
                        <Check className="h-3 w-3" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${hasPerm ? 'text-blue-900' : 'text-slate-600'}`}>{perm.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1">{perm.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
        {roles.length === 0 && !loading && (
           <div className="py-20 text-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-3xl">
             Veuillez exécuter la migration de base de données pour voir les rôles.
           </div>
        )}
      </div>
    </div>
  )
}
