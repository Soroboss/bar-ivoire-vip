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
      // Les SUPER_ADMIN peuvent tout voir sans établissement rattaché
      if (userRole === 'SUPER_ADMIN') return

      if (!establishment) {
        // Aucun établissement : rediriger vers l'inscription
        router.push('/onboarding')
      } else if (establishment.status !== 'Active') {
        // Bloque Pending ET Suspended → page d'attente
        router.push('/onboarding')
      }
    }
  }, [loading, establishment, pathname, router, userRole])

  if (loading) {
    return (
      <div className="flex h-screen bg-[#1A1A2E] items-center justify-center">
        <div className="h-12 w-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#1A1A2E] text-[#F4E4BC]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:pl-64">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
