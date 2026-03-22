'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  UserCircle, 
  BarChart3, 
  Settings,
  LogOut,
  X,
  Menu
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Caisse (POS)', href: '/pos', icon: ShoppingCart },
  { name: 'Inventaire', href: '/inventory', icon: Package },
  { name: 'Personnel', href: '/staff', icon: Users },
  { name: 'Clients VIP', href: '/clients', icon: UserCircle },
  { name: 'Rapports', href: '/reports', icon: BarChart3 },
  { name: 'Paramètres', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    toast.success('Déconnexion réussie')
    router.push('/onboarding')
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
          <div className="flex items-center justify-center h-20 border-b border-[#3A3A5A]">
            <Link href="/admin/dashboard" className="transition-opacity hover:opacity-80 active:scale-95">
              <h1 className="text-xl font-bold text-[#D4AF37]">Ivoire Bar VIP</h1>
            </Link>
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
