'use client'

import { AdminSidebar } from "./components/AdminSidebar"
import { useAppContext } from "@/context/AppContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, XCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-2xl bg-white shadow-xl shadow-slate-200 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Centre de Contrôle</h2>
        <p className="text-slate-500 text-sm max-w-xs mb-8 font-medium">
          Initialisation de votre environnement sécurisé...
        </p>
        
        <div className="pt-8 border-t border-slate-200 w-full max-w-xs">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-4">LIAISON SÉCURISÉE</p>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="h-10 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-white transition-all"
          >
            RÉESSAYER
          </Button>
        </div>
      </div>
    )
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (userRole !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="h-20 w-20 rounded-2xl bg-white shadow-xl shadow-slate-200 flex items-center justify-center mb-8">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Accès Restreint</h2>
        <p className="text-slate-500 text-sm max-w-sm mb-10 font-medium leading-relaxed px-4">
          Votre compte ne dispose pas des privilèges nécessaires pour accéder à l'interface d'administration centrale.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="h-12 px-8 rounded-xl font-bold"
          >
            RETOUR AU DASHBOARD
          </Button>
          <Button 
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/admin/login')
            }}
            className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-bold transition-all shadow-xl shadow-slate-200"
          >
            CHANGER DE COMPTE
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 bg-white relative">
        <div className="max-w-7xl mx-auto p-8 lg:p-12 relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
