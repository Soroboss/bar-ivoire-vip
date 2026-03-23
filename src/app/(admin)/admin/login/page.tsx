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
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Connexion Administrateur réussie')
      router.push('/admin/dashboard')
    } catch (error: any) {
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
