'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Clock, 
  Shield, 
  XCircle,
  LogIn
} from "lucide-react"
import { useAppContext } from '@/context/AppContext'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function StaffPage() {
  const { staff, toggleStaffStatus, loading } = useAppContext()

  if (loading) {
    return (
      <div className="p-6 h-screen bg-[#1A1A2E] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleStatusChange = async (id: string, name: string) => {
    await toggleStaffStatus(id)
  }

  return (
    <div className="p-6 space-y-8 bg-[#1A1A2E] text-[#F4E4BC] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#D4AF37]">Équipe & <span className="text-white">Personnel Cloud</span></h1>
          <p className="text-[#A0A0B8]">Suivi des présences via Supabase Realtime.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#3A3A5A] text-[#A0A0B8]">
            <Clock className="mr-2 h-4 w-4" /> Planning Cloud
          </Button>
          <Button className="bg-[#D4AF37] text-[#1A1A2E] hover:bg-[#A68226]">
            Ajouter Personnel
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {staff.length === 0 ? (
           <div className="col-span-full text-center py-20 text-[#A0A0B8]">Aucun membre du personnel enregistré.</div>
        ) : (
          staff.map(member => (
            <Card key={member.id} className="bg-[#252545] border-[#3A3A5A] hover:border-[#D4AF37] transition-all overflow-hidden">
              <CardHeader className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <Avatar className="h-14 w-14 border-2 border-[#D4AF37]/20">
                    <AvatarFallback className="bg-[#1A1A2E] text-[#D4AF37]">{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-right">
                    <Badge variant={member.status === 'Present' ? 'default' : 'secondary'} 
                      className={member.status === 'Present' ? "bg-green-500 text-white" : "bg-red-500/20 text-red-400"}
                    >
                      {member.status === 'Present' ? 'En service' : 'Absent'}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <CardTitle className="text-xl text-white">{member.name}</CardTitle>
                  <CardDescription className="text-[#D4AF37] flex items-center gap-1">
                    <Shield className="h-3 w-3" /> {member.role}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A0A0B8]">Dernier Pointage</span>
                    <span className="text-white font-mono">{member.checkIn || '--:--'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A0A0B8]">Statut Cloud</span>
                    <span className="text-[#4CAF50] font-bold">Synchronisé</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={() => handleStatusChange(member.id, member.name)}
                    className={`w-full font-bold h-12 ${
                      member.status === 'Present' 
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20' 
                        : 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20'
                    }`}
                  >
                    {member.status === 'Present' ? (
                      <><XCircle className="mr-2 h-4 w-4" /> Marquer Absent</>
                    ) : (
                      <><LogIn className="mr-2 h-4 w-4" /> Marquer Présent</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
