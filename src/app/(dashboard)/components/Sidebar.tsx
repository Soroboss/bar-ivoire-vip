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
        className="lg:hidden fixed top-4 left-4 z-50 text-primary hover:bg-primary/10 rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transform transition-transform duration-500 ease-in-out lg:translate-x-0 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.02)]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8">
          <h1 className="text-xl font-black tracking-tighter text-foreground italic uppercase leading-none">
            IVOIRE BAR <span className="gold-gradient-text">VIP</span>
          </h1>
          {establishment && (
            <div className="mt-3 flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-none text-[8px] uppercase font-black px-2 py-0.5 tracking-widest">
                {establishment.plan}
              </Badge>
              <span className="text-[9px] text-muted-foreground truncate max-w-[100px] font-bold uppercase italic tracking-tight">{establishment.name}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide py-4">
          <p className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-4 italic">Navigation Orbitale</p>
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
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-primary text-white font-black italic shadow-lg shadow-primary/20 scale-[1.02]" 
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110 duration-300",
                  isActive ? "text-white" : "text-primary/40 group-hover:text-primary"
                )} />
                <span className={cn(
                  "text-[11px] uppercase tracking-wider font-black",
                  isActive ? "italic" : "opacity-70 group-hover:opacity-100"
                )}>{item.label}</span>
                {isActive && (
                  <div className="absolute left-1 w-1 h-5 bg-white/40 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-border bg-muted/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-50 gap-4 rounded-2xl h-14 group transition-all"
            onClick={handleLogout}
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted group-hover:bg-red-100 transition-colors">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest italic">Déconnexion</span>
          </Button>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
