'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Loader2,
  Mail
} from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { supabaseService } from "@/services/supabaseService"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function EstablishmentsAdmin() {
  const { allEstablishments, validateEstablishment, loading } = useAppContext()
  const [isMounted, setIsMounted] = useState(false)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || loading) {
    return <div className="p-8 text-center text-[#A0A0B8]">Chargement de la base centrale...</div>
  }

  const filtered = allEstablishments.filter(e => {
    const matchesFilter = filter === 'All' || e.status === filter || e.plan === filter
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                          e.owner.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const updatePlan = async (id: string, plan: string) => {
    try {
      await supabaseService.updateEstablishmentPlan(id, plan)
      toast.success(`Forfait mis à jour : ${plan}`)
      // Reload or update state
      window.location.reload()
    } catch (e) {
      toast.error('Erreur Plan')
    }
  }

  const [validatingId, setValidatingId] = useState<string | null>(null)

  const handleValidateAndNotify = async (est: any) => {
    setValidatingId(est.id)
    try {
      // 1. Activer l'établissement
      await validateEstablishment(est.id, 'Active')
      
      // 2. Récupérer l'email de l'utilisateur
      const { data: profile } = await supabase
        .from('establishments')
        .select('user_id')
        .eq('id', est.id)
        .single()
      
      if (profile?.user_id) {
        // Chercher l'email dans auth via les profils ou le user_id
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', profile.user_id)
          .single()
        
        const email = userProfile?.email
        if (email) {
          // 3. Envoyer l'email de création de mot de passe
          await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://ivoire-bar-vip.vercel.app/auth/update-password',
          })
          toast.success(`✅ Validé ! Email d'activation envoyé à ${email}`)
        } else {
          toast.success('✅ Établissement validé (email non trouvé, notification manuelle requise)')
        }
      }
    } catch (e) {
      toast.error('Erreur lors de la validation')
    } finally {
      setValidatingId(null)
    }
  }

  return (
    <div className="p-6 space-y-8 bg-[#0F0F1A] text-[#F4E4BC] min-h-screen">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestion des <span className="text-[#D4AF37]">Régies</span></h1>
          <p className="text-[#A0A0B8]">Contrôlez les accès et les abonnements des bars.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#3A3A5A] text-[#A0A0B8] hover:bg-white/5">
            <Filter className="h-4 w-4 mr-2" /> Filtrer
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
          <Input 
            placeholder="Rechercher un bar ou un gérant..." 
            className="pl-10 bg-[#1A1A2E] border-[#3A3A5A] text-white focus:border-[#D4AF37]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-[#1A1A2E] p-1 rounded-xl border border-[#3A3A5A]">
          {['All', 'Active', 'Pending', 'Trial', 'Business', 'VIP'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-[#D4AF37] text-[#1A1A2E]' : 'text-[#A0A0B8] hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card className="bg-[#1A1A2E] border-[#3A3A5A] shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0F0F1A]/50 border-b border-[#3A3A5A]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-[#A0A0B8] uppercase text-[10px]">Identité</TableHead>
              <TableHead className="text-[#A0A0B8] uppercase text-[10px]">Status</TableHead>
              <TableHead className="text-[#A0A0B8] uppercase text-[10px]">Forfait</TableHead>
              <TableHead className="text-[#A0A0B8] uppercase text-[10px]">Contact</TableHead>
              <TableHead className="text-right text-[#A0A0B8] uppercase text-[10px]">Actions Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((est) => (
              <TableRow key={est.id} className="border-b-[#3A3A5A] hover:bg-white/5 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">{est.name}</p>
                      <p className="text-[10px] text-[#A0A0B8] uppercase">{est.type} • {est.location}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`
                    ${est.status === 'Active' ? 'bg-green-500/10 text-green-400' : ''}
                    ${est.status === 'Pending' ? 'bg-orange-500/10 text-orange-400' : ''}
                    ${est.status === 'Suspended' ? 'bg-red-500/10 text-red-400' : ''}
                    border-none
                  `}>
                    {est.status === 'Active' ? 'Actif' : est.status === 'Pending' ? 'En attente' : 'Suspendu'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <select 
                    value={est.plan} 
                    onChange={(e) => updatePlan(est.id, e.target.value)}
                    className="bg-[#0F0F1A] border border-[#3A3A5A] text-xs font-bold text-[#D4AF37] rounded-lg p-1 outline-none"
                  >
                    <option value="Trial">ESSAI (7J)</option>
                    <option value="Business">BUSINESS</option>
                    <option value="VIP">PREMIUM VIP</option>
                    <option value="Enterprise">ENTERPRISE</option>
                  </select>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-white">{est.owner}</p>
                  <p className="text-[10px] text-[#A0A0B8]">{est.phone}</p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {est.status !== 'Active' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleValidateAndNotify(est)}
                        disabled={validatingId === est.id}
                        className="bg-green-600 hover:bg-green-700 h-8 px-4"
                      >
                        {validatingId === est.id ? (
                          <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Envoi...</>
                        ) : (
                          <><Mail className="h-3 w-3 mr-1" /> Valider & Notifier</>
                        )}
                      </Button>
                    )}
                    {est.status === 'Active' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => validateEstablishment(est.id, 'Suspended')}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10 h-8"
                      >
                        Suspendre
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-[#A0A0B8] hover:text-[#D4AF37]">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
