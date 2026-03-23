'use client'

import { AdminSidebar } from "./components/AdminSidebar"
import { useAppContext } from "@/context/AppContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userRole, loading, user } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || userRole !== 'SUPER_ADMIN')) {
      router.push('/admin/login')
    }
  }, [user, userRole, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
      </div>
    )
  }

  if (userRole !== 'SUPER_ADMIN') {
    return null
  }

  return (
    <div className="flex min-h-screen bg-[#0F0F1A]">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 bg-[#0F0F1A]">
        {children}
      </main>
    </div>
  )
}
