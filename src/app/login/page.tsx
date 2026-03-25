'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, Mail, Phone, Loader2, Wine, Building2 } from "lucide-react"
import { insforge } from '@/lib/insforge'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { insforgeService } from '@/services/insforgeService'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [barName, setBarName] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignUp) {
        if (!barName || !fullName) {
          toast.error('Veuillez remplir tous les champs obligatoires')
          setLoading(false)
          return
        }
        const { data, error } = await insforge.auth.signUp({
          email,
          password
        })
        if (error) throw error
        
        const user = data?.user
        if (user) {
          // Proceed with establishment creation.
          const estData = await insforgeService.createEstablishment({
            name: barName,
            location: 'À configurer',
            type: 'Bar VIP', // Assuming 'Bar VIP' as barType is not defined
            user_id: user.id,
            owner: fullName,
            phone: phone || 'Non précisé',
            whatsapp: phone,
          })

          // Create the admin profile using the secure RPC
          const { error: rpcError } = await insforge.database.rpc('register_partner_profile', {
            p_full_name: fullName,
            p_establishment_id: estData.id
          })
          
          if (rpcError) {
             console.error("Erreur création profil partenaire:", rpcError)
          }
        }
        
        toast.success('Inscription réussie ! Validation en cours.')
        router.push('/onboarding')
      } else {
        const { error } = await insforge.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Connexion réussie')
        router.push('/dashboard')
      }
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        toast.info("Compte existant. Connectez-vous.")
        setIsSignUp(false)
      } else {
        toast.error(error.message || 'Erreur d\'authentification')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      localStorage.setItem('authSource', 'partner')
      const { error } = await insforge.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: `${window.location.origin}/auth/callback`
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion Google')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary/20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full" />
      </div>
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 mb-2">
            <Wine className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Ivoire Bar <span className="text-primary">VIP</span></h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em]">Gestion de régie premium</p>
        </div>

        <Card className="border border-white/5 shadow-2xl shadow-black/50 rounded-3xl overflow-hidden bg-card backdrop-blur-xl">
          <CardHeader className="pt-8 px-8 pb-4">
            <CardTitle className="text-xl font-bold text-white text-center">
              {isSignUp ? 'Créer un compte' : 'Bon retour'}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground font-medium">
              {isSignUp ? 'Commencez à gérer votre établissement' : 'Connectez-vous à votre espace'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Button
              onClick={handleGoogleAuth}
              disabled={loading}
              variant="outline"
              className="w-full h-12 rounded-xl border-white/10 bg-white/5 font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                <span className="bg-card px-4">ou par email</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-5">
              {isSignUp && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Établissement</Label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Nom du bar" 
                        required 
                        value={barName}
                        onChange={(e) => setBarName(e.target.value)}
                        className="bg-white/5 border-white/5 h-12 pl-12 rounded-xl font-bold text-white placeholder:text-muted-foreground focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Nom Complet</Label>
                    <Input 
                      placeholder="Votre nom" 
                      required 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-white/5 border-white/5 h-12 px-4 rounded-xl font-bold text-white placeholder:text-muted-foreground focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Email</Label>
                <Input 
                  type="email" 
                  placeholder="nom@exemple.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/5 h-12 px-4 rounded-xl font-bold text-white placeholder:text-muted-foreground focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Mot de passe</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/5 h-12 px-4 rounded-xl font-bold text-white placeholder:text-muted-foreground focus:ring-primary/20 transition-all"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl shadow-lg shadow-primary/10 transition-all"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (isSignUp ? 'Créer mon compte' : 'Se connecter')}
              </Button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                {isSignUp ? 'Déjà inscrit ? Connexion' : 'Pas de compte ? Créer un bar'}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Link 
            href="/admin/login" 
            className="text-[10px] text-muted-foreground hover:text-primary uppercase tracking-[0.3em] font-bold transition-colors inline-flex items-center gap-2"
          >
            <ShieldCheck className="h-3 w-3" />
            Portail Administrateur
          </Link>
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">
            © 2026 IVOIRE BAR VIP
          </p>
        </div>
      </div>
    </div>
  )
}
