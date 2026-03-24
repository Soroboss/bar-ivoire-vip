'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Wine } from 'lucide-react'
import { useAuth, useUser } from '@insforge/nextjs'
import { insforgeService } from '@/services/insforgeService'
import { insforge } from '@/lib/insforge'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Authentification en cours...')
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()

  useEffect(() => {
    if (!authLoaded || !userLoaded) return

    if (!isSignedIn) {
      // Check if we are in the middle of a callback (e.g. hash parameters)
      // The SDK usually handles this internally and updates isSignedIn.
      // If after some time it's still not signed in, go back to login.
      const timer = setTimeout(() => {
        if (!isSignedIn) {
          setStatus('Session non trouvée. Retour à la connexion...')
          setTimeout(() => router.push('/login'), 1500)
        }
      }, 5000)
      return () => clearTimeout(timer)
    }

    const checkProfile = async () => {
      if (!user) return
      setStatus('Vérification du profil...')
      try {
        const profile = await insforgeService.getProfileByUserId(user.id)
        
        const adminEmails = ['soroboss.bossimpact@gmail.com', 'admin@ivoirebar.vip', 'soro.nagony.adama@gmail.com']
        const userEmail = user.email?.toLowerCase() || ''
        const isKnownAdmin = adminEmails.some(email => email.toLowerCase() === userEmail)

        if (profile?.role === 'SUPER_ADMIN' || isKnownAdmin) {
          if (!profile || profile.role !== 'SUPER_ADMIN') {
            setStatus('Configuration de votre accès administrateur...')
            await insforge.database.from('profiles').upsert({
              id: user!.id,
              email: user!.email,
              role: 'SUPER_ADMIN',
              full_name: (user as any).user_metadata?.full_name || 'Admin',
              updated_at: new Date().toISOString()
            })
          }
          localStorage.removeItem('authSource')
          setStatus('Accès Administrateur détecté. Redirection...')
          setTimeout(() => {
            window.location.href = '/admin/dashboard'
          }, 500)
        } else {
          const source = localStorage.getItem('authSource')
          localStorage.removeItem('authSource')
          
          if (source === 'admin') {
            setStatus('Accès refusé. Déconnexion...')
            await insforge.auth.signOut()
            setTimeout(() => {
              window.location.href = '/admin/login?error=unauthorized'
            }, 500)
            return
          }

          // Check if user has an establishment
          const { data: est } = await insforge.database
            .from('establishments')
            .select('id')
            .eq('user_id', user!.id)
            .single()
          
          if (est) {
            setStatus('Accès Partenaire. Redirection...')
            setTimeout(() => router.push('/dashboard'), 500)
          } else {
            setStatus('Premier accès. Initialisation...')
            setTimeout(() => router.push('/onboarding'), 500)
          }
        }
      } catch (e) {
        console.error('Callback error:', e)
        setStatus('Erreur lors de la redirection...')
        setTimeout(() => router.push('/onboarding'), 1000)
      }
    }

    checkProfile()
  }, [authLoaded, userLoaded, isSignedIn, user, router])

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex flex-col items-center justify-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#A68226] text-[#1A1A2E] shadow-2xl shadow-[#D4AF37]/20 mb-6">
        <Wine className="h-8 w-8" />
      </div>
      <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37] mb-4" />
      <p className="text-[#A0A0B8] text-sm">{status}</p>
    </div>
  )
}
