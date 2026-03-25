'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  X, 
  Menu,
  Wallet,
  Search,
  UserCircle
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, getGreeting } from '@/lib/utils'
import { toast } from 'sonner'
import { useAppContext } from '@/context/AppContext'
import { insforge } from '@/lib/insforge'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard', permission: 'dashboard' },
  { icon: ShoppingCart, label: 'Ventes (POS)', href: '/pos', permission: 'dashboard' },
  { icon: Package, label: 'Inventaire', href: '/inventory', permission: 'inventory' },
  { icon: Wallet, label: 'Dépenses', href: '/expenses', permission: 'inventory' },
  { icon: Users, label: 'Personnel', href: '/staff', permission: 'staff' },
  { icon: UserCircle, label: 'Clients VIP', href: '/clients', permission: 'staff' },
  { icon: BarChart3, label: 'Rapports', href: '/reports', permission: 'revenue' },
  { icon: Settings, label: 'Paramètres', href: '/settings', permission: 'settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { establishment, userPermissions, userRole, userFullName, user } = useAppContext()
  const router = useRouter()
  
  const displayName = userFullName || establishment?.owner || user?.email?.split('@')[0] || 'Partenaire'
  const displayRole = userRole === 'Admin' ? 'Administrateur' : 'Gérant'

  const handleLogout = async () => {
    try {
      await insforge.auth.signOut()
      toast.success('Déconnexion réussie')
      router.push('/login')
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        className="lg:hidden fixed top-4 left-4 z-50 text-white hover:bg-white/10 rounded-xl backdrop-blur-md border border-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-sidebar border-r border-white/5 transform transition-transform duration-500 ease-out lg:translate-x-0 flex flex-col font-montserrat shadow-[20px_0_50px_rgba(0,0,0,0.8)]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] pointer-events-none" />

        <div className="p-10 border-b border-white/5 bg-white/[0.02] relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-black text-xl border border-primary/30 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              I
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
                Ivoire <span className="gold-gradient-text">VIP</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mt-1">SaaS Opérationnel</p>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col gap-1 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
              {getGreeting()},
            </span>
            <span className="text-white font-black text-sm truncate">
              {displayName}
            </span>
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              {displayRole}
            </span>
          </div>

          {establishment && (
            <div className="mt-8 flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl group hover:border-primary/20 transition-all duration-500">
              <Badge className="bg-primary text-primary-foreground text-[9px] font-black px-3 py-1 rounded-lg shadow-lg shadow-primary/20 tracking-widest uppercase">
                {establishment.plan}
              </Badge>
              <span className="text-[10px] text-white font-black uppercase tracking-[0.2em] truncate">{establishment.name}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto py-8 relative z-10 scrollbar-hide">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Navigation Centrale</p>
          {MENU_ITEMS.filter(item => {
            if (userRole === 'SUPER_ADMIN') return true
            if (!userPermissions) return true 
            return userPermissions[item.permission] !== false
          }).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden mb-1",
                  isActive 
                    ? "bg-primary/10 border-primary/30 border shadow-[0_0_30px_rgba(212,175,55,0.2)] text-primary" 
                    : "text-muted-foreground/40 border border-transparent hover:bg-white/5 hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute inset-y-0 left-0 w-1.5 bg-primary shadow-[0_0_15px_rgba(212,175,55,1)]" 
                  />
                )}
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-500",
                  isActive ? "text-primary scale-110" : "text-muted-foreground/40 group-hover:text-white group-hover:scale-110"
                )} />
                <span className="text-xs font-black tracking-[0.1em] uppercase">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-8 border-t border-white/5 relative z-10 bg-white/[0.01]">
          <Button
            variant="ghost"
            className="w-full justify-start text-white/20 hover:text-red-500 hover:bg-red-500/10 gap-5 rounded-2xl h-14 group transition-all duration-500 border border-transparent hover:border-red-500/20"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Terminer Session</span>
          </Button>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
