'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useState, Suspense } from 'react'
import { Loader2, Wine, Building2, User, Phone, Mail, MapPin, ArrowLeft, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { supabaseService } from '@/services/supabaseService'
import { Establishment } from '@/types'
import { toast } from 'sonner'

const planLabels: Record<string, { name: string; color: string }> = {
  starter: { name: 'Starter — 15 000 FCFA/mois', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  business: { name: 'Business — 35 000 FCFA/mois', color: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20' },
  vip: { name: 'VIP Premium — 75 000 FCFA/mois', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
}

const planToDb: Record<string, string> = {
  starter: 'Trial',
  business: 'Business',
  vip: 'VIP',
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get('plan') || 'starter'
  const planInfo = planLabels[selectedPlan] || planLabels.starter

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    barName: '',
    location: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email || !formData.barName || !formData.phone) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setLoading(true)
    try {
      // Créer le compte avec un mot de passe temporaire (le partenaire le créera après validation)
      const tempPassword = `TMP_${crypto.randomUUID()}_${Date.now()}`
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: tempPassword,
        options: {
          data: { full_name: formData.fullName },
        },
      })
      if (error) throw error

      // Créer l'établissement en Pending
      if (data.user) {
        await supabaseService.createEstablishment({
          name: formData.barName,
          owner: formData.fullName,
          phone: formData.phone,
          whatsapp: formData.phone,
          location: formData.location || 'À préciser',
          type: 'Bar VIP',
          user_id: data.user.id,
          plan: (planToDb[selectedPlan] || 'Trial') as Establishment['plan'],
        })
      }

      setSuccess(true)
      toast.success('Inscription envoyée avec succès !')
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  // Écran de succès
  if (success) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl shadow-green-500/20 mx-auto">
            <Check className="h-10 w-10" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-white">Inscription reçue ! 🎉</h1>
            <p className="text-[#A0A0B8] leading-relaxed">
              Votre demande pour <span className="text-[#D4AF37] font-bold">"{formData.barName}"</span> a été soumise. 
              Nos administrateurs valideront votre compte sous <span className="text-white font-bold">2 heures maximum</span>.
            </p>
            <p className="text-[#A0A0B8] text-sm">
              Vous recevrez un email à <span className="text-white font-bold">{formData.email}</span> avec un lien pour créer votre mot de passe et accéder à votre espace.
            </p>
          </div>
          <div className="pt-4 space-y-3">
            <Link href="https://wa.me/2250102030405" target="_blank">
              <Button className="w-full bg-[#D4AF37] hover:bg-[#A68226] text-[#1A1A2E] font-bold py-6 rounded-xl">
                Contacter le support VIP
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full text-[#A0A0B8] hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" /> Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[#A0A0B8] hover:text-white text-sm transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#A68226] text-[#1A1A2E] shadow-2xl shadow-[#D4AF37]/20">
            <Wine className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Rejoignez <span className="text-[#D4AF37]">IVOIRE BAR VIP</span>
          </h1>
          <Badge className={`${planInfo.color} border uppercase text-[10px] font-black px-3`}>
            Forfait : {planInfo.name}
          </Badge>
        </div>

        {/* Form */}
        <Card className="bg-[#1A1A2E]/50 border-[#3A3A5A] backdrop-blur-xl shadow-2xl border-t-[#D4AF37]/50 border-t-2">
          <CardContent className="pt-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="barName" className="text-[#A0A0B8]">Nom de l'établissement *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
                  <Input id="barName" placeholder="Ex: Le Maquis des VIP" required
                    value={formData.barName} onChange={update('barName')}
                    className="bg-[#0F0F1A] border-[#3A3A5A] pl-10 text-white focus:border-[#D4AF37]" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[#A0A0B8]">Nom complet du gérant *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
                  <Input id="fullName" placeholder="Jean Kouadio" required
                    value={formData.fullName} onChange={update('fullName')}
                    className="bg-[#0F0F1A] border-[#3A3A5A] pl-10 text-white focus:border-[#D4AF37]" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#A0A0B8]">Numéro WhatsApp *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
                  <Input id="phone" type="tel" placeholder="07 01 02 03 04" required
                    value={formData.phone} onChange={update('phone')}
                    className="bg-[#0F0F1A] border-[#3A3A5A] pl-10 text-white focus:border-[#D4AF37]" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#A0A0B8]">Adresse email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
                  <Input id="email" type="email" placeholder="contact@monbar.ci" required
                    value={formData.email} onChange={update('email')}
                    className="bg-[#0F0F1A] border-[#3A3A5A] pl-10 text-white focus:border-[#D4AF37]" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#A0A0B8]">Localisation (quartier, ville)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
                  <Input id="location" placeholder="Cocody, Abidjan"
                    value={formData.location} onChange={update('location')}
                    className="bg-[#0F0F1A] border-[#3A3A5A] pl-10 text-white focus:border-[#D4AF37]" />
                </div>
              </div>

              <Button type="submit" disabled={loading}
                className="w-full bg-[#D4AF37] hover:bg-[#A68226] text-[#1A1A2E] font-bold py-6 rounded-xl shadow-lg shadow-[#D4AF37]/20 text-base">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Soumettre mon inscription"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#3A3A5A]">
                Déjà inscrit ?{' '}
                <Link href="/login" className="text-[#D4AF37] hover:underline font-bold">Se connecter</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-[#3A3A5A] font-medium uppercase tracking-widest">
          Sécurisé par IVOIRE TECH • © 2026 IVOIRE BAR VIP
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
