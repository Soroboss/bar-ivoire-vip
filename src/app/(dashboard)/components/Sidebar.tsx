'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  UserCircle, 
  BarChart3, 
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
  Search // Added Search as it was in the provided snippet, though not used in MENU_ITEMS
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard' },
  { icon: ShoppingCart, label: 'Ventes (POS)', href: '/pos' },
  { icon: Package, label: 'Inventaire', href: '/inventory' },
  { icon: Wallet, label: 'Dépenses', href: '/expenses' },
  { icon: Users, label: 'Clients VIP', href: '/clients' },
  { icon: BarChart3, label: 'Rapports', href: '/reports' },
  { icon: Users, label: 'Personnel', href: '/staff' },
  { icon: Settings, label: 'Paramètres', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const { establishment, signOut } = useAppContext()

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-[#252545] border-[#3A3A5A] text-[#D4AF37]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-[#151525] border-r border-[#3A3A5A] transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full h-full">
          <div className="flex flex-col items-center justify-center py-6 border-b border-[#3A3A5A] gap-2">
            <Link href="/admin/dashboard" className="transition-opacity hover:opacity-80 active:scale-95">
              <h1 className="text-xl font-bold text-[#D4AF37]">Ivoire Bar VIP</h1>
            </Link>
            {establishment && (
              <Badge className={cn(
                "px-3 py-0.5 text-[10px] uppercase font-black border-none tracking-widest",
                establishment.plan === 'VIP' ? "bg-[#D4AF37] text-[#1A1A2E]" : 
                establishment.plan === 'Business' ? "bg-blue-500 text-white" : 
                "bg-white/10 text-[#A0A0B8]"
              )}>
                {establishment.plan === 'Trial' ? 'ESSAI' : establishment.plan}
              </Badge>
            )}
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                    pathname === item.href 
                      ? "bg-[#D4AF37] text-[#1A1A2E] shadow-[0_0_20px_rgba(212,175,55,0.3)]" 
                      : "text-[#A0A0B8] hover:text-[#D4AF37] hover:bg-white/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-[#1A1A2E]" : "text-[#D4AF37] group-hover:scale-110 transition-transform"
                  )} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-[#3A3A5A]">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-[#A0A0B8] hover:text-red-400 hover:bg-red-950/20"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
