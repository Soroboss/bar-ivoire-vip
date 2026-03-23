'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2,
  Search,
  XCircle,
  Clock,
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

import { AdminRenewalModal } from "../../components/AdminRenewalModal"

export default function EstablishmentsContent() {
  const context = useAppContext()
  const [isMounted, setIsMounted] = useState(false)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedEst, setSelectedEst] = useState<any>(null)
  const [isRenewalOpen, setIsRenewalOpen] = useState(false)
  const [validatingId, setValidatingId] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !context || context.loading) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37] mx-auto" />
          <p className="text-[#A0A0B8] text-sm italic">Chargement des régies stratégiques...</p>
        </div>
      </div>
    )
  }

  const { allEstablishments = [], validateEstablishment } = context

  const filtered = (allEstablishments || []).filter(e => {
    const matchesFilter = filter === 'All' || e.status === filter || e.plan === filter
    const name = e.name || ''
    const owner = e.owner || ''
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                          owner.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const updatePlan = async (id: string, plan: string) => {
    try {
      await supabaseService.renewEstablishment(id, 0, plan, 0)
      toast.success(`Forfait mis à jour : ${plan}`)
      window.location.reload()
    } catch (e) {
      toast.error('Erreur Plan')
    }
  }

  const handleValidateAndNotify = async (est: any) => {
    setValidatingId(est.id)
    try {
      await validateEstablishment(est.id, 'Active')
      
      const { data: profile } = await supabase
        .from('establishments')
        .select('user_id')
        .eq('id', est.id)
        .single()
      
      if (profile?.user_id) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', profile.user_id)
          .single()
        
        const email = userProfile?.email
        if (email) {
          await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://ivoire-bar-vip.vercel.app/auth/update-password',
          })
          toast.success(`✅ Validé ! Email d'activation envoyé à ${email}`)
        } else {
          toast.success('✅ Établissement validé (email non trouvé)')
        }
      }
    } catch (e) {
      toast.error('Erreur lors de la validation')
    } finally {
      setValidatingId(null)
    }
  }

  const getDaysRemaining = (expiry: string) => {
    if (!expiry) return 0
    const expiryDate = new Date(expiry)
    if (isNaN(expiryDate.getTime())) return 0
    const diff = expiryDate.getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 3600 * 24))
  }

  return (
    <div className="p-6 space-y-8 bg-[#0F0F1A] text-[#F4E4BC] min-h-screen">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight italic uppercase">Gestion <span className="text-[#D4AF37]">Régies Globale</span></h1>
          <p className="text-[#A0A0B8] text-sm">Contrôlez les accès, les abonnements et les réactivations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-none px-4 py-2">
            {allEstablishments.length} Établissements Total
          </Badge>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3A3A5A]" />
          <Input 
            placeholder="Rechercher un bar, un gérant ou une ville..." 
            className="pl-10 bg-[#1A1A2E] border-[#3A3A5A] text-white focus:border-[#D4AF37] h-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-[#1A1A2E] p-1 rounded-xl border border-[#3A3A5A] overflow-x-auto">
          {['All', 'Active', 'Pending', 'Trial', 'Business', 'VIP'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[10px] uppercase font-black transition-all whitespace-nowrap ${filter === f ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-[#A0A0B8] hover:text-[#D4AF37]'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card className="bg-[#1A1A2E]/50 border-[#3A3A5A] shadow-2xl overflow-hidden backdrop-blur-xl">
        <Table>
          <TableHeader className="bg-black/30 border-b border-[#3A3A5A]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-[#D4AF37] uppercase text-[10px] font-black tracking-widest py-5">Établissement</TableHead>
              <TableHead className="text-[#D4AF37] uppercase text-[10px] font-black tracking-widest py-5">Status</TableHead>
              <TableHead className="text-[#D4AF37] uppercase text-[10px] font-black tracking-widest py-5">Forfait / Échéance</TableHead>
              <TableHead className="text-[#D4AF37] uppercase text-[10px] font-black tracking-widest py-5">Contact Gérant</TableHead>
              <TableHead className="text-right text-[#D4AF37] uppercase text-[10px] font-black tracking-widest py-5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((est) => {
              const daysLeft = getDaysRemaining(est.trialEndsAt)
              const isExpired = daysLeft <= 0

              return (
                <TableRow key={est.id} className="border-b-[#3A3A5A] hover:bg-white/5 transition-colors group">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-black border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">{est.name || 'Sans nom'}</p>
                        <p className="text-[10px] text-[#A0A0B8] uppercase">{est.type || 'Bar'} • {est.location || 'N/A'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`
                      ${est.status === 'Active' && !isExpired ? 'border-green-500/50 text-green-400 bg-green-500/5' : ''}
                      ${est.status === 'Active' && isExpired ? 'border-red-500/50 text-red-500 bg-red-500/10' : ''}
                      ${est.status === 'Pending' ? 'border-orange-500/50 text-orange-400 bg-orange-500/5' : ''}
                      ${est.status === 'Suspended' ? 'border-red-500/50 text-red-400 bg-red-500/5' : ''}
                      text-[10px] px-3 font-bold uppercase
                    `}>
                      {est.status === 'Active' && isExpired ? 'EXPIRÉ' : est.status === 'Active' ? 'Actif' : est.status === 'Pending' ? 'En attente' : 'Suspendu'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <select 
                        value={est.plan} 
                        onChange={(e) => updatePlan(est.id, e.target.value)}
                        className="bg-black/40 border border-[#3A3A5A] text-[10px] font-black text-[#D4AF37] rounded-lg p-1.5 outline-none mb-1 cursor-pointer"
                      >
                        <option value="Trial">ESSAI</option>
                        <option value="Business">BUSINESS</option>
                        <option value="VIP">PREMIUM VIP</option>
                      </select>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <Clock className={`h-3 w-3 ${isExpired ? 'text-red-500' : 'text-[#A0A0B8]'}`} />
                        <span className={isExpired ? 'text-red-500 font-bold' : 'text-[#A0A0B8]'}>
                          {isExpired ? 'Expiré' : `${daysLeft} jours restants`}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-white font-medium">{est.owner || 'N/A'}</p>
                    <p className="text-[10px] text-[#A0A0B8] flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {est.phone || 'N/A'}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {est.status === 'Pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleValidateAndNotify(est)}
                          disabled={validatingId === est.id}
                          className="bg-green-600 hover:bg-green-700 h-9 font-bold px-4 text-xs"
                        >
                          {validatingId === est.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Valider & Notifier'
                          )}
                        </Button>
                      )}
                      
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedEst(est)
                          setIsRenewalOpen(true)
                        }}
                        className="bg-[#D4AF37] hover:bg-[#B6962E] text-black h-9 font-bold px-4 text-xs"
                      >
                        <CreditCard className="h-3.5 w-3.5 mr-1" /> Renouveler
                      </Button>

                      {est.status === 'Active' && !isExpired && (
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => validateEstablishment(est.id, 'Suspended')}
                          className="border-[#3A3A5A] text-red-400 hover:bg-red-500/10 h-9 w-9"
                          title="Suspendre"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      {selectedEst && (
        <AdminRenewalModal 
          establishment={selectedEst}
          isOpen={isRenewalOpen}
          onClose={() => {
            setIsRenewalOpen(false)
            setSelectedEst(null)
          }}
          onSuccess={() => {
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
