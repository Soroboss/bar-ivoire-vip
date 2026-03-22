import { Sidebar } from './components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#1A1A2E] text-[#F4E4BC]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:pl-64">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
