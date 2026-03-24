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
import { supabaseService } from '@/services/supabaseService'
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
      const newExpiry = await supabaseService.renewEstablishment(
        establishment.id,
        parseInt(months),
        plan,
        parseInt(amount)
      )
      toast.success(`Abonnement de ${establishment.name} renouvelé !`)
      onSuccess(newExpiry.toISOString())
      onClose()
    } catch (error) {
      toast.error("Erreur lors du renouvellement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-lg rounded-2xl overflow-hidden shadow-2xl p-0 gap-0">
        <div className="p-8 border-b border-slate-50">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50">
                <CreditCard className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight">Renouvellement Manuel</DialogTitle>
            </div>
            <DialogDescription className="text-slate-500 font-medium">
              Prolongez l'accès de l'établissement <span className="text-slate-900 font-bold">{establishment.name}</span> en enregistrant une transaction hors-ligne.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid gap-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Durée de l'Abonnement</Label>
              <Select value={months} onValueChange={(val) => setMonths(val as string)}>
                <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100 rounded-xl font-semibold focus:ring-blue-600/20">
                  <SelectValue placeholder="Choisir la durée" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-100 rounded-xl">
                  <SelectItem value="1" className="font-medium">1 Mois</SelectItem>
                  <SelectItem value="3" className="font-medium">3 Mois</SelectItem>
                  <SelectItem value="6" className="font-medium">6 Mois</SelectItem>
                  <SelectItem value="12" className="font-medium">1 An (Promotion)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Type de Forfait</Label>
              <Select value={plan} onValueChange={(val) => setPlan(val as any)}>
                <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100 rounded-xl font-semibold focus:ring-blue-600/20">
                  <SelectValue placeholder="Choisir le plan" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-100 rounded-xl">
                  <SelectItem value="Starter" className="font-medium">Starter Pack</SelectItem>
                  <SelectItem value="Business" className="font-medium">Business Pro</SelectItem>
                  <SelectItem value="VIP" className="font-medium">VIP Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Contribution (XOF)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 bg-slate-50/50 border-slate-100 rounded-xl pl-4 pr-12 font-bold focus:ring-blue-600/20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300">CFA</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-50/50 p-6 border-t border-slate-100 mt-0 gap-3 sm:gap-0">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="h-12 px-6 rounded-xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all font-montserrat"
          >
            ANNULER
          </Button>
          <Button 
            onClick={handleRenew}
            disabled={loading}
            className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-100 flex items-center gap-2 font-montserrat uppercase tracking-wider text-xs"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Confirmer l'extension
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
