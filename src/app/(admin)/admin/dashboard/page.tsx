import nextDynamic from 'next/dynamic'

export const dynamic = 'force-dynamic'

const AdminDashboardContent = nextDynamic(
  () => import('./AdminDashboardContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="p-6 space-y-8 bg-[#0F0F1A] min-h-screen animate-pulse">
        <div className="h-20 bg-[#1A1A2E] rounded-2xl border border-[#3A3A5A]" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-[#1A1A2E] rounded-2xl border border-[#3A3A5A]" />)}
        </div>
        <div className="h-96 bg-[#1A1A2E] rounded-2xl border border-[#3A3A5A]" />
      </div>
    )
  }
)

export default function AdminDashboardPage() {
  return <AdminDashboardContent />
}
