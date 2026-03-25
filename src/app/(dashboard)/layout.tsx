'use client'

import { Sidebar } from './components/Sidebar'
import { useAppContext } from '@/context/AppContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { establishment, loading, userRole } = useAppContext()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      // Le système de validation "Pending" est temporairement désactivé
      // pour permettre aux partenaires d'accéder au dashboard immédiatement.
      /*
      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') return
      if (!establishment || establishment.status !== 'Active') {
        router.push('/onboarding')
      }
      */
    }
  }, [loading, establishment, pathname, router, userRole])

  if (loading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#07070F] text-foreground relative overflow-hidden selection:bg-primary/20">
      {/* Animated Ambient VIP Lighting */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center opacity-30 overflow-hidden mix-blend-screen">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[20%] left-[10%] w-[60vw] h-[60vw] bg-primary/20 blur-[180px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[0%] -right-[10%] w-[50vw] h-[50vw] bg-purple-500/20 blur-[180px] rounded-full" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
      </div>

      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:pl-64 relative z-10 scrollbar-hide perspective-[1000px]">
        <div className="p-6 md:p-10 max-w-7xl mx-auto h-full animate-in fade-in zoom-in-95 duration-1000 slide-in-from-bottom-10">
          {children}
        </div>
      </main>
    </div>
  )
}
