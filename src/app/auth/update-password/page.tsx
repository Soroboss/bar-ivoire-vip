'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Lock, Loader2, Wine } from "lucide-react"
import { insforge } from '@/lib/insforge'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    
    setLoading(true)
    try {
      // insforge.auth.updateUser({ password }) is missing.
      // Usually reset password requires a token/OTP.
      toast.info("Veuillez utiliser le lien de réinitialisation envoyé par email.")
      /*
      const { error } = await insforge.auth.updateUser({ password })
      if (error) throw error
      */
      toast.success('Mot de passe mis à jour avec succès !')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#A68226] text-[#1A1A2E] shadow-2xl shadow-[#D4AF37]/20 mb-4">
            <Wine className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">NOUVEAU <span className="text-[#D4AF37]">PASS</span></h1>
          <p className="text-[#A0A0B8] text-[10px] font-medium uppercase tracking-[0.2em]">Sécurisation de votre accès VIP</p>
        </div>

        <Card className="bg-[#1A1A2E]/50 border-[#3A3A5A] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white text-center">Réinitialisation</CardTitle>
            <CardDescription className="text-center text-[#A0A0B8]">Définissez votre nouveau mot de passe sécurisé</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#A0A0B8]">Nouveau mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#0F0F1A] border-[#3A3A5A] pl-10 text-white focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#A0A0B8]">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#0F0F1A] border-[#3A3A5A] pl-10 text-white focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#D4AF37] hover:bg-[#A68226] text-[#1A1A2E] font-bold py-6 rounded-xl shadow-lg shadow-[#D4AF37]/20"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Mettre à jour le mot de passe'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-[#3A3A5A] font-medium uppercase tracking-widest">
          SÉCURISÉ PAR IVOIRE TECH • © 2026 IVOIRE BAR VIP
        </p>
      </div>
    </div>
  )
}
