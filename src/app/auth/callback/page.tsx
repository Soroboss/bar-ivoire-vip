'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Wine } from 'lucide-react'
import { insforgeService } from '@/services/insforgeService'
import { insforge } from '@/lib/insforge'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Authentification en cours...')

  useEffect(() => {
    let mounted = true;
    const checkProfile = async (u: any) => {
      if (!mounted) return
      setStatus('Vérification des protocoles VIP...')
      try {
        const profile = await insforgeService.getProfileByUserId(u.id)
        
        // If we found a SUPER_ADMIN, proceed normally
        const actualRole = profile?.role?.toString().toUpperCase() || null
        if (actualRole === 'SUPER_ADMIN') {
          localStorage.removeItem('authSource')
          setStatus('Accès Administratif Validé. Liaison...')
          setTimeout(() => {
            if (mounted) window.location.href = '/admin/dashboard'
          }, 1200)
          return
        }

        // If no profile found but we are in an admin flow, try to elevate or wait
        const source = localStorage.getItem('authSource')
        if (source === 'admin') {
           setStatus('Vérification des privilèges étendus...')
           
           // Attempt elevation just in case (e.g. first time login)
           const { error: upsertError } = await insforge.database.from('profiles').upsert({
              id: u.id,
              email: u.email,
              role: 'SUPER_ADMIN',
              full_name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Admin',
              updated_at: new Date().toISOString()
           })

           if (!upsertError) {
             localStorage.removeItem('authSource')
             setStatus('Privilèges activés. Liaison...')
             setTimeout(() => {
               if (mounted) window.location.href = '/admin/dashboard'
             }, 800)
             return
           } else {
             // If elevation fails, then we really are not an admin
             setStatus('Accès refusé (Admin requis).')
             await insforge.auth.signOut()
             localStorage.removeItem('authSource')
             setTimeout(() => {
               if (mounted) window.location.href = '/admin/login?error=unauthorized'
             }, 1000)
             return
           }
        }

        // Standard user flow
        localStorage.removeItem('authSource')
        // Check if user has an establishment
        const { data: est } = await insforge.database
          .from('establishments')
          .select('id')
          .eq('user_id', u.id)
          .maybeSingle()
        
        if (est) {
          setStatus('Accès Partenaire Détecté. Liaison...')
          setTimeout(() => {
            if (mounted) window.location.href = '/dashboard'
          }, 800)
        } else {
          setStatus('Nouveau Partenaire détecté. Initialisation...')
          setTimeout(() => {
            if (mounted) window.location.href = '/onboarding'
          }, 800)
        }
      } catch (e) {
        console.error('Profile check error:', e)
        setStatus('Erreur de protocole. Réinitialisation...')
        const source = localStorage.getItem('authSource')
        const fallback = source === 'admin' ? '/admin/login' : '/onboarding'
        setTimeout(() => {
          if (mounted) window.location.href = fallback
        }, 1500)
      }
    }

    const handleAuth = async () => {
      try {
        // Wait a bit for slow network/hydration
        const timer = setTimeout(async () => {
          if (!mounted) return
          const { data: retry } = await (insforge.auth as any).getCurrentSession()
          if (retry?.session?.user) {
            await checkProfile(retry.session.user)
          } else {
            setStatus('Session non trouvée. Réorientation...')
            const source = localStorage.getItem('authSource')
            const fallback = source === 'admin' ? '/admin/login?error=no_session' : '/login?error=no_session'
            window.location.href = fallback
          }
        }, 3000)
        return () => clearTimeout(timer)

      } catch (err) {
        console.error('Session recovery failed:', err)
        if (mounted) window.location.href = '/login?error=auth_failed'
      }
    }

    handleAuth()

    return () => { mounted = false }
  }, [router])

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
