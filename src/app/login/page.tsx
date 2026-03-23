'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, Mail, Phone, Loader2, Wine, Building2 } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabaseService } from '@/services/supabaseService'
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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { full_name: fullName }
          }
        })
        if (error) throw error
        
        // Immediately create establishment in Pending status
        if (data.user) {
          await supabaseService.createEstablishment({
            name: barName,
            owner: fullName,
            phone: phone || 'Non précisé',
            whatsapp: phone,
            location: 'À préciser',
            type: 'Bar VIP',
            user_id: data.user.id
          })
        }
        
        toast.success('Inscription réussie ! Vous êtes en attente de validation.')
        router.push('/onboarding') // Direct to pending screen
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Connexion réussie')
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur d\'authentification')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.info('La connexion par téléphone nécessite la configuration d\'un fournisseur SMS (Twilio/MessageBird). Contactez le support.')
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion Google')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex flex-col items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 opacity-[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#A68226] text-[#1A1A2E] shadow-2xl shadow-[#D4AF37]/20 mb-4">
            <Wine className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">IVOIRE BAR <span className="text-[#D4AF37]">VIP</span></h1>
          <p className="text-[#A0A0B8] text-sm font-medium uppercase tracking-[0.2em]">Management de régie premium</p>
        </div>

        <Card className="bg-[#1A1A2E]/50 border-[#3A3A5A] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">
              {isSignUp ? 'Créer un compte' : 'Espace Membre'}
            </CardTitle>
            <CardDescription className="text-center text-[#A0A0B8]">
              {isSignUp ? 'Rejoignez la régie dès aujourd\'hui' : 'Connectez-vous pour gérer vos établissements'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-semibold transition-all duration-200 shadow-md hover:shadow-lg mb-5"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3A3A5A]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#1A1A2E] px-3 text-[#A0A0B8]">ou avec email</span>
              </div>
            </div>

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#0F0F1A] border border-[#3A3A5A] mb-6">
                <TabsTrigger value="email" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1A1A2E]">
                  <Mail className="h-4 w-4 mr-2" /> Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1A1A2E]">
                  <Phone className="h-4 w-4 mr-2" /> Téléphone
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="barName" className="text-[#A0A0B8]">Nom de l'établissement</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
                          <Input 
                            id="barName" 
                            placeholder="Ex: Le Maquis des VIP" 
                            required 
                            value={barName}
                            onChange={(e) => setBarName(e.target.value)}
                            className="bg-[#0F0F1A] border-[#3A3A5A] pl-10 text-white focus:border-[#D4AF37] transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-[#A0A0B8]">Nom Complet du Gérant</Label>
                        <Input 
                          id="fullName" 
                          placeholder="Jean Kouadio" 
                          required 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-[#0F0F1A] border-[#3A3A5A] text-white focus:border-[#D4AF37] transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp" className="text-[#A0A0B8]">Numéro WhatsApp (pour les alertes)</Label>
                        <Input 
                          id="whatsapp" 
                          placeholder="07 01 02 03 04" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="bg-[#0F0F1A] border-[#3A3A5A] text-white focus:border-[#D4AF37] transition-all"
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#A0A0B8]">Adresse Email de Connexion</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="nom@exemple.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#0F0F1A] border-[#3A3A5A] text-white focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#A0A0B8]">Mot de passe</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#0F0F1A] border-[#3A3A5A] text-white focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#D4AF37] hover:bg-[#A68226] text-[#1A1A2E] font-bold py-6 rounded-xl shadow-lg shadow-[#D4AF37]/20"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? 'S\'inscrire' : 'Se Connecter')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handlePhoneAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#A0A0B8]">Identifiant Téléphonique</Label>
                    <div className="flex gap-2">
                      <div className="bg-[#0F0F1A] border border-[#3A3A5A] rounded-lg px-3 flex items-center text-[#A0A0B8] text-sm">+225</div>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="07 00 00 00 00" 
                        required 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-[#0F0F1A] border-[#3A3A5A] text-white focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#D4AF37] hover:bg-[#A68226] text-[#1A1A2E] font-bold py-6 rounded-xl shadow-lg shadow-[#D4AF37]/20"
                  >
                    Recevoir le code OTP
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex flex-col items-center gap-3">
              <button 
                onClick={async () => {
                  if (!email) {
                    toast.error('Veuillez saisir votre email pour réinitialiser le mot de passe')
                    return
                  }
                  setLoading(true)
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/update-password`,
                  })
                  setLoading(false)
                  if (error) toast.error(error.message)
                  else toast.success('Lien de réinitialisation envoyé par email !')
                }}
                className="text-xs text-[#D4AF37] hover:underline transition-all"
              >
                Mot de passe oublié ?
              </button>
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-[#A0A0B8] hover:text-[#D4AF37] transition-colors"
              >
                {isSignUp ? 'Déjà un compte ? Connectez-vous' : 'Pas encore de compte ? Créer mon espace'}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center pb-8">
          <Link 
            href="/admin/login" 
            className="text-[10px] text-[#3A3A5A] hover:text-[#D4AF37] uppercase tracking-[0.3em] font-black transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="h-3 w-3" />
            Accès Administrateur SaaS
          </Link>
        </div>

        <p className="text-center text-[10px] text-[#3A3A5A] font-medium uppercase tracking-widest">
          Sécurisé par IVOIRE TECH • © 2026 IVOIRE BAR VIP
        </p>
      </div>
    </div>
  )
}
