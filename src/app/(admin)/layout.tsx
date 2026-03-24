'use client'

import { AdminSidebar } from "./components/AdminSidebar"
import { useAppContext } from "@/context/AppContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, XCircle } from "lucide-react"
import { insforge } from "@/lib/insforge"
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
    // Determine if we should redirect
    // We only redirect if:
    // 1. Loading is finished
    // 2. We are not on the login page
    // 3. User is definitely missing OR (User is present AND role is checked and failed)
    
    const isReady = !loading
    const hasUser = !!user
    const roleChecked = userRole !== null
    const hasAccess = userRole === 'SUPER_ADMIN'

    // Critical: If we have a user but no role yet, DON'T redirect, just wait.
    if (isReady && !isLoginPage) {
      if (!hasUser || (roleChecked && !hasAccess)) {
        console.log('[AdminLayout] Access denied, redirecting. User:', hasUser, 'Role:', userRole)
        router.push('/admin/login')
      }
    }
  }, [user, userRole, loading, router, isLoginPage])

  // Show loader if context is loading OR if we have a user but the role hasn't arrived yet
  const needsProfileFetch = user && userRole === null
  if (loading || (!isLoginPage && needsProfileFetch)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-2xl bg-card shadow-2xl shadow-primary/5 flex items-center justify-center border border-white/5">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight uppercase">Centre de Contrôle</h2>
        <p className="text-muted-foreground text-sm max-w-xs mb-8 font-medium">
          Initialisation de votre environnement sécurisé...
        </p>
        
        <div className="pt-8 border-t border-white/5 w-full max-w-xs">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mb-4">LIAISON SÉCURISÉE</p>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="h-10 rounded-xl border-white/10 bg-white/5 font-bold text-white hover:bg-white/10 transition-all"
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="h-20 w-20 rounded-2xl bg-card shadow-xl shadow-red-500/5 border border-red-500/20 flex items-center justify-center mb-8">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Accès Restreint</h2>
        <p className="text-muted-foreground text-sm max-w-sm mb-10 font-medium leading-relaxed px-4">
          Votre compte ne dispose pas des privilèges nécessaires pour accéder à l'interface d'administration centrale.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="h-12 px-8 rounded-xl font-bold border-white/10 bg-white/5 text-white"
          >
            RETOUR AU DASHBOARD
          </Button>
          <Button 
            onClick={async () => {
              await insforge.auth.signOut()
              router.push('/admin/login')
            }}
            className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all shadow-xl shadow-primary/20"
          >
            CHANGER DE COMPTE
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 bg-background relative">
        <div className="max-w-7xl mx-auto p-8 lg:p-12 relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
