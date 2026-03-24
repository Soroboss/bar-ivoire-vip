'use client'

import React, { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar, CreditCard, CheckCircle2, Loader2 } from 'lucide-react'
import { Establishment } from '@/types'
import { insforgeService } from '@/services/insforgeService'
import { toast } from 'sonner'

interface AdminRenewalModalProps {
  establishment: Establishment | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (newExpiry: string) => void
}

export function AdminRenewalModal({ establishment, isOpen, onClose, onSuccess }: AdminRenewalModalProps) {
  const [months, setMonths] = useState("1")
  const [plan, setPlan] = useState(establishment?.plan || "Business")
  const [amount, setAmount] = useState("50000") // Valeur par défaut indicative
  const [loading, setLoading] = useState(false)

  if (!establishment) return null

  const handleRenew = async () => {
    setLoading(true)
    try {
      await insforgeService.renewEstablishment(
        establishment.id,
        parseInt(months),
        plan,
        parseInt(amount)
      )
      toast.success(`Abonnement de ${establishment.name} renouvelé !`)
      onSuccess(new Date().toISOString()) // Just pass a string for now since we don't return trialEndsAt easily
      onClose()
    } catch (error) {
      toast.error("Erreur lors du renouvellement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card/90 border border-white/10 text-white max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl p-0 gap-0 backdrop-blur-3xl">
        <div className="p-10 border-b border-white/5 bg-white/[0.02]">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10 shadow-xl group-hover:rotate-6 transition-all duration-500">
                <CreditCard className="h-7 w-7" />
              </div>
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Renouvellement <span className="gold-gradient-text">Elite</span></DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground/60 font-medium uppercase tracking-widest text-[10px] italic">
              Prolongez l'accès de l'unité <span className="text-primary font-black">{establishment.name}</span> via protocole manuel.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-10 space-y-8">
          <div className="grid gap-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] pl-1 italic">Durée de l'Abonnement</Label>
              <Select value={months} onValueChange={(val) => setMonths(val as string)}>
                <SelectTrigger className="h-16 bg-white/5 border-white/5 rounded-2xl font-black text-white italic uppercase tracking-tight focus:ring-primary/20">
                  <SelectValue placeholder="Choisir la durée" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-white/10 rounded-2xl shadow-2xl">
                  <SelectItem value="1" className="font-black text-[10px] uppercase tracking-widest italic py-4 focus:bg-primary/20">1 Mois Standard</SelectItem>
                  <SelectItem value="3" className="font-black text-[10px] uppercase tracking-widest italic py-4 focus:bg-primary/20">3 Mois Business</SelectItem>
                  <SelectItem value="6" className="font-black text-[10px] uppercase tracking-widest italic py-4 focus:bg-primary/20">6 Mois Premium</SelectItem>
                  <SelectItem value="12" className="font-black text-[10px] uppercase tracking-widest italic py-4 focus:bg-primary/20">1 An Elite (Promotion)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] pl-1 italic">Type de Forfait</Label>
              <Select value={plan} onValueChange={(val) => setPlan(val as any)}>
                <SelectTrigger className="h-16 bg-white/5 border-white/5 rounded-2xl font-black text-white italic uppercase tracking-tight focus:ring-primary/20">
                  <SelectValue placeholder="Choisir le plan" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-white/10 rounded-2xl shadow-2xl">
                  <SelectItem value="Starter" className="font-black text-[10px] uppercase tracking-widest italic py-4 focus:bg-primary/20">Starter Pack</SelectItem>
                  <SelectItem value="Business" className="font-black text-[10px] uppercase tracking-widest italic py-4 focus:bg-primary/20">Business Pro</SelectItem>
                  <SelectItem value="VIP" className="font-black text-[10px] uppercase tracking-widest italic py-4 focus:bg-primary/20">VIP Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] pl-1 italic">Contribution (XOF)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-16 bg-white/5 border-white/5 rounded-2xl px-6 font-black text-white italic text-lg focus:ring-primary/20"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary uppercase tracking-widest">FCFA</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-white/[0.02] p-8 border-t border-white/5 mt-0 gap-4 flex-row items-center justify-end">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="h-14 px-8 rounded-2xl font-black text-muted-foreground/30 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest text-[10px] italic"
          >
            ANNULER
          </Button>
          <Button 
            onClick={handleRenew}
            disabled={loading}
            className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black transition-all shadow-2xl shadow-primary/20 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px]"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
            Confirmer l'extension
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
