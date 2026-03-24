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
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAppContext } from '@/context/AppContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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
  const { establishment, userPermissions, userRole } = useAppContext()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
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
        "fixed inset-y-0 left-0 z-40 w-64 bg-[#020617] border-r border-white/10 transform transition-transform duration-500 ease-out lg:translate-x-0 flex flex-col font-montserrat shadow-[10px_0_30px_rgba(0,0,0,0.5)]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] pointer-events-none" />

        <div className="p-6 border-b border-white/5 bg-white/[0.02] relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 font-bold text-lg border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              I
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase">
                Ivoire <span className="text-blue-500">VIP</span>
              </h1>
            </div>
          </div>
          {establishment && (
            <div className="mt-5 flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
              <Badge variant="outline" className="bg-blue-600 border-none text-white text-[9px] font-bold px-2 py-0.5 shadow-[0_0_10px_rgba(37,99,235,0.4)]">
                {establishment.plan}
              </Badge>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest truncate">{establishment.name}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-6 relative z-10 scrollbar-hide">
          <p className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Navigation</p>
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
                  "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-blue-600/10 border-blue-500/30 border shadow-[0_0_20px_rgba(37,99,235,0.15)] text-blue-400" 
                    : "text-slate-400 border border-transparent hover:bg-white/5 hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                {isActive && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                )}
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive ? "text-blue-400 scale-110" : "text-slate-500 group-hover:text-white"
                )} />
                <span className="text-sm font-bold tracking-wide">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-white/5 relative z-10 bg-white/[0.01]">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-500 hover:text-red-400 hover:bg-red-500/10 gap-4 rounded-xl h-12 group transition-all"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Quitter la session</span>
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
