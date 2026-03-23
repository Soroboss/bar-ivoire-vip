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
        if (event === 'SIGNED_IN' && session) {
          setStatus('Connecté ! Redirection...')
          // Small delay to ensure cookies are set
          setTimeout(() => router.push('/dashboard'), 500)
        }
        if (event === 'TOKEN_REFRESHED' && session) {
          setStatus('Connecté ! Redirection...')
          setTimeout(() => router.push('/dashboard'), 500)
        }
      }
    )

    // Fallback: if no auth event fires within 5 seconds, check manually
    const fallbackTimer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setStatus('Connecté ! Redirection...')
        router.push('/dashboard')
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
