'use client'

import { useState, useEffect } from 'react'
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
import { motion, AnimatePresence } from 'framer-motion'

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

  useEffect(() => {
    if (!loading) {
      if (userRole === 'SUPER_ADMIN' || isKnownAdmin) {
        router.push('/admin/dashboard')
      } else if (establishment?.status === 'Active') {
        router.push('/dashboard')
      }
    }
  }, [loading, userRole, isKnownAdmin, establishment?.status, router])

  if (!loading && (userRole === 'SUPER_ADMIN' || isKnownAdmin || establishment?.status === 'Active')) {
    return null
  }

  if (!loading && !establishment && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-primary/20">
        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center space-y-4">
             <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-2xl shadow-primary/20 mb-2 animate-float">
                <Building2 className="h-8 w-8 text-primary-foreground" />
             </div>
             <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Bienvenue <span className="gold-gradient-text">VIP</span></h1>
             <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.4em]">Finaliser votre inscription Elite</p>
          </div>

          <Card className="premium-card rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl">
            <CardContent className="p-10 space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Configuration du Bar Elite</h2>
                <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Identifiez votre établissement sur le réseau VIP</p>
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
                    type: 'bar',
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
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground/40 ml-2 tracking-widest">Nom du Bar</Label>
                  <div className="relative">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input 
                      placeholder="Ex: Le Maquis des VIP" required
                      value={barName} onChange={(e) => setBarName(e.target.value)}
                      className="bg-white/5 border-white/5 h-14 pl-14 rounded-2xl font-black text-white placeholder:text-muted-foreground/20 focus:ring-primary/20 transition-all uppercase tracking-tight"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground/40 ml-2 tracking-widest">Gérant</Label>
                  <Input 
                    placeholder="Votre nom complet" required
                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/5 border-white/5 h-14 px-6 rounded-2xl font-black text-white placeholder:text-muted-foreground/20 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground/40 ml-2 tracking-widest">Contact WhatsApp</Label>
                  <Input 
                    placeholder="07 01 02 03 04"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/5 border-white/5 h-14 px-6 rounded-2xl font-black text-white placeholder:text-muted-foreground/20 focus:ring-primary/20 transition-all"
                  />
                </div>
                <Button type="submit" disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black h-16 rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-[10px]">
                  {submitting ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'Activer mon accès Elite'}
                </Button>
              </form>

              <div className="pt-6 text-center">
                <button onClick={signOut} className="text-[10px] font-black text-muted-foreground/30 hover:text-red-500 transition-all flex items-center justify-center gap-3 mx-auto uppercase tracking-widest">
                  <LogOut className="h-4 w-4" /> Terminer la session
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-primary/30">
      <div className="max-w-xl w-full space-y-12">
        
        <div className="text-center space-y-5">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-primary shadow-2xl shadow-primary/20 mb-4 animate-float">
            <Building2 className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Ivoire <span className="gold-gradient-text">Bar VIP</span></h1>
          <div className="flex items-center justify-center gap-3">
            <Badge className={`${establishment?.status === 'Suspended' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'} uppercase text-[9px] font-black px-5 py-2 rounded-xl border tracking-widest`}>
              {establishment?.status === 'Suspended' ? 'STATUT: ACCÈS SUSPENDU' : 'VALIDATION STRATÉGIQUE EN COURS'}
            </Badge>
          </div>
        </div>

        <Card className="premium-card rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl relative group">
          <CardContent className="p-10 md:p-14 space-y-12 relative z-10">
            <div className="space-y-5 text-center">
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className={`h-full ${establishment?.status === 'Suspended' ? 'bg-red-500' : 'bg-primary'} shadow-[0_0_20px_rgba(212,175,55,0.3)]`} 
                />
              </div>
              <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.4em] font-black">
                {establishment?.status === 'Suspended' ? 'Action requise par le Commandement' : 'Analyse de sécurité en temps réel'}
              </p>
            </div>

            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-black text-white leading-none uppercase tracking-tighter">
                {establishment?.status === 'Suspended'
                  ? `Activation suspendue.`
                  : establishment?.name 
                    ? `"${establishment.name.toUpperCase()}"` 
                    : "Votre Unité"
                } <br/><span className="text-muted-foreground/40 text-sm mt-3 inline-block">Déploiement Orbital en cours...</span>
              </h2>
              <p className="text-muted-foreground/60 text-sm leading-relaxed px-4 font-medium uppercase tracking-widest text-[10px]">
                {establishment?.status === 'Suspended'
                  ? 'Veuillez contacter le haut commandement pour résoudre le problème de suspension de votre accès premium.'
                  : 'Nos équipes valident vos protocoles pour activer votre terminal Ivoire Bar VIP. Temps estimé: < 2 heures.'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-7 rounded-[1.8rem] bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3 group/item hover:bg-primary/5 transition-all duration-500 hover:scale-105">
                <Clock className="h-8 w-8 text-primary group-hover/item:rotate-12 transition-transform" />
                <p className="text-[9px] text-muted-foreground/30 font-black uppercase tracking-widest">Activation</p>
                <p className="text-sm font-black text-white tracking-tighter">&lt; 120 MIN</p>
              </div>
              <div className="p-7 rounded-[1.8rem] bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3 group/item hover:bg-emerald-500/5 transition-all duration-500 hover:scale-105">
                <Shield className="h-8 w-8 text-emerald-500 group-hover/item:scale-110 transition-transform" />
                <p className="text-[9px] text-muted-foreground/30 font-black uppercase tracking-widest">Sécurité</p>
                <p className="text-sm font-black text-white tracking-tighter uppercase">SSL/TLS AES</p>
              </div>
            </div>

            <div className="pt-6 space-y-4">
                <Link href="https://wa.me/2250102030405" target="_blank" className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] text-[10px]">
                   Assistance VIP Haute Régie <ArrowRight className="h-5 w-5" />
                </Link>
                <button onClick={signOut} className="w-full py-4 text-[9px] font-black text-muted-foreground/30 hover:text-red-500 transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
                  <LogOut className="h-4 w-4" /> Terminer la session
                </button>
              </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground/20 font-black uppercase tracking-[0.6em]">
           © 2026 IVOIRE BAR VIP • INFRASTRUCTURE LUXE ORBITALE
        </p>
      </div>
    </div>
  )
}
