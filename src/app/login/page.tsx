'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, Mail, Phone, Loader2, Wine } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
        })
        if (error) throw error
        toast.success('Vérifiez votre email pour confirmer l\'inscription !')
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
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#A0A0B8]">Adresse Email</Label>
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

            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-[#A0A0B8] hover:text-[#D4AF37] transition-colors"
              >
                {isSignUp ? 'Déjà un compte ? Connectez-vous' : 'Pas encore de compte ? Créer mon espace'}
              </button>
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
