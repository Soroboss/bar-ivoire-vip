'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Loader2, User, Mail, ShieldCheck } from "lucide-react"
import { insforge } from '@/lib/insforge'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

export default function JoinPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!fullName) {
        toast.error('Veuillez entrer votre nom complet')
        return
      }

      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name: fullName
      })

      if (error) throw error
      
      setSuccess(true)
      toast.success('Compte créé avec succès !')
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        toast.info("Cet email est déjà utilisé. Veuillez vous connecter.")
      } else {
        toast.error(error.message || 'Erreur lors de la création du compte')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-primary/20">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 mx-auto">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Compte créé !</h1>
            <p className="text-muted-foreground leading-relaxed">
              Votre identité a été enregistrée avec succès.
            </p>
            <div className="bg-card/50 p-6 rounded-2xl border border-white/5 mt-4">
              <p className="text-sm font-bold text-white mb-2">Que faire maintenant ?</p>
              <p className="text-muted-foreground text-sm">
                Veuillez informer votre Administrateur (Super Régie). Il pourra désormais vous trouver dans le système et vous assigner votre rôle (Gérant, Analyste, Financier, etc.).
              </p>
            </div>
          </div>
          <div className="pt-4 space-y-3">
             <Button onClick={() => router.push('/login')} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl shadow-lg shadow-primary/10">
               Aller à la connexion
             </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary/20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
      </div>
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-xl mb-2">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Rejoindre <span className="text-primary">L'équipe</span></h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em]">Portail Collaborateurs</p>
        </div>

        <Card className="border border-white/5 shadow-2xl shadow-black/50 rounded-3xl overflow-hidden bg-card backdrop-blur-xl">
          <CardHeader className="pt-8 px-8 pb-4">
            <CardTitle className="text-xl font-bold text-white text-center">
              Création de Profil
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground font-medium">
              Créez votre compte pour que l'administrateur puisse vous assigner un rôle.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleJoin} className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Nom Complet</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Jean Kouadio" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/5 border-white/5 h-12 pl-12 rounded-xl font-bold text-white placeholder:text-muted-foreground focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Email professionnel</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="nom@exemple.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/5 h-12 pl-12 rounded-xl font-bold text-white placeholder:text-muted-foreground focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Mot de passe</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/5 h-12 px-4 rounded-xl font-bold text-white placeholder:text-muted-foreground focus:ring-primary/20 transition-all"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl shadow-lg shadow-primary/10 transition-all uppercase tracking-widest text-[11px]"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Créer mon profil'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
           <Link href="/login" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
              Vous avez déjà un compte ? Se connecter
           </Link>
        </div>
      </div>
    </div>
  )
}
