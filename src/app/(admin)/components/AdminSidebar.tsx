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
    <div className="flex flex-col h-full bg-white border-r border-slate-100 selection:bg-blue-50">
      {/* Logo Section */}
      <div className="p-8 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-none">Administration</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ivoire Bar VIP</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-blue-50 text-blue-600 border border-blue-100/50" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-200" />
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Système Actif</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all font-bold text-sm"
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center px-6 z-[100] justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-bold text-slate-900 text-sm">Admin</span>
        </div>
        <Button variant="ghost" size="icon" className="text-slate-500" onClick={() => setIsOpen(!isOpen)}>
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
