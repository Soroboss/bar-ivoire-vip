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
      <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-10">
          <div className="h-24 w-24 rounded-[2rem] bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center animate-pulse-slow">
            <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" />
          </div>
          <div className="absolute inset-0 h-24 w-24 rounded-[2rem] border border-[#D4AF37]/50 animate-ping opacity-20" />
        </div>
        
        <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter italic">Noyau <span className="gold-gradient-text">Stratégique</span></h2>
        <p className="text-[#A0A0B8] text-sm max-w-xs mb-10 font-medium italic opacity-60">
          Initialisation des protocoles orbitaux Ivoire Bar VIP...
        </p>
        
        <div className="pt-8 border-t border-white/5 w-full max-w-xs">
          <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.3em] mb-4">LIAISON EN COURS</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-[10px] font-black text-[#D4AF37] hover:bg-[#D4AF37]/10 px-4 py-2 rounded-lg border border-[#D4AF37]/20 transition-all uppercase tracking-widest"
          >
            Réinitialiser Flux
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
        <div className="h-24 w-24 rounded-3xl bg-red-500/5 flex items-center justify-center text-red-500 mb-8 border border-red-500/20 shadow-2xl shadow-red-500/5">
          <XCircle className="h-12 w-12" />
        </div>
        <h2 className="text-4xl font-black text-white mb-3 uppercase italic tracking-tighter">Accès Restreint</h2>
        <p className="text-[#A0A0B8] text-base max-w-sm mb-10 font-medium leading-relaxed">
          Votre signature biométrique ne dispose pas des privilèges requis pour le centre de contrôle.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 bg-white/5 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/10 transition-all"
          >
            Dashboard Client
          </button>
          <button 
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/admin/login')
            }}
            className="px-8 py-4 bg-[#D4AF37] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#B6962E] shadow-xl shadow-[#D4AF37]/10 transition-all"
          >
            Changer Unité
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#05050A]">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 bg-[#05050A] relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-20" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
