'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft, Crown } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'SUPER_ADMIN') {
          await supabase.auth.signOut()
          throw new Error('Accès refusé : Identifiants non autorisés pour l\'administration.')
        }

        toast.success('Connexion Administrateur réussie')
        router.push('/admin/dashboard')
      }
    } catch (error: any) {
      console.error('[AdminLogin] Auth error:', error)
      toast.error(error.message || 'Accès refusé')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#D4AF37] opacity-[0.05] blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/login" className="inline-flex items-center text-xs text-[#A0A0B8] hover:text-white transition-colors mb-6 group">
            <ArrowLeft className="h-3 w-3 mr-1 group-hover:-translate-x-1 transition-transform" />
            Retour à l'espace membre
          </Link>
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-black border-2 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)] mb-4">
            <Crown className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">SaaS <span className="text-[#D4AF37]">Admin</span></h1>
          <p className="text-[#A0A0B8] text-xs font-bold uppercase tracking-[0.4em] opacity-60">Control Center • Restricted Access</p>
        </div>

        <Card className="bg-black/40 border-[#D4AF37]/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-[#D4AF37]/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-white text-center font-bold">Identification</CardTitle>
            <CardDescription className="text-center text-[#666680] text-xs">Veuillez décliner votre identité d'administrateur</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google OAuth Button for Admin */}
            <button
              onClick={async () => {
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
                  toast.error(error.message || 'Erreur Google')
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-100 text-gray-800 font-bold transition-all duration-200 mb-5 border border-[#D4AF37]/30"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              IDENTIFICATION GOOGLE
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3A3A5A]"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-tighter">
                <span className="bg-black px-3 text-[#666680]">Ou accès par clé privée</span>
              </div>
            </div>

            <form onSubmit={handleAdminAuth} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#D4AF37] text-[10px] uppercase font-black tracking-widest">Email Privé</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3A3A5A]" />
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black/50 border-[#3A3A5A] text-white focus:border-[#D4AF37] pl-10 h-12 rounded-none transition-all placeholder:text-[#2A2A3E]" placeholder="admin@ivoirebar.vip" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#D4AF37] text-[10px] uppercase font-black tracking-widest">Code d'Accès</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3A3A5A]" />
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/50 border-[#3A3A5A] text-white focus:border-[#D4AF37] pl-10 h-12 rounded-none transition-all"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#D4AF37] hover:bg-[#A68226] text-black font-black py-7 rounded-none transition-all shadow-[0_10px_30px_rgba(212,175,55,0.1)] uppercase tracking-[0.2em]"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Initialiser Connexion'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
