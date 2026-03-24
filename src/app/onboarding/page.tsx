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
  const { establishment, user, userRole, signOut, loading, registerEstablishment } = useAppContext()
  const router = useRouter()
  
  const [barName, setBarName] = useState('')
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const adminEmails = ['soroboss.bossimpact@gmail.com', 'admin@ivoirebar.vip', 'soro.nagony.adama@gmail.com']
  const userEmail = user?.email?.toLowerCase() || ''
  const isKnownAdmin = adminEmails.some(email => email.toLowerCase() === userEmail)

  if (!loading && (userRole === 'SUPER_ADMIN' || isKnownAdmin)) {
    router.push('/admin/dashboard')
    return null
  }

  if (!loading && establishment?.status === 'Active') {
    router.push('/dashboard')
    return null
  }

  if (!loading && !establishment && user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-3">
             <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-100 mb-2">
                <Building2 className="h-6 w-6 text-white" />
             </div>
             <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bienvenue</h1>
             <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Finaliser votre inscription</p>
          </div>

          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-8 space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">Configuration du bar</h2>
                <p className="text-slate-500 text-sm mt-1">Identifiez votre établissement sur le réseau</p>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                if (!barName || !fullName) {
                  toast.error('Champs obligatoires manquants')
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
                  toast.success('Dossier envoyé pour validation')
                } catch (error: any) {
                  toast.error('Erreur lors de l\'envoi')
                } finally {
                  setSubmitting(false)
                }
              }} className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Nom du Bar</Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input 
                      placeholder="Ex: Le Maquis des VIP" required
                      value={barName} onChange={(e) => setBarName(e.target.value)}
                      className="bg-slate-50 border-none h-12 pl-12 rounded-xl font-bold text-slate-900 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Gérant</Label>
                  <Input 
                    placeholder="Votre nom complet" required
                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="bg-slate-50 border-none h-12 px-4 rounded-xl font-bold text-slate-900 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Contact WhatsApp</Label>
                  <Input 
                    placeholder="07 01 02 03 04"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-50 border-none h-12 px-4 rounded-xl font-bold text-slate-900 focus:ring-blue-100 transition-all"
                  />
                </div>
                <Button type="submit" disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-100 transition-all">
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Activer mon accès'}
                </Button>
              </form>

              <div className="pt-2 text-center">
                <button onClick={signOut} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-all flex items-center justify-center gap-2 mx-auto">
                  <LogOut className="h-3 w-3" /> Se déconnecter
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-100 mb-2">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ivoire Bar VIP</h1>
          <div className="flex items-center justify-center gap-2">
            <Badge className={`${establishment?.status === 'Suspended' ? 'bg-red-50 text-red-600 border-none' : 'bg-blue-50 text-blue-600 border-none'} uppercase text-[9px] font-bold px-3 py-1 rounded-full`}>
              {establishment?.status === 'Suspended' ? 'STATUT: SUSPENDU' : 'VALIDATION EN COURS'}
            </Badge>
          </div>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-10 space-y-8">
            <div className="space-y-4 text-center">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${establishment?.status === 'Suspended' ? 'bg-red-500' : 'bg-blue-600'} w-[65%] shadow-sm`} />
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                {establishment?.status === 'Suspended' ? 'Action requise par l\'administrateur' : 'Vérification de sécurité en cours'}
              </p>
            </div>

            <div className="space-y-4 text-center">
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {establishment?.status === 'Suspended'
                  ? `Activation suspendue.`
                  : establishment?.name 
                    ? `"${establishment.name}" est en cours de déploiement.` 
                    : "Votre bar est en cours de déploiement."
                }
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                {establishment?.status === 'Suspended'
                  ? 'Veuillez contacter le support pour résoudre le problème de suspension de votre compte.'
                  : 'Nos équipes valident vos informations pour activer votre terminal premium. Cela prend généralement moins de 2 heures.'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <p className="text-[9px] text-slate-400 font-bold uppercase">Activation</p>
                <p className="text-xs font-bold text-slate-900">&lt; 2h</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                <p className="text-[9px] text-slate-400 font-bold uppercase">Chiffrement</p>
                <p className="text-xs font-bold text-slate-900">Actif</p>
              </div>
            </div>

            <div className="pt-4 space-y-3">
                <Link href="https://wa.me/2250102030405" target="_blank" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-3 transition-all">
                   Assistance VIP <ArrowRight className="h-4 w-4" />
                </Link>
                <button onClick={signOut} className="w-full py-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-all flex items-center justify-center gap-2">
                  <LogOut className="h-3 w-3" /> Se déconnecter
                </button>
              </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
           © 2026 IVOIRE BAR VIP • INFRASTRUCTURE LUXE
        </p>
      </div>
    </div>
  )
}
