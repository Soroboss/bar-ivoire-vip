'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, 
  Building2, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldAlert,
  Percent,
  Calendar,
  ChevronRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { saasService } from '@/services/saasService'
import { UserSubscription, Plan } from '@/types'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'trial' | 'active' | 'expired' | 'suspended'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [subsData, plansData] = await Promise.all([
        saasService.getSubscriptions(),
        saasService.getPlans()
      ])
      setSubscriptions(subsData)
      setPlans(plansData)
    } catch (error) {
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const filteredSubs = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.establishments?.name?.toLowerCase().includes(search.toLowerCase()) ||
      sub.establishments?.owner?.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">Actif</Badge>
      case 'trial': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">Essai</Badge>
      case 'expired': return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">Expiré</Badge>
      case 'suspended': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">Suspendu</Badge>
      default: return <Badge className="bg-white/10 text-white/40 border-white/20 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
            <CreditCard className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Flux Financiers</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            Abonnements <span className="gold-gradient-text">Partenaires</span>
          </h1>
          <p className="text-muted-foreground/60 text-sm max-w-xl font-medium leading-relaxed">
            Gérez les accès, validez les forfaits, appliquez des remises et suivez l'état des abonnements de vos établissements partenaires.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-sidebar/40 border border-white/5 rounded-3xl backdrop-blur-sm">
          <StatMini label="Actifs" value={subscriptions.filter(s => s.status === 'active').length} color="text-emerald-500" />
          <StatMini label="En Essai" value={subscriptions.filter(s => s.status === 'trial').length} color="text-blue-500" />
          <StatMini label="Expirés" value={subscriptions.filter(s => s.status === 'expired').length} color="text-orange-500" />
          <StatMini label="Total" value={subscriptions.length} color="text-white" />
        </div>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Rechercher un établissement ou propriétaire..." 
            className="bg-sidebar/40 border-white/5 pl-12 h-14 rounded-2xl text-white font-medium focus:ring-primary/20 placeholder:text-muted-foreground/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 self-stretch md:self-auto">
          {['all', 'active', 'trial', 'expired', 'suspended'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f as any)}
              className={cn(
                "px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                statusFilter === f 
                  ? "bg-primary text-black shadow-lg shadow-primary/10" 
                  : "text-muted-foreground/40 hover:text-white hover:bg-white/5"
              )}
            >
              {f === 'all' ? 'Tous' : f === 'trial' ? 'Essai' : f === 'active' ? 'Activés' : f === 'expired' ? 'Expirés' : 'Suspendus'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Table (Card Style) */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredSubs.map((sub, index) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group relative overflow-hidden bg-sidebar/40 border-white/5 hover:border-white/10 p-6 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center gap-8 items-start">
                  
                  {/* Establishment Info */}
                  <div className="flex items-center gap-5 min-w-[300px]">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      {sub.establishments?.logo_url ? (
                        <img src={sub.establishments.logo_url} className="h-full w-full object-cover rounded-2xl" />
                      ) : (
                        <Building2 className="h-8 w-8 text-muted-foreground/40" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors">{sub.establishments?.name}</h3>
                      <p className="text-xs text-muted-foreground/40 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                         {sub.establishments?.owner} <span className="h-1 w-1 rounded-full bg-white/20" /> {sub.establishments?.location}
                      </p>
                    </div>
                  </div>

                  {/* Plan & Status */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-10 flex-1">
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em]">Forfait Actuel</p>
                       <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-primary" />
                         </div>
                         <span className="font-black text-white uppercase text-[11px] tracking-widest">{sub.saas_plans?.name || sub.plan}</span>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em]">Statut & Échéance</p>
                       <div className="flex items-center gap-4">
                         {getStatusBadge(sub.status)}
                         <span className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> 
                            {sub.expires_at ? format(new Date(sub.expires_at), "d MMM yyyy", { locale: fr }) : 'N/A'}
                         </span>
                       </div>
                    </div>

                    <div className="hidden md:block space-y-2">
                       <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em]">Remises Appliquées</p>
                       {sub.discount_amount > 0 || sub.discount_percent > 0 ? (
                         <div className="flex items-center gap-2 text-emerald-500">
                           <Percent className="h-3 w-3" />
                           <span className="text-[10px] font-black">-{sub.discount_percent}% / -{sub.discount_amount.toLocaleString()} FCFA</span>
                         </div>
                       ) : (
                         <span className="text-[10px] text-muted-foreground/20 font-bold uppercase italic">Aucune remise</span>
                       )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 self-end lg:self-center">
                    <Button variant="ghost" className="h-14 w-14 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                    <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/80 text-black font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/10">
                      Gérer l'accès
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StatMini({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="px-4 py-1 text-center border-r border-white/5 last:border-0">
      <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest mb-1">{label}</p>
      <p className={cn("text-xl font-black leading-none", color)}>{value}</p>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
