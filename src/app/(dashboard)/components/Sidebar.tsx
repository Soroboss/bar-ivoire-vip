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
  { icon: ShoppingCart, label: 'Ventes (POS)', href: '/pos', permission: 'dashboard' }, // default to dashboard
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
        className="lg:hidden fixed top-4 left-4 z-50 text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <h1 className="text-xl font-black tracking-tighter text-foreground italic uppercase">
            IVOIRE BAR <span className="text-primary">VIP</span>
          </h1>
          {establishment && (
            <div className="mt-2 flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black px-2 py-0">
                {establishment.plan}
              </Badge>
              <span className="text-[10px] text-muted-foreground truncate max-w-[100px] font-medium">{establishment.name}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.filter(item => {
            if (userRole === 'SUPER_ADMIN') return true
            if (!userPermissions) return true // Default to showing all if not loaded or not set
            return userPermissions[item.permission] !== false
          }).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary text-primary-foreground font-bold shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary-foreground" : "text-slate-400 group-hover:text-primary"
                )} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-white rounded-full opacity-40" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-50 gap-3 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Déconnexion</span>
          </Button>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
