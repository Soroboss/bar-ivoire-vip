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
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Établissements', icon: Building2, path: '/admin/establishments' },
  { name: 'Utilisateurs', icon: Users, path: '/admin/users' },
  { name: 'Revenus SaaS', icon: BarChart3, path: '/admin/revenue' },
  { name: 'Configuration', icon: Settings, path: '/admin/settings' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#05050A] border-r border-white/5 selection:bg-[#D4AF37]/30">
      {/* Premium Logo Section */}
      <div className="relative group overflow-hidden p-8 border-b border-white/5 bg-white/[0.01]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-[#D4AF37] flex items-center justify-center text-black shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-black text-white text-base tracking-tighter uppercase italic leading-none">Super <span className="text-[#D4AF37]">Régie</span></h1>
            <p className="text-[8px] text-[#A0A0B8] font-black uppercase tracking-[0.3em] mt-1 italic">Noyau Orbital</p>
          </div>
        </div>
      </div>

      {/* Navigation Space */}
      <nav className="flex-1 px-4 py-8 space-y-2 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 translate-x-1" 
                  : "text-[#A0A0B8] hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-black/20" />
              )}
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-500",
                isActive ? "scale-110" : "group-hover:scale-110 text-[#D4AF37]/50 group-hover:text-[#D4AF37]"
              )} />
              <span className="font-black text-[10px] uppercase tracking-[0.15em] italic">{item.name}</span>
              
              {!isActive && (
                <ChevronRight className="h-3 w-3 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#D4AF37]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Strategic Footer */}
      <div className="p-4 space-y-4 relative">
        <div className="p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 group hover:border-[#D4AF37]/20 transition-all overflow-hidden relative">
          <div className="absolute -bottom-4 -right-4 h-12 w-12 bg-[#D4AF37]/5 blur-xl group-hover:bg-[#D4AF37]/10 transition-all" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
               <Activity className="h-4 w-4 text-green-500 animate-pulse" />
            </div>
            <div>
              <p className="text-[8px] text-[#A0A0B8] font-black uppercase tracking-widest leading-none mb-1">Système</p>
              <p className="text-[10px] text-white font-black italic">Opérationnel</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all group font-black text-[10px] uppercase tracking-widest italic"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Quitter l'Unité
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#05050A]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-6 z-[100] justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-black">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-black text-white text-xs tracking-tighter uppercase italic">Régie</span>
        </div>
        <Button variant="ghost" size="icon" className="text-[#D4AF37]" onClick={() => setIsOpen(!isOpen)}>
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] animate-in slide-in-from-left duration-500">
            <SidebarContent />
          </div>
        </aside>
      )}
    </>
  )
}
