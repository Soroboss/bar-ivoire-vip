'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useState, Suspense } from 'react'
import { Loader2, Wine, Building2, User, Phone, Mail, MapPin, ArrowLeft, Check, Lock } from 'lucide-react'
import { insforge } from '@/lib/insforge'
import { insforgeService } from '@/services/insforgeService'
import { Establishment } from '@/types'
import { toast } from 'sonner'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"


const planLabels: Record<string, { name: string; color: string }> = {
  starter: { name: 'Starter — 15 000 FCFA/mois', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  business: { name: 'Business — 35 000 FCFA/mois', color: 'bg-primary/10 text-primary border-primary/20' },
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
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'verification' | 'success'>('form')
  const [otp, setOtp] = useState('')

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email || !formData.barName || !formData.phone || !formData.password) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)
    try {
      // Créer le compte avec le mot de passe défini par l'utilisateur
      const { data, error } = await insforge.auth.signUp({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
      })
      if (error) throw error

      toast.success('Compte créé ! Veuillez vérifier votre email.')
      setStep('verification') // Passer à l'étape de vérification OTP
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Veuillez entrer le code à 6 chiffres complet')
      return
    }

    setLoading(true)
    try {
      // Vérifier l'email avec le code transmis
      const { data, error } = await insforge.auth.verifyEmail({
        email: formData.email,
        otp: otp
      })

      if (error) {
        if (error.message?.includes('expired') || error.message?.includes('invalid') || error.message?.includes('Token')) {
          throw new Error("OTP_INVALID")
        }
        throw error
      }
      
      // La vérification a réussi, l'utilisateur a maintenant une session active
      // On peut maintenant créer son établissement "Pending"
      const user = data?.user
      if (user) {
        try {
          await insforgeService.createEstablishment({
            name: formData.barName,
            owner: formData.fullName,
            phone: formData.phone,
            whatsapp: formData.phone,
            location: formData.location || 'À préciser',
            type: 'bar', // Fixed enum value from 'Bar VIP' to 'bar'
            user_id: user.id,
            plan: (planToDb[selectedPlan] || 'Trial') as Establishment['plan'],
          })
        } catch (dbError: any) {
          console.error("Establishment creation error:", dbError)
          toast.error("Le compte est vérifié, mais la création de l'établissement a échoué: " + (dbError.message || "Erreur interne"))
        }
      }

      setStep('success')
      toast.success('Email vérifié avec succès !')
    } catch (error: any) {
      if (error.message === "OTP_INVALID") {
        // True OTP Error
        toast.error("Le code est invalide ou a expiré.")
      } else {
        toast.error(error.message || "Erreur lors de la vérification")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      const { error } = await insforge.auth.resendVerificationEmail({
        email: formData.email
      })
      if (error) throw error
      toast.success('Un nouveau code a été envoyé à votre adresse email')
    } catch (error: any) {
      toast.error("Impossible de renvoyer l'email. Veuillez patienter.")
    }
  }

  // Écran de succès complet
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-primary/20">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl shadow-green-500/20 mx-auto">
            <Check className="h-10 w-10" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Inscription reçue ! 🎉</h1>
            <p className="text-muted-foreground leading-relaxed">
              Votre demande pour <span className="text-primary font-bold">"{formData.barName}"</span> a été soumise. 
              Nos administrateurs valideront votre compte sous <span className="text-white font-bold">2 heures maximum</span>.
            </p>
            <p className="text-muted-foreground text-sm">
              Votre Email <strong>{formData.email}</strong> a été validé. 
              Vous pourrez vous connecter avec votre mot de passe dès que l'administrateur aura activé votre unité.
            </p>
          </div>
          <div className="pt-4 space-y-3">
            <Link href="https://wa.me/2250102030405" target="_blank">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl shadow-lg shadow-primary/10">
                Contacter le support VIP
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full text-muted-foreground hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" /> Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Écran de vérification OTP
  if (step === 'verification') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-primary/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        </div>

        <div className="w-full max-w-lg space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="text-center space-y-3">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/20 text-primary shadow-xl shadow-primary/10">
              <Mail className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
              Vérifiez <span className="text-primary">VOTRE EMAIL</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Nous avons envoyé un code de vérification à 6 chiffres à <span className="text-white font-bold">{formData.email}</span>.
            </p>
          </div>

          <Card className="bg-card/50 border-primary/20 backdrop-blur-3xl shadow-2xl rounded-[2rem] overflow-hidden">
            <CardContent className="pt-10 pb-10 px-8 text-center space-y-8">
              <form onSubmit={handleVerifyOTP} className="space-y-8 flex flex-col items-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-12 h-14 text-xl font-bold bg-white/5 border-white/10 rounded-xl" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-xl font-bold bg-white/5 border-white/10 rounded-xl" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-xl font-bold bg-white/5 border-white/10 rounded-xl" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-xl font-bold bg-white/5 border-white/10 rounded-xl" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-xl font-bold bg-white/5 border-white/10 rounded-xl" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-xl font-bold bg-white/5 border-white/10 rounded-xl" />
                  </InputOTPGroup>
                </InputOTP>

                <Button type="submit" disabled={loading || otp.length !== 6}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-7 rounded-xl shadow-lg shadow-primary/10 text-base uppercase tracking-tighter">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Vérifier et Finaliser"}
                </Button>
              </form>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-xs text-muted-foreground">
                  Vous n'avez pas reçu l'email ou il est dans vos spams ?
                </p>
                <Button variant="outline" size="sm" onClick={handleResendOTP} disabled={loading}
                  className="bg-transparent border-white/10 text-white hover:bg-white/5">
                  Renvoyer le code
                </Button>
                <div>
                  <Button variant="link" size="sm" onClick={() => setStep('form')}
                    className="text-muted-foreground hover:text-primary text-xs">
                    Modifier l'adresse email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Écran Formulaire Initial
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-primary/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-colors mb-4 uppercase font-bold tracking-widest">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
            <Wine className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
            Rejoignez <span className="text-primary">IVOIRE BAR VIP</span>
          </h1>
          <Badge className={`${planInfo.color} border uppercase text-[10px] font-black px-3 py-1 ring-1 ring-white/5`}>
            Forfait : {planInfo.name}
          </Badge>
        </div>

        {/* Form */}
        <Card className="bg-card/50 border-white/5 backdrop-blur-3xl shadow-2xl border-t-primary/50 border-t-2 rounded-[2rem] overflow-hidden">
          <CardContent className="pt-10 pb-10 px-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="barName" className="text-muted-foreground font-bold text-[10px] uppercase ml-1 tracking-widest">Nom de l'établissement *</Label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input id="barName" placeholder="Ex: Le Maquis des VIP" required
                    value={formData.barName} onChange={update('barName')}
                    className="bg-white/5 border-white/5 h-12 pl-12 rounded-xl text-white focus:ring-primary/20 transition-all font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-muted-foreground font-bold text-[10px] uppercase ml-1 tracking-widest">Nom complet du gérant *</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input id="fullName" placeholder="Jean Kouadio" required
                    value={formData.fullName} onChange={update('fullName')}
                    className="bg-white/5 border-white/5 h-12 pl-12 rounded-xl text-white focus:ring-primary/20 transition-all font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-muted-foreground font-bold text-[10px] uppercase ml-1 tracking-widest">Numéro WhatsApp *</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input id="phone" type="tel" placeholder="07 01 02 03 04" required
                    value={formData.phone} onChange={update('phone')}
                    className="bg-white/5 border-white/5 h-12 pl-12 rounded-xl text-white focus:ring-primary/20 transition-all font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground font-bold text-[10px] uppercase ml-1 tracking-widest">Adresse email *</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input id="email" type="email" placeholder="contact@monbar.ci" required
                    value={formData.email} onChange={update('email')}
                    className="bg-white/5 border-white/5 h-12 pl-12 rounded-xl text-white focus:ring-primary/20 transition-all font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-muted-foreground font-bold text-[10px] uppercase ml-1 tracking-widest">Localisation (quartier, ville)</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input id="location" placeholder="Cocody, Abidjan"
                    value={formData.location} onChange={update('location')}
                    className="bg-white/5 border-white/5 h-12 pl-12 rounded-xl text-white focus:ring-primary/20 transition-all font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground font-bold text-[10px] uppercase ml-1 tracking-widest">Mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input id="password" type="password" placeholder="••••••••" required minLength={6}
                    value={formData.password} onChange={update('password')}
                    className="bg-white/5 border-white/5 h-12 pl-12 rounded-xl text-white focus:ring-primary/20 transition-all font-bold" />
                </div>
              </div>

              <Button type="submit" disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-7 rounded-xl shadow-lg shadow-primary/10 text-base uppercase tracking-tighter">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Soumettre mon inscription"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground/40 font-bold uppercase tracking-widest">
                Déjà inscrit ?{' '}
                <Link href="/login" className="text-primary hover:underline font-black outline-none">Se connecter</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-white/10 font-black uppercase tracking-[0.4em]">
          Sécurisé par IVOIRE TECH • © 2026 IVOIRE BAR VIP
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
