import { AdminSidebar } from "./components/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#0F0F1A]">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 bg-[#0F0F1A]">
        {children}
      </main>
    </div>
  )
}
