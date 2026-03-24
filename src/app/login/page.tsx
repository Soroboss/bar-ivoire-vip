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
        
        toast.success('Inscription réussie ! Validation en cours.')
        router.push('/onboarding')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-100 mb-2">
            <Wine className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ivoire Bar VIP</h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Gestion de régie premium</p>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="pt-8 px-8 pb-4">
            <CardTitle className="text-xl font-bold text-slate-900 text-center">
              {isSignUp ? 'Créer un compte' : 'Bon retour'}
            </CardTitle>
            <CardDescription className="text-center text-slate-500 font-medium">
              {isSignUp ? 'Commencez à gérer votre établissement' : 'Connectez-vous à votre espace'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Button
              onClick={handleGoogleAuth}
              disabled={loading}
              variant="outline"
              className="w-full h-12 rounded-xl border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
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
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span className="bg-white px-4">ou par email</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-5">
              {isSignUp && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Établissement</Label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input 
                        placeholder="Nom du bar" 
                        required 
                        value={barName}
                        onChange={(e) => setBarName(e.target.value)}
                        className="bg-slate-50 border-none h-12 pl-12 rounded-xl font-bold text-slate-900 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Nom Complet</Label>
                    <Input 
                      placeholder="Votre nom" 
                      required 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-slate-50 border-none h-12 px-4 rounded-xl font-bold text-slate-900 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Email</Label>
                <Input 
                  type="email" 
                  placeholder="nom@exemple.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50 border-none h-12 px-4 rounded-xl font-bold text-slate-900 focus:ring-blue-100 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Mot de passe</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 border-none h-12 px-4 rounded-xl font-bold text-slate-900 focus:ring-blue-100 transition-all"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-100 transition-all"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (isSignUp ? 'Créer mon compte' : 'Se connecter')}
              </Button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
              >
                {isSignUp ? 'Déjà inscrit ? Connexion' : 'Pas de compte ? Créer un bar'}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Link 
            href="/admin/login" 
            className="text-[10px] text-slate-400 hover:text-slate-600 uppercase tracking-widest font-bold transition-colors inline-flex items-center gap-2"
          >
            <ShieldCheck className="h-3 w-3" />
            Portail Administrateur
          </Link>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            © 2026 IVOIRE BAR VIP
          </p>
        </div>
      </div>
    </div>
  )
}
