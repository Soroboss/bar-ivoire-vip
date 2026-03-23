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
      <DialogContent className="bg-[#1A1A2E] border-[#3A3A5A] text-white">
        <DialogHeader>
          <DialogTitle className="text-[#D4AF37] flex items-center gap-2 text-2xl font-black italic uppercase">
            <CreditCard className="h-6 w-6" /> Renouvellement Manuel
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enregistrez un paiement reçu hors-ligne pour prolonger l'accès de <strong>{establishment.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-[#D4AF37]">Durée du renouvellement</Label>
            <Select value={months} onValueChange={(val) => setMonths(val as string)}>
              <SelectTrigger className="bg-black/50 border-[#3A3A5A]">
                <SelectValue placeholder="Choisir la durée" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A2E] border-[#3A3A5A] text-white">
                <SelectItem value="1">1 Mois</SelectItem>
                <SelectItem value="3">3 Mois</SelectItem>
                <SelectItem value="6">6 Mois</SelectItem>
                <SelectItem value="12">1 An (12 mois)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-[#D4AF37]">Type de Forfait</Label>
            <Select value={plan} onValueChange={(val) => setPlan(val as any)}>
              <SelectTrigger className="bg-black/50 border-[#3A3A5A]">
                <SelectValue placeholder="Choisir le plan" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A2E] border-[#3A3A5A] text-white">
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="VIP">VIP Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-[#D4AF37]">Montant encaissé (XOF)</Label>
            <Input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="bg-black/50 border-[#3A3A5A]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleRenew}
            disabled={loading}
            className="bg-[#D4AF37] hover:bg-[#B6962E] text-black font-bold uppercase"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            Confirmer le Renouvellement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
