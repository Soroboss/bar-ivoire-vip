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
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
             <Users className="h-8 w-8 text-primary" />
           </div>
           <p className="text-sm font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Initialisation Équipe...</p>
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
            <div className="h-2 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <p className="subheading text-primary font-bold">Ressources Humaines</p>
          </div>
          <h1 className="heading-xl">Équipe VIP</h1>
          <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">
            Gérez les accès de votre personnel, suivez les présences et configurez les permissions de chaque collaborateur.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 font-black px-6 rounded-xl transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-white/5">
            <Clock className="mr-2 h-4 w-4 text-primary" /> Planning
          </Button>
          <Button className="bg-primary text-primary-foreground font-black h-12 px-8 hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl flex items-center gap-2 transition-all uppercase text-[10px] tracking-widest">
            <UserPlus className="h-4 w-4" /> Nouveau Membre
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {staff.length === 0 ? (
           <div className="col-span-full h-80 flex flex-col items-center justify-center gap-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-center border-dashed">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center">
                <Users className="h-10 w-10 text-muted-foreground/20" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 leading-loose mx-10">Aucun collaborateur VIP trouvé — Ajoutez votre équipe</p>
           </div>
        ) : (
          staff.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="premium-card rounded-[2.5rem] overflow-hidden group border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <Avatar className="h-24 w-24 rounded-[2rem] border-2 border-white/5 shadow-2xl ring-4 ring-primary/5">
                        <AvatarFallback className="bg-primary text-primary-foreground font-black text-3xl uppercase italic">
                          {member.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-card shadow-xl",
                        member.status === 'Present' ? 'bg-emerald-500 animate-pulse' : 'bg-white/10'
                      )} />
                    </div>
                    <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-2xl transition-all">
                       <MoreVertical className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="mt-8 space-y-3">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{member.name}</h2>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1.5 rounded-xl border border-primary/20 uppercase tracking-widest">
                        {member.role}
                      </Badge>
                      <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] italic ml-1">Statut: Actif</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-8 italic">
                  <div className="space-y-4 bg-white/[0.03] p-6 rounded-[1.5rem] border border-white/5 group-hover:bg-primary/5 transition-all duration-700">
                    <div className="flex justify-between items-center text-muted-foreground/40 font-black text-[9px] uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span>Arrivée</span>
                      </div>
                      <span className="text-sm font-black text-white not-italic tracking-tighter">{member.checkIn || '--:--'}</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground/40 font-black text-[9px] uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-primary" />
                        <span>Présence</span>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-[0.2em]",
                        member.status === 'Present' ? 'text-emerald-400' : 'text-muted-foreground/30'
                      )}>{member.status === 'Present' ? 'En service' : 'Absent'}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      className="flex-1 h-14 bg-white/5 border-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all rounded-[1.2rem] shadow-xl group/btn"
                    >
                      <Mail className="h-5 w-5 group-hover/btn:text-primary transition-colors" />
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 h-14 bg-white/5 border-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all rounded-[1.2rem] shadow-xl group/btn"
                    >
                      <Phone className="h-5 w-5 group-hover/btn:text-primary transition-colors" />
                    </Button>
                  </div>

                  <Button 
                    onClick={() => handleStatusChange(member.id, member.name)}
                    className={cn(
                      "w-full font-black h-16 rounded-[1.5rem] transition-all duration-500 flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.2em] shadow-2xl",
                      member.status === 'Present' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/10 hover:bg-red-500 hover:text-white' 
                        : 'bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/40'
                    )}
                  >
                    {member.status === 'Present' ? (
                      <><XCircle className="h-4 w-4" /> ARRÊTER LE SERVICE</>
                    ) : (
                      <><LogIn className="h-4 w-4" /> ACTIVER SERVICE VIP</>
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
