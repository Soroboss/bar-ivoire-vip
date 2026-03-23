'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  Zap, 
  MapPin, 
  Clock, 
  Mail, 
  CreditCard, 
  XCircle, 
  ArrowRight, 
  Loader2 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppContext } from "@/context/AppContext"
import { useState, useEffect } from "react"
import { supabaseService } from "@/services/supabaseService"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { AdminRenewalModal } from "../../components/AdminRenewalModal"
import { motion, AnimatePresence, Variants } from "framer-motion"

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
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="space-y-6 animate-pulse">
          <div className="relative">
             <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
               <Building2 className="h-8 w-8 text-primary" />
             </div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2">
               <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
             </div>
          </div>
          <p className="text-primary text-xs font-black uppercase tracking-[0.3em] italic">Initialisation du Registre Réseau...</p>
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
      toast.success(`Directive de plan mise à jour : ${plan}`)
      window.location.reload()
    } catch (e) {
      toast.error('Échec de la directive plan')
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
          toast.success(`Activation déployée ! Email envoyé à ${email}`)
        } else {
          toast.success('Validation réussie (canal email non détecté)')
        }
      }
    } catch (e) {
      toast.error('Erreur de protocole validation')
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.05 } 
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 md:p-10 space-y-10 bg-background text-foreground min-h-screen selection:bg-primary/20"
    >
      {/* Strategic Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
               <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Registre Militaire des Unités</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter italic uppercase leading-none">
            Gestion <span className="gold-gradient-text">Stratégique</span>
          </h1>
          <p className="text-muted-foreground text-base border-l-2 border-primary pl-4 max-w-xl font-medium">
            Surveillance et déploiement logiciel sur l'ensemble du réseau <span className="text-foreground italic">Ivoire Bar VIP</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-card px-6 py-4 rounded-[1.5rem] border border-border shadow-sm flex items-center gap-4 group hover:border-primary/30 transition-all duration-300">
             <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
               <Building2 className="h-5 w-5" />
             </div>
             <div>
               <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Actifs Totaux</p>
               <p className="text-2xl font-black text-foreground leading-none">{allEstablishments.length}</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Control Navigation Bar */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full max-w-2xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50" />
          <input 
            placeholder="Rechercher une unité, un commandant ou une zone..." 
            className="pl-12 w-full bg-card border-border text-foreground focus:border-primary/50 h-14 rounded-2xl text-sm placeholder:text-muted-foreground/50 transition-all outline-none border shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex bg-muted/30 p-1.5 rounded-2xl border border-border overflow-x-auto w-full lg:w-auto">
          {['All', 'Active', 'Pending', 'Trial', 'Business', 'VIP'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-muted-foreground hover:text-primary hover:bg-muted/50'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20 border-b border-border">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-primary uppercase text-[9px] font-black tracking-[0.2em] py-8 pl-10">Désignation Unité</TableHead>
                  <TableHead className="text-primary uppercase text-[9px] font-black tracking-[0.2em] py-8">Statut Réseau</TableHead>
                  <TableHead className="text-primary uppercase text-[9px] font-black tracking-[0.2em] py-8">Plan de Déploiement</TableHead>
                  <TableHead className="text-primary uppercase text-[9px] font-black tracking-[0.2em] py-8">Liaison Commandant</TableHead>
                  <TableHead className="text-right text-primary uppercase text-[9px] font-black tracking-[0.2em] py-8 pr-10">Commandes Tactiques</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filtered.map((est, i) => {
                    const daysLeft = getDaysRemaining(est.trialEndsAt)
                    const isExpired = daysLeft <= 0

                    return (
                      <motion.tr 
                        key={est.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: i * 0.02 }}
                        className="border-b border-border hover:bg-muted/30 transition-colors group cursor-default"
                      >
                        <TableCell className="pl-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="relative">
                               <div className="h-14 w-14 rounded-[1.25rem] bg-gradient-to-br from-primary/10 to-transparent border border-border flex items-center justify-center text-primary group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
                                <Building2 className="h-7 w-7" />
                               </div>
                               <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${isExpired ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 shadow-sm'}`} />
                            </div>
                            <div>
                               <p className="font-black text-foreground text-lg group-hover:text-primary transition-colors uppercase italic tracking-tighter leading-none mb-1">{est.name || 'UNITÉ INCONNUE'}</p>
                               <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-1.5 mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                 <Zap className="h-2 w-2 text-primary heartbeat-glow" /> {est.type || 'BAR'} <span className="text-muted-foreground/20">•</span> <MapPin className="h-2.5 w-2.5" /> {est.location || 'ZONE INCONNUE'}
                               </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="flex flex-col gap-2">
                            <div className={`w-fit px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest shadow-sm ${
                              est.status === 'Active' && !isExpired ? 'border-emerald-500/30 text-emerald-600 bg-emerald-50' :
                              est.status === 'Active' && isExpired ? 'border-red-500/30 text-white bg-red-600 shadow-lg shadow-red-500/20 animate-pulse' :
                              est.status === 'Pending' ? 'border-orange-500/30 text-orange-600 bg-orange-50' : 'border-red-500/30 text-red-600 bg-red-50'
                            }`}>
                              {est.status === 'Active' && isExpired ? 'CRITICAL EXPIRY' : est.status === 'Active' ? 'SYNC ACTIVE' : est.status === 'Pending' ? 'EN ATTENTE' : 'SUSPENDU'}
                            </div>
                            <div className="flex items-center gap-1.5 ml-1">
                              <div className={`h-1.5 w-1.5 rounded-full ${isExpired ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                              <span className="text-[8px] text-muted-foreground uppercase font-black">Liaison Sécurisée</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="space-y-2">
                            <select 
                              value={est.plan} 
                              onChange={(e) => updatePlan(est.id, e.target.value)}
                              className="bg-muted border border-border text-[10px] font-black text-primary rounded-xl px-4 py-2 outline-none cursor-pointer hover:border-primary/50 transition-colors uppercase italic tracking-widest focus:ring-1 focus:ring-primary/30"
                            >
                              <option value="Trial">PROT. ESSAI</option>
                              <option value="Business">CORP. BUSINESS</option>
                              <option value="VIP">PREMIUM ELITE</option>
                            </select>
                            <div className="flex items-center gap-2 pl-2">
                              <Clock className={`h-3 w-3 ${isExpired ? 'text-red-500 heartbeat-glow' : 'text-primary'}`} />
                              <span className={`text-[10px] font-black uppercase tracking-tighter ${isExpired ? 'text-red-500 italic' : 'text-foreground'}`}>
                                {isExpired ? 'ÉCHÉANCE DÉPASSÉE' : `${daysLeft} JOURS RESTANTS`}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="space-y-1">
                            <p className="text-sm text-foreground font-black uppercase italic tracking-tight">{est.owner || 'COMMANDANT N/A'}</p>
                            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-muted border border-border w-fit group-hover:border-primary/40 transition-all cursor-pointer">
                              <Mail className="h-3 w-3 text-primary" />
                              <span className="text-[10px] text-muted-foreground font-semibold tracking-tighter">{est.phone || 'LIAISON INDISPONIBLE'}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-10 py-6">
                          <div className="flex justify-end gap-3">
                            {est.status === 'Pending' && (
                              <Button 
                                onClick={() => handleValidateAndNotify(est)}
                                disabled={validatingId === est.id}
                                className="bg-emerald-600 hover:bg-emerald-700 h-11 px-6 font-black text-[10px] uppercase shadow-lg shadow-emerald-500/20 rounded-2xl group transition-all hover:scale-105 active:scale-95"
                              >
                                {validatingId === est.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                                ) : (
                                  <span className="flex items-center gap-2 text-white">DEPLOYER RESEAU <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" /></span>
                                )}
                              </Button>
                            )}
                            
                            <Button 
                              onClick={() => {
                                setSelectedEst(est)
                                setIsRenewalOpen(true)
                              }}
                              className="bg-primary hover:bg-primary/90 text-white h-11 px-6 font-black text-[10px] uppercase shadow-lg shadow-primary/20 rounded-2xl transition-all hover:scale-105 active:scale-95"
                            >
                              <CreditCard className="h-4 w-4 mr-2" /> RENOUVELER
                            </Button>
    
                            {est.status === 'Active' && (
                              <Button 
                                variant="ghost"
                                onClick={() => validateEstablishment(est.id, 'Suspended')}
                                className="h-11 w-11 text-red-500/20 hover:text-red-500 hover:bg-red-50 rounded-2xl border border-border transition-all"
                                title="INTERROMPRE"
                              >
                                <XCircle className="h-5 w-5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>

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
    </motion.div>
  )
}
