'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Clock, Building2, Phone, Mail, ArrowRight, Shield, LogOut, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAppContext } from "@/context/AppContext"
import { useRouter } from "next/navigation"
import { toast } from 'sonner'

export default function OnboardingPage() {
  const { establishment, user, signOut, loading, registerEstablishment } = useAppContext()
  const router = useRouter()
  
  const [barName, setBarName] = useState('')
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Si l'établissement est actif → rediriger vers le dashboard
  if (!loading && establishment?.status === 'Active') {
    router.push('/dashboard')
    return null
  }

  // Cas 1 : Utilisateur connecté SANS établissement → formulaire d'inscription
  if (!loading && !establishment && user) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center p-6">
        <div className="max-w-xl w-full space-y-8 animate-in fade-in zoom-in duration-700">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#B8962E] shadow-[0_0_50px_rgba(212,175,55,0.2)] mb-4 border-4 border-[#1A1A2E]">
              <Building2 className="h-10 w-10 text-[#1A1A2E]" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white italic">
              IVOIRE BAR <span className="text-[#D4AF37]">VIP</span>
            </h1>
            <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 uppercase text-[10px] font-black px-3">
              Finaliser l'inscription
            </Badge>
          </div>

          <Card className="bg-[#1A1A2E] border-[#3A3A5A] shadow-2xl border-t-[#D4AF37]/50 border-t-2">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white">Bienvenue {user.email?.split('@')[0]} !</h2>
                <p className="text-[#A0A0B8] text-sm mt-1">Complétez vos informations pour rejoindre le réseau VIP</p>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                if (!barName || !fullName) {
                  toast.error('Veuillez remplir tous les champs obligatoires')
                  return
                }
                setSubmitting(true)
                try {
                  await registerEstablishment({
                    name: barName,
                    owner: fullName,
                    phone: phone || 'Non précisé',
                    whatsapp: phone,
                    location: 'À préciser',
                    type: 'Bar VIP',
                    currency: 'FCFA',
                    taxRate: 0,
                    invoiceNote: '',
                    logo: '',
                    userId: user.id
                  } as any)
                  toast.success('Inscription envoyée ! En attente de validation.')
                } catch (error) {
                  toast.error('Erreur lors de l\'inscription')
                } finally {
                  setSubmitting(false)
                }
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="barName" className="text-[#A0A0B8]">Nom de l'établissement *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
                    <Input 
                      id="barName" placeholder="Ex: Le Maquis des VIP" required
                      value={barName} onChange={(e) => setBarName(e.target.value)}
                      className="bg-[#0F0F1A] border-[#3A3A5A] pl-10 text-white focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[#A0A0B8]">Nom complet du gérant *</Label>
                  <Input 
                    id="fullName" placeholder="Jean Kouadio" required
                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="bg-[#0F0F1A] border-[#3A3A5A] text-white focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#A0A0B8]">Numéro WhatsApp</Label>
                  <Input 
                    id="phone" placeholder="07 01 02 03 04"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="bg-[#0F0F1A] border-[#3A3A5A] text-white focus:border-[#D4AF37]"
                  />
                </div>
                <Button type="submit" disabled={submitting}
                  className="w-full bg-[#D4AF37] hover:bg-[#A68226] text-[#1A1A2E] font-bold py-6 rounded-xl shadow-lg shadow-[#D4AF37]/20">
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Soumettre mon inscription'}
                </Button>
              </form>

              <Button onClick={signOut} variant="ghost" className="w-full text-[#A0A0B8] hover:text-white flex items-center justify-center gap-2">
                <LogOut className="h-4 w-4" /> Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Cas 2 : Établissement en Pending ou Suspended → écran d'attente
  return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center p-6 bg-[url('/grid.svg')] bg-center">
      <div className="max-w-xl w-full space-y-8 animate-in fade-in zoom-in duration-700">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#B8962E] shadow-[0_0_50px_rgba(212,175,55,0.2)] mb-4 border-4 border-[#1A1A2E]">
            <Building2 className="h-10 w-10 text-[#1A1A2E]" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white italic">
            IVOIRE BAR <span className="text-[#D4AF37]">VIP</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Badge className={`${establishment?.status === 'Suspended' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20'} uppercase text-[10px] font-black px-3`}>
              {establishment?.status === 'Suspended' ? 'Compte Suspendu' : 'Validation Stratégique'}
            </Badge>
          </div>
        </div>

        <Card className="bg-[#1A1A2E] border-[#3A3A5A] shadow-2xl relative overflow-hidden backdrop-blur-xl border-t-[#D4AF37]/50 border-t-2">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck className="h-32 w-32 text-[#D4AF37]" />
          </div>
          
          <CardContent className="pt-10 pb-10 space-y-8">
            <div className="space-y-4 text-center">
              <div className="h-2 w-full bg-[#0F0F1A] rounded-full overflow-hidden">
                <div className={`h-full ${establishment?.status === 'Suspended' ? 'bg-red-500' : 'bg-[#D4AF37]'} w-[65%] animate-pulse shadow-[0_0_15px_#D4AF37]`} />
              </div>
              <p className="text-xs text-[#A0A0B8] uppercase tracking-[0.3em] font-bold">
                {establishment?.status === 'Suspended' ? 'Compte suspendu par l\'administration' : 'Analyse de Conformité : En cours'}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">
                {establishment?.status === 'Suspended'
                  ? `"${establishment.name}" a été suspendu.`
                  : establishment?.name 
                    ? `"${establishment.name}" est en cours de déploiement sécurisé.` 
                    : "Votre établissement est en cours de déploiement sécurisé."
                }
              </h2>
              <p className="text-[#A0A0B8] text-center text-sm leading-relaxed">
                {establishment?.status === 'Suspended'
                  ? 'Contactez le support pour plus d\'informations sur la suspension de votre compte.'
                  : <>Nos administrateurs vérifient actuellement les informations de votre licence pour garantir l'exclusivité du réseau <span className="text-[#D4AF37] font-bold">VIP</span>. Vous recevrez une notification d'activation sous peu.</>
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0F0F1A] border border-[#3A3A5A] flex flex-col items-center gap-2 group hover:border-[#D4AF37]/30 transition-colors">
                <Clock className="h-6 w-6 text-[#D4AF37]" />
                <p className="text-[10px] text-[#A0A0B8] uppercase">Délai Estimé</p>
                <p className="text-sm font-bold text-white">&lt; 2 Heures</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0F0F1A] border border-[#3A3A5A] flex flex-col items-center gap-2">
                <Shield className="h-6 w-6 text-[#4CAF50]" />
                <p className="text-[10px] text-[#A0A0B8] uppercase">Sécurité</p>
                <p className="text-sm font-bold text-white">Chiffré AES-256</p>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                render={
                  <Link href="https://wa.me/2250102030405" target="_blank" className="w-full bg-[#D4AF37] text-[#1A1A2E] font-black h-12 rounded-xl group overflow-hidden relative flex items-center justify-center">
                    <span className="relative z-10 flex items-center gap-2">
                      CONTACTER SUPPORT PRIORITAIRE <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                }
              />
              <Button onClick={signOut} variant="ghost" className="w-full text-[#A0A0B8] hover:text-white flex items-center justify-center gap-2">
                <LogOut className="h-4 w-4" /> Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-4 text-[#3A3A5A]">
          <div className="flex gap-6">
            <Phone className="h-4 w-4" />
            <Mail className="h-4 w-4" />
            <ShieldCheck className="h-4 w-4" />
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">© 2026 IVOIRE BAR VIP • INFRASTRUCTURE LUXE</p>
        </div>
      </div>
    </div>
  )
}
