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
  ShieldCheck,
  Menu,
  X,
  Crown,
  CreditCard
} from 'lucide-react'
import { cn, getGreeting } from '@/lib/utils'
import { useAppContext } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { insforge } from '@/lib/insforge'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Établissements', icon: Building2, path: '/admin/establishments' },
  { name: 'Abonnements', icon: CreditCard, path: '/admin/subscriptions' },
  { name: 'Forfaits SaaS', icon: Crown, path: '/admin/plans' },
  { name: 'Utilisateurs', icon: Users, path: '/admin/users' },
  { name: 'Rôles & Accès', icon: ShieldCheck, path: '/admin/roles' },
  { name: 'Revenus SaaS', icon: BarChart3, path: '/admin/revenue' },
  { name: 'Configuration', icon: Settings, path: '/admin/settings' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { userFullName, userRole, user } = useAppContext()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const displayName = userFullName || user?.email?.split('@')[0] || 'Admin'
  const displayRole = userRole === 'Admin' ? 'Super Administrateur' : (userRole || 'Admin')

  const handleLogout = async () => {
    await insforge.auth.signOut()
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-white/5 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      
      {/* Logo Section */}
      <div className="p-10 border-b border-white/5 bg-white/[0.02] relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-black text-white text-lg leading-none uppercase tracking-tighter">
              Régie <span className="gold-gradient-text">Elite</span>
            </h1>
            <p className="text-[10px] text-primary/40 font-black uppercase tracking-[0.4em] mt-1">SaaS Protocol</p>
          </div>
        </div>

        {/* User Greeting Block */}
        <div className="mx-6 mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-white/40 text-[9px] uppercase tracking-widest font-black mb-1">
            {getGreeting()},
          </p>
          <p className="text-white font-black text-sm truncate">
            {displayName}
          </p>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            {displayRole}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-10 space-y-2 overflow-y-auto relative z-10">
        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] mb-8 pl-4">Système Central</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "group flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-500 border border-transparent mb-1 overflow-hidden relative",
                isActive 
                  ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]" 
                  : "text-muted-foreground/40 hover:text-white hover:bg-white/5 hover:border-white/5"
              )}
              onClick={() => setIsOpen(false)}
            >
              {isActive && (
                <motion.div 
                  layoutId="admin-active-bar"
                  className="absolute inset-y-0 left-0 w-1 bg-primary shadow-[0_0_15px_rgba(212,175,55,1)]" 
                />
              )}
              <item.icon className={cn(
                "h-5 w-5 transition-all duration-500",
                isActive ? "text-primary scale-110" : "text-muted-foreground/40 group-hover:text-white group-hover:scale-110"
              )} />
              <span className="font-black text-[11px] uppercase tracking-widest">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-8 border-t border-white/5 relative z-10 bg-white/[0.01]">
        <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </div>
          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Régie Connectée</p>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-5 w-full px-6 py-4 rounded-2xl text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all duration-500 font-black text-[10px] uppercase tracking-[0.3em] group border border-transparent hover:border-red-500/20"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <>
      <Button 
        variant="ghost" 
        className="lg:hidden fixed top-4 left-4 z-50 text-white bg-sidebar/50 border border-white/10 backdrop-blur-md px-4 h-12 rounded-xl" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside className="fixed left-0 top-0 bottom-0 w-72 hidden lg:block z-50">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-[110] lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

