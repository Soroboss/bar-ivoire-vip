'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, Wine } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Authentification en cours...')

  useEffect(() => {
    // Listen for auth state changes (covers implicit & PKCE flows)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
          setStatus('Vérification du profil...')
          
          try {
            // First ensure we have a profile. If not, create a basic one from session
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single()

            const adminEmails = ['soroboss.bossimpact@gmail.com', 'admin@ivoirebar.vip']
            const isKnownAdmin = adminEmails.includes(session.user.email || '')

            if (profile?.role === 'SUPER_ADMIN' || isKnownAdmin) {
              // If it's a known admin but profile is missing or role is not set, fix it
              if (!profile || profile.role !== 'SUPER_ADMIN') {
                setStatus('Configuration de votre accès administrateur...')
                await supabase.from('profiles').upsert({
                  id: session.user.id,
                  email: session.user.email,
                  role: 'SUPER_ADMIN',
                  full_name: session.user.user_metadata?.full_name || 'Admin',
                  updated_at: new Date().toISOString()
                })
              }
              setStatus('Accès Administrateur détecté. Redirection...')
              setTimeout(() => {
                window.location.href = '/admin/dashboard'
              }, 500)
            } else {
              // Check if user has an establishment
              const { data: est } = await supabase
                .from('establishments')
                .select('id')
                .eq('user_id', session.user.id)
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
            console.error('Callback error or timeout:', e)
            setStatus('Initialisation générique...')
            // Fallback to onboarding or dashboard
            setTimeout(() => router.push('/onboarding'), 1000)
          }
        }
      }
    )

    // Fallback: if no auth event fires within 5 seconds, check manually
    const fallbackTimer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setStatus('Vérification finale...')
        window.location.reload() // Force a re-run of the event listener which has the logic
      } else {
        setStatus('Session non trouvée. Retour à la connexion...')
        setTimeout(() => router.push('/login'), 1500)
      }
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(fallbackTimer)
    }
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
