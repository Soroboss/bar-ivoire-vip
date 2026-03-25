'use client'

import { Sidebar } from './components/Sidebar'
import { useAppContext } from '@/context/AppContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

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
    <div className="flex h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary/20">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center opacity-20">
        <div className="w-[50vw] h-[50vw] bg-primary/10 blur-[150px] rounded-full" />
      </div>
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:pl-64 relative z-10 scrollbar-hide">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
