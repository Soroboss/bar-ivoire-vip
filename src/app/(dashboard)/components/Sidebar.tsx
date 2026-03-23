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
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard' },
  { icon: ShoppingCart, label: 'Ventes (POS)', href: '/pos' },
  { icon: Package, label: 'Inventaire', href: '/inventory' },
  { icon: Wallet, label: 'Dépenses', href: '/expenses' },
  { icon: Users, label: 'Personnel', href: '/staff' },
  { icon: UserCircle, label: 'Clients VIP', href: '/clients' },
  { icon: BarChart3, label: 'Rapports', href: '/reports' },
  { icon: Settings, label: 'Paramètres', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { establishment } = useAppContext()
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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
        className="lg:hidden fixed top-4 left-4 z-50 text-[#D4AF37]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-[#0F0F1A] border-r border-[#3A3A5A] transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <h1 className="text-xl font-black tracking-tighter text-white italic">
            IVOIRE BAR <span className="text-[#D4AF37]">VIP</span>
          </h1>
          {establishment && (
            <div className="mt-2 flex items-center gap-2">
              <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-none text-[10px] uppercase font-black px-2 py-0">
                {establishment.plan}
              </Badge>
              <span className="text-[10px] text-[#A0A0B8] truncate max-w-[100px]">{establishment.name}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-[#D4AF37] text-[#1A1A2E] font-bold shadow-[0_10px_20px_rgba(212,175,55,0.1)]" 
                    : "text-[#A0A0B8] hover:bg-white/5 hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-[#1A1A2E]" : "text-[#3A3A5A] group-hover:text-[#D4AF37]"
                )} />
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-[#1A1A2E] rounded-full opacity-20" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#3A3A5A]">
          <Button
            variant="ghost"
            className="w-full justify-start text-[#A0A0B8] hover:text-red-400 hover:bg-red-500/5 gap-3 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Déconnexion</span>
          </Button>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
