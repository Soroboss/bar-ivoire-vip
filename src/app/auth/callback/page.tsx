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

    const handleAuth = async () => {
      // 1. Check if we already have a session through the hook
      if (isSignedIn && user) {
        await checkProfile(user)
        return
      }

      // 2. Try manual recovery (fallback for hydration lag)
      try {
        const { data, error } = await (insforge.auth as any).getCurrentSession()
        if (data?.session?.user) {
          await checkProfile(data.session.user)
          return
        }
      } catch (err) {
        console.error('Manual session recovery failed:', err)
      }

      // 3. Wait for SDK if we haven't given up yet
      const source = localStorage.getItem('authSource')
      const timer = setTimeout(() => {
        if (!isSignedIn) {
          setStatus('Session non trouvée. Réorientation...')
          const fallback = source === 'admin' ? '/admin/login?error=no_session' : '/login?error=no_session'
          setTimeout(() => {
             window.location.href = fallback
          }, 1500)
        }
      }, 8000)

      return () => clearTimeout(timer)
    }

    const checkProfile = async (u: any) => {
      setStatus('Vérification des protocoles VIP...')
      try {
        const profile = await insforgeService.getProfileByUserId(u.id)
        
        const adminEmails = ['soroboss.bossimpact@gmail.com', 'admin@ivoirebar.vip', 'soro.nagony.adama@gmail.com']
        const userEmail = u.email?.toLowerCase() || ''
        const isKnownAdmin = adminEmails.some(email => email.toLowerCase() === userEmail)

        if (profile?.role === 'SUPER_ADMIN' || isKnownAdmin) {
          if (!profile || profile.role !== 'SUPER_ADMIN') {
            setStatus('Élévation des privilèges Admin...')
            await insforge.database.from('profiles').upsert({
              id: u.id,
              email: u.email,
              role: 'SUPER_ADMIN',
              full_name: u.user_metadata?.full_name || 'Admin',
              updated_at: new Date().toISOString()
            })
          }
          localStorage.removeItem('authSource')
          setStatus('Accès Administratif Validé. Liaison...')
          setTimeout(() => {
            window.location.href = '/admin/dashboard'
          }, 800)
        } else {
          const source = localStorage.getItem('authSource')
          localStorage.removeItem('authSource')
          
          if (source === 'admin') {
            setStatus('Accès refusé (Admin requis).')
            await insforge.auth.signOut()
            setTimeout(() => {
              window.location.href = '/admin/login?error=unauthorized'
            }, 1000)
            return
          }

          // Check if user has an establishment
          const { data: est } = await insforge.database
            .from('establishments')
            .select('id')
            .eq('user_id', u.id)
            .maybeSingle()
          
          if (est) {
            setStatus('Accès Partenaire Détecté. Liaison...')
            setTimeout(() => window.location.href = '/dashboard', 800)
          } else {
            setStatus('Nouveau Partenaire détecté. Initialisation...')
            setTimeout(() => window.location.href = '/onboarding', 800)
          }
        }
      } catch (e) {
        console.error('Profile check error:', e)
        setStatus('Erreur de protocole. Réinitialisation...')
        const source = localStorage.getItem('authSource')
        const fallback = source === 'admin' ? '/admin/login' : '/onboarding'
        setTimeout(() => window.location.href = fallback, 1500)
      }
    }

    handleAuth()
  }, [authLoaded, userLoaded, isSignedIn, user])

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
