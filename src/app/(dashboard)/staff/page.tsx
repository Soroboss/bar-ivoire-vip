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
        <div className="space-y-6 animate-pulse">
           <div className="h-20 w-20 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto shadow-sm">
             <Users className="h-10 w-10 text-primary" />
           </div>
           <p className="subheading">Mobilisation de la Cohorte...</p>
        </div>
      </div>
    )
  }

  const handleStatusChange = async (id: string, name: string) => {
    await toggleStaffStatus(id)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
               <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="subheading">Régiment Opérationnel Actif</p>
          </div>
          <h1 className="heading-xl">Équipe <span className="gold-gradient-text">& Staff</span></h1>
          <p className="text-muted-foreground font-semibold italic border-l-2 border-primary pl-4 py-1 leading-relaxed max-w-2xl">
            Supervision tactique des ressources humaines. Monitoring des présences et synchronisation des privilèges via <span className="text-foreground font-black italic">Supabase Realtime Mesh</span>.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 border-border text-foreground hover:bg-muted font-bold px-6 rounded-2xl transition-all shadow-sm">
            <Clock className="mr-2 h-4 w-4" /> Planning Orbitale
          </Button>
          <Button className="bg-primary text-white font-black uppercase italic text-[10px] h-12 px-8 hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl flex items-center gap-2 transition-all hover:scale-105">
            <UserPlus className="h-4 w-4" /> Nouveau Membre
          </Button>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {staff.length === 0 ? (
           <div className="col-span-full h-80 flex flex-col items-center justify-center gap-6 bg-muted/20 border-2 border-dashed border-border rounded-[3rem]">
              <Users className="h-16 w-16 text-muted-foreground opacity-20" />
              <p className="subheading">Aucune unité détectée dans ce secteur</p>
           </div>
        ) : (
          staff.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="premium-card border-none ring-1 ring-border rounded-[3rem] overflow-hidden shadow-sm group">
                <CardHeader className="p-10 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <Avatar className="h-24 w-24 rounded-[2rem] border-4 border-background shadow-2xl group-hover:scale-110 transition-transform duration-700">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-black text-3xl italic">
                          {member.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-4 border-background shadow-lg",
                        member.status === 'Present' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'
                      )} />
                    </div>
                    <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground/20 hover:text-primary hover:bg-primary/5 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                       <MoreVertical className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="mt-8 space-y-2">
                    <h2 className="text-2xl font-black text-foreground italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">{member.name}</h2>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary text-white text-[8px] px-4 py-1.5 font-black uppercase tracking-[0.2em] rounded-full border-none shadow-lg shadow-primary/10">
                        {member.role}
                      </Badge>
                      <p className="text-[10px] font-black text-muted-foreground uppercase italic tracking-widest opacity-40">Identité Validée</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 pt-4 space-y-10">
                  <div className="space-y-4 bg-muted/30 p-6 rounded-[2rem] border border-border shadow-inner">
                    <div className="flex justify-between items-center px-2">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="h-4 w-4 opacity-30" />
                        <span className="text-[9px] font-black uppercase tracking-widest italic leading-none">Dernière Liaison</span>
                      </div>
                      <span className="text-foreground font-black italic tracking-tight">{member.checkIn || '--:--'}</span>
                    </div>
                    <div className="h-px bg-border/40" />
                    <div className="flex justify-between items-center px-2">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Shield className="h-4 w-4 opacity-30" />
                        <span className="text-[9px] font-black uppercase tracking-widest italic leading-none">État du Signal</span>
                      </div>
                      <span className="text-emerald-500 font-black italic uppercase tracking-widest text-[10px]">Liaison Active</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      className="flex-1 h-14 bg-white border-none ring-1 ring-border text-foreground hover:bg-primary hover:text-white hover:ring-primary transition-all rounded-2xl shadow-sm"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 h-14 bg-white border-none ring-1 ring-border text-foreground hover:bg-primary hover:text-white hover:ring-primary transition-all rounded-2xl shadow-sm"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button 
                    onClick={() => handleStatusChange(member.id, member.name)}
                    className={cn(
                      "w-full font-black uppercase italic text-[10px] h-16 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-xl",
                      member.status === 'Present' 
                        ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white shadow-red-500/10' 
                        : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-emerald-500/10'
                    )}
                  >
                    {member.status === 'Present' ? (
                      <><XCircle className="h-5 w-5" /> SUSPENDRE LA RÉCEPTION</>
                    ) : (
                      <><LogIn className="h-5 w-5" /> ACTIVER LA LIAISON</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
