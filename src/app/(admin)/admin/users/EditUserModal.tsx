'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, UserCog, ShieldAlert } from "lucide-react"
import { toast } from 'sonner'
import { insforgeService } from '@/services/insforgeService'
import { Profile } from '@/types'

const PERMISSIONS_LIST = [
  { key: 'dashboard', label: 'Voir le tableau de bord' },
  { key: 'staff', label: 'Gérer les utilisateurs' },
  { key: 'sales', label: 'Consulter les ventes' },
  { key: 'cash', label: 'Gérer les encaissements' },
  { key: 'revenue', label: 'Voir les rapports financiers' },
  { key: 'settings', label: 'Modifier les paramètres' },
  { key: 'establishments', label: 'Gérer les établissements' },
  { key: 'stats', label: 'Voir les statistiques' },
  { key: 'export', label: 'Exporter des données' },
]

const ROLE_PRESETS: Record<string, { label: string }> = {
  "ADMIN": { label: "Administrateur" },
  "CASHIER": { label: "Gérant (Caisse)" },
  "WAITER": { label: "Serveur" },
  "BARMAN": { label: "Barman" },
  "SUPER_ADMIN": { label: "Super Admin" },
}

interface EditUserModalProps {
  user: Profile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  currentUserRole?: string | null
}

export function EditUserModal({ user, open, onOpenChange, onSuccess, currentUserRole }: EditUserModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'ADMIN'
  })
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'ADMIN'
      })
      setPermissions(user.permissions || {})
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    try {
      await insforgeService.updateUser(user.id, {
        full_name: formData.fullName,
        phone: formData.phone,
        role: formData.role,
        permissions: permissions
      })
      toast.success("Profil mis à jour avec succès")
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-card/90 backdrop-blur-3xl border-white/10 shadow-2xl rounded-[2rem] p-0 scrollbar-hide">
        <DialogHeader className="p-6 md:p-8 border-b border-white/5 sticky top-0 bg-transparent z-10">
          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
             Modifier le profil <Badge variant="outline" className="text-primary border-primary bg-primary/10">SaaS</Badge>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Mettez à jour les informations et les privilèges de {formData.fullName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-white/5 pb-2">Informations Générales</h3>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground">Nom Complet *</Label>
              <Input required value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} className="bg-white/5 border-white/5 font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 opacity-50">
                <Label className="text-xs font-bold text-muted-foreground">Email (non modifiable)</Label>
                <Input disabled value={formData.email} className="bg-white/5 border-white/5 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">Téléphone *</Label>
                <Input type="tel" required value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/5 font-bold" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Rôle & Sécurité</h3>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground">Fonction assignée</Label>
              <Select value={formData.role} onValueChange={v => v && setFormData(p => ({ ...p, role: v }))}>
                <SelectTrigger className="w-full bg-white/5 border-white/5 font-bold h-12">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 font-bold">
                  {Object.entries(ROLE_PRESETS)
                    .filter(([id]) => id !== 'SUPER_ADMIN' || currentUserRole === 'SUPER_ADMIN')
                    .map(([id, data]) => (
                      <SelectItem key={id} value={id}>{data.label}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mt-4 space-y-4">
               <div className="flex items-center gap-2 mb-2">
                 <ShieldAlert className="h-4 w-4 text-primary" />
                 <p className="text-sm font-bold text-white">Ajustement des permissions</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {PERMISSIONS_LIST.map((perm) => (
                   <div key={perm.key} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                     <Switch 
                       id={`edit-perm-${perm.key}`} 
                       checked={permissions[perm.key] || false}
                       onCheckedChange={() => setPermissions(p => ({ ...p, [perm.key]: !p[perm.key] }))}
                       className="data-[state=checked]:bg-primary"
                     />
                     <Label htmlFor={`edit-perm-${perm.key}`} className="text-xs font-medium leading-snug cursor-pointer flex-1">
                       {perm.label}
                     </Label>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3 sticky bottom-0 bg-transparent border-t border-white/5 py-4">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 font-bold h-12">Annuler</Button>
             <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-primary/20">
               {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Mettre à jour"}
             </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
