'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, UserPlus, ShieldAlert } from "lucide-react"
import { toast } from 'sonner'
import { useAppContext } from '@/context/AppContext'

type Permission = {
  key: string
  label: string
}

const PERMISSIONS_LIST: Permission[] = [
  { key: 'dashboard', label: 'Voir le tableau de bord' },
  { key: 'staff', label: 'Gérer les utilisateurs' },
  { key: 'sales', label: 'Consulter les ventes' },
  { key: 'cash', label: 'Gérer les encaissements' },
  { key: 'revenue', label: 'Voir les rapports financiers' },
  { key: 'settings', label: 'Modifier les paramètres' },
  { key: 'establishments', label: 'Gérer les établissements / points de vente' },
  { key: 'stats', label: 'Voir les statistiques' },
  { key: 'export', label: 'Exporter des données' },
]

const ROLE_PRESETS: Record<string, { label: string, perms: string[] }> = {
  "ADMIN": { 
    label: "Administrateur", 
    perms: ['dashboard', 'staff', 'sales', 'cash', 'revenue', 'settings', 'establishments', 'stats', 'export'] 
  },
  "CASHIER": { 
    label: "Gérant (Caisse)", 
    perms: ['dashboard', 'staff', 'sales', 'cash', 'revenue', 'stats', 'export'] 
  },
  "WAITER": { 
    label: "Serveur", 
    perms: ['dashboard', 'sales', 'staff', 'stats'] 
  },
  "BARMAN": { 
    label: "Barman", 
    perms: ['dashboard', 'revenue', 'stats', 'export'] 
  },
}

interface CreateUserModalProps {
  onSuccess: () => void
}

export function CreateUserModal({ onSuccess }: CreateUserModalProps) {
  const { getAuthToken } = useAppContext()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'ADMIN'
  })
  
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})

  // Apply preset permissions when role changes
  useEffect(() => {
    const preset = ROLE_PRESETS[formData.role]?.perms || []
    const newPerms: Record<string, boolean> = {}
    PERMISSIONS_LIST.forEach(p => {
      newPerms[p.key] = preset.includes(p.key)
    })
    setPermissions(newPerms)
  }, [formData.role])

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const togglePermission = (key: string) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        permissions
      }

      const token = getAuthToken()
      console.log("[CreateUserModal] Token for request:", token ? (token.substring(0, 10) + "...") : "null")
      
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création')
      }

      toast.success("Utilisateur créé avec succès. Un email d'activation a été envoyé.")
      setOpen(false)
      setFormData({ firstName: '', lastName: '', email: '', phone: '', role: 'ADMIN' })
      onSuccess()

    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 gap-2 h-12 px-6 rounded-xl">
          <UserPlus className="h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-card/90 backdrop-blur-3xl border-white/10 shadow-2xl rounded-[2rem] p-0 scrollbar-hide">
        <DialogHeader className="p-6 md:p-8 border-b border-white/5 sticky top-0 bg-transparent z-10">
          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
             Créer un compte <Badge variant="outline" className="text-primary border-primary bg-primary/10">SaaS</Badge>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Remplissez les informations ci-dessous pour inviter un nouveau membre. Un email sécurisé lui sera envoyé.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Informations Générales */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-white/5 pb-2">Informations Générales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">Prénom *</Label>
                <Input required value={formData.firstName} onChange={e => updateForm('firstName', e.target.value)} className="bg-white/5 border-white/5 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">Nom *</Label>
                <Input required value={formData.lastName} onChange={e => updateForm('lastName', e.target.value)} className="bg-white/5 border-white/5 font-bold" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">Email *</Label>
                <Input type="email" required value={formData.email} onChange={e => updateForm('email', e.target.value)} className="bg-white/5 border-white/5 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">Téléphone *</Label>
                <Input type="tel" required value={formData.phone} onChange={e => updateForm('phone', e.target.value)} className="bg-white/5 border-white/5 font-bold" />
              </div>
            </div>
          </div>

          {/* Rôle et Permissions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Rôle & Sécurité</h3>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground">Fonction assignée</Label>
              <Select value={formData.role} onValueChange={v => v && updateForm('role', v)}>
                <SelectTrigger className="w-full bg-white/5 border-white/5 font-bold h-12">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 font-bold">
                  {Object.entries(ROLE_PRESETS).map(([id, data]) => (
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
                      id={`perm-${perm.key}`} 
                      checked={permissions[perm.key] || false}
                      onCheckedChange={() => togglePermission(perm.key)}
                      className="data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor={`perm-${perm.key}`} className="text-xs font-medium leading-snug cursor-pointer flex-1">
                      {perm.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3 sticky bottom-0 bg-transparent border-t border-white/5 py-4">
             <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1 font-bold h-12">Annuler</Button>
             <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-primary/20">
               {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Créer l'utilisateur"}
             </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
