'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Clock, 
  Shield, 
  XCircle,
  LogIn,
  Loader2,
  Mail,
  Phone,
  MoreVertical,
  UserPlus,
  ShieldCheck,
  Zap
} from "lucide-react"
import { useAppContext } from '@/context/AppContext'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from 'framer-motion'

export default function StaffPage() {
  const { staff, toggleStaffStatus, loading } = useAppContext()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
             <Users className="h-8 w-8 text-blue-600" />
           </div>
           <p className="text-sm font-medium text-slate-500">Chargement de l'équipe...</p>
        </div>
      </div>
    )
  }

  const handleStatusChange = async (id: string, name: string) => {
    await toggleStaffStatus(id)
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-blue-600 rounded-full" />
            <p className="subheading text-blue-600">Ressources Humaines</p>
          </div>
          <h1 className="heading-xl">Équipe & Staff</h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
            Gérez les accès de votre personnel, suivez les présences et configurez les permissions de chaque collaborateur.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-6 rounded-xl transition-all">
            <Clock className="mr-2 h-4 w-4" /> Planning
          </Button>
          <Button className="bg-blue-600 text-white font-bold h-12 px-8 hover:bg-blue-700 shadow-lg shadow-blue-100 rounded-xl flex items-center gap-2 transition-all">
            <UserPlus className="h-4 w-4" /> Nouveau Membre
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {staff.length === 0 ? (
           <div className="col-span-full h-64 flex flex-col items-center justify-center gap-4 bg-slate-50 border-2 border-dashed border-slate-100 rounded-2xl">
              <Users className="h-12 w-12 text-slate-300" />
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Aucun membre enregistré</p>
           </div>
        ) : (
          staff.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="premium-card rounded-2xl overflow-hidden group">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <Avatar className="h-20 w-20 rounded-2xl border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-2xl">
                          {member.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white",
                        member.status === 'Present' ? 'bg-emerald-500' : 'bg-slate-300'
                      )} />
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                       <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mt-6 space-y-2">
                    <h2 className="text-xl font-bold text-slate-900">{member.name}</h2>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border-none">
                        {member.role}
                      </Badge>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actif</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-8">
                  <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Arrivée</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{member.checkIn || '--:--'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Shield className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        member.status === 'Present' ? 'text-emerald-600' : 'text-slate-400'
                      )}>{member.status === 'Present' ? 'En service' : 'Absent'}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      className="flex-1 h-12 bg-white border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all rounded-xl"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 h-12 bg-white border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all rounded-xl"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button 
                    onClick={() => handleStatusChange(member.id, member.name)}
                    className={cn(
                      "w-full font-bold h-12 rounded-xl transition-all flex items-center justify-center gap-2",
                      member.status === 'Present' 
                        ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    )}
                  >
                    {member.status === 'Present' ? (
                      <><XCircle className="h-4 w-4" /> TERMINER LE SERVICE</>
                    ) : (
                      <><LogIn className="h-4 w-4" /> DÉMARRER LE SERVICE</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
