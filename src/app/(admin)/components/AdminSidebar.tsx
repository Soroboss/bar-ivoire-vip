'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  Settings, 
  Building2, 
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { insforge } from '@/lib/insforge'
import { useRouter } from 'next/navigation'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Établissements', icon: Building2, path: '/admin/establishments' },
  { name: 'Utilisateurs', icon: Users, path: '/admin/users' },
  { name: 'Rôles & Accès', icon: ShieldCheck, path: '/admin/roles' },
  { name: 'Revenus SaaS', icon: BarChart3, path: '/admin/revenue' },
  { name: 'Configuration', icon: Settings, path: '/admin/settings' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await insforge.auth.signOut()
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background border-r border-white/5 selection:bg-primary/10">
      {/* Logo Section */}
      <div className="p-10 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-black text-white text-lg leading-none uppercase tracking-tighter">Régie <span className="gold-gradient-text">Elite</span></h1>
            <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-[0.3em] mt-1">Infrastructure Orbitale</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-10 space-y-2">
        <p className="text-[10px] text-muted-foreground/20 font-black uppercase tracking-[0.6em] mb-6 pl-4">Menu Stratégique</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "group flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-500 border border-transparent",
                isActive 
                  ? "bg-primary/10 text-primary border-primary/20 shadow-lg shadow-primary/5" 
                  : "text-muted-foreground/60 hover:text-white hover:bg-white/5 hover:border-white/5"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-all duration-500",
                isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-white group-hover:scale-110 group-hover:rotate-12"
              )} />
              <span className="font-black text-[11px] uppercase tracking-widest">{item.name}</span>
              {isActive && (
                <div className="ml-auto animate-pulse flex h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 space-y-4">
        <div className="p-6 rounded-[1.8rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl group hover:border-emerald-500/20 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Statut Optimal</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-5 w-full px-6 py-4 rounded-2xl text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/5 transition-all duration-500 font-black text-[10px] uppercase tracking-widest"
        >
          <LogOut className="h-5 w-5 translate-y-[-1px]" />
          Déconnexion Sécurisée
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar/80 backdrop-blur-xl border-b border-white/5 flex items-center px-6 z-[100] justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-bold text-white text-sm">Admin</span>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 hidden lg:block z-50">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile */}
      {isOpen && (
        <aside className="fixed inset-0 z-[110] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </div>
        </aside>
      )}
    </>
  )
}
