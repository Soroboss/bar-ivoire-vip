'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push('/onboarding')
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1A2E] px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/">
            <h1 className="text-4xl font-bold tracking-tight text-[#D4AF37] hover:scale-105 transition-transform cursor-pointer">
              Ivoire Bar VIP
            </h1>
          </Link>
          <p className="mt-2 text-sm text-[#F4E4BC]/60 italic">
            Rejoignez l'élite des établissements de Côte d'Ivoire
          </p>
        </div>

        <Card className="border-[#3A3A5A] bg-[#252545] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-[#D4AF37] border-t-2">
          <form onSubmit={handleRegister}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-[#F4E4BC]">Inscription</CardTitle>
              <CardDescription className="text-[#A0A0B8]">
                Créez votre compte administrateur
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name" className="text-[#F4E4BC]">Nom complet</Label>
                <Input
                  id="full_name"
                  placeholder="Jean Kouadio"
                  className="border-[#3A3A5A] bg-[#1A1A2E] text-[#F4E4BC] focus:ring-[#D4AF37]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[#F4E4BC]">Email professionnel</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@etablissement.ci"
                  className="border-[#3A3A5A] bg-[#1A1A2E] text-[#F4E4BC] focus:ring-[#D4AF37]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-[#F4E4BC]">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  className="border-[#3A3A5A] bg-[#1A1A2E] text-[#F4E4BC] focus:ring-[#D4AF37]"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-[#D4AF37] text-[#1A1A2E] hover:bg-[#A68226] font-bold py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continuer vers l'onboarding"}
              </Button>
              <div className="text-center text-sm text-[#A0A0B8]">
                Déjà inscrit ?{' '}
                <Link href="/login" className="font-semibold text-[#D4AF37] hover:underline">
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
