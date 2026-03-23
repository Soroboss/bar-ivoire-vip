'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, Wine } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Connexion en cours...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for code in URL query params (PKCE flow)
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        }

        // Check if we have a session (covers both flows)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          setStatus('Connecté ! Redirection...')
          router.push('/dashboard')
        } else {
          // Wait a moment for the session to be established
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession()
            if (retrySession) {
              router.push('/dashboard')
            } else {
              setStatus('Erreur de session')
              router.push('/login?error=no-session')
            }
          }, 2000)
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login?error=callback-failed')
      }
    }

    handleCallback()
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
