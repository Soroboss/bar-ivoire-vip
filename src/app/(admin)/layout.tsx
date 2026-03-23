'use client'

import { AdminSidebar } from "./components/AdminSidebar"
import { useAppContext } from "@/context/AppContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, XCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userRole, loading, user } = useAppContext()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!loading && !isLoginPage && (!user || userRole !== 'SUPER_ADMIN')) {
      router.push('/admin/login')
    }
  }, [user, userRole, loading, router, isLoginPage])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37] mb-6" />
        <h2 className="text-xl font-bold text-white mb-2">Chargement de la base stratégique...</h2>
        <p className="text-[#A0A0B8] text-sm max-w-xs mb-8 italic">
          Cette opération peut prendre quelques secondes selon votre connexion.
        </p>
        
        <div className="pt-8 border-t border-[#3A3A5A]/30 w-full max-w-xs">
          <p className="text-[10px] text-[#3A3A5A] uppercase font-bold tracking-widest mb-4">L'écran reste figé ?</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs font-black text-[#D4AF37] hover:underline"
          >
            FORCER LE REDÉMARRAGE
          </button>
        </div>
      </div>
    )
  }

  // Allow login page to render even if not admin
  if (isLoginPage) {
    return <>{children}</>
  }

  if (userRole !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
          <XCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">Accès Restreint</h2>
        <p className="text-[#A0A0B8] text-sm max-w-sm mb-8">
          Votre compte ne dispose pas des privilèges nécessaires pour accéder au centre de contrôle stratégique.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-[#1A1A2E] text-white rounded-xl font-bold border border-[#3A3A5A] hover:bg-[#2A2A3E] transition-all"
          >
            Dashboard Client
          </button>
          <button 
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/admin/login')
            }}
            className="px-6 py-3 bg-[#D4AF37] text-black rounded-xl font-bold hover:bg-[#B6962E] transition-all"
          >
            Changer de compte
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0F0F1A]">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 bg-[#0F0F1A]">
        {children}
      </main>
    </div>
  )
}
