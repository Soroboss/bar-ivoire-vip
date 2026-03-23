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
  UserPlus
} from "lucide-react"
import { useAppContext } from '@/context/AppContext'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from 'framer-motion'

export default function StaffPage() {
  const { staff, toggleStaffStatus, loading } = useAppContext()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center text-foreground font-montserrat">
        <div className="space-y-6 animate-pulse">
          <div className="relative">
             <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
               <Users className="h-8 w-8 text-primary" />
             </div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2">
               <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
             </div>
          </div>
          <p className="text-primary text-xs font-black uppercase tracking-[0.3em] italic">Mobilisation de l'Équipe...</p>
        </div>
      </div>
    )
  }

  const handleStatusChange = async (id: string, name: string) => {
    await toggleStaffStatus(id)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 space-y-10 bg-background text-foreground min-h-screen font-montserrat"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
               <Users className="h-4 w-4 text-primary" />
            </div>
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic">Cohorte Opérationnelle</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter italic uppercase leading-none">
            Équipe <span className="gold-gradient-text">& Staff</span>
          </h1>
          <p className="text-muted-foreground text-base border-l-2 border-primary pl-4 max-w-xl font-medium">
            Supervision des effectifs tactiques. Suivi des présences et déploiement des rôles synchronisé via <span className="text-foreground italic">Supabase Realtime</span>.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 border-border text-foreground hover:bg-muted font-bold px-6 rounded-xl transition-all">
            <Clock className="mr-2 h-4 w-4" /> Planning Cloud
          </Button>
          <Button className="bg-primary text-white font-black uppercase italic text-[10px] h-12 px-6 hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl flex items-center gap-2 transition-all hover:scale-105">
            <UserPlus className="h-4 w-4" /> Nouveau Membre
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {staff.length === 0 ? (
           <div className="col-span-full h-80 flex flex-col items-center justify-center gap-4 bg-muted/20 border-2 border-dashed border-border rounded-[2.5rem]">
              <Users className="h-12 w-12 text-muted-foreground opacity-20" />
              <p className="text-sm font-black uppercase text-muted-foreground tracking-widest italic">Aucun membre détecté sous ce protocole</p>
           </div>
        ) : (
          staff.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-primary/40 transition-all duration-500 rounded-[2.5rem] overflow-hidden shadow-sm group">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <Avatar className="h-20 w-20 rounded-2xl border-4 border-background shadow-xl group-hover:scale-110 transition-transform duration-500">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-black text-2xl uppercase">
                          {member.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-background shadow-sm ${
                        member.status === 'Present' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                      }`} />
                    </div>
                    <Button variant="ghost" size="icon" className="h-11 w-11 text-muted-foreground/30 hover:text-primary hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/20 transition-all">
                       <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mt-6 space-y-1">
                    <CardTitle className="text-2xl font-black text-foreground italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">{member.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] px-3 py-1 font-black uppercase tracking-widest rounded-full">
                        {member.role}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-semibold italic">Identifiant Opérationnel</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-8">
                  <div className="space-y-3 bg-muted/30 p-4 rounded-2xl border border-border">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-bold uppercase tracking-tighter">Dernière Liaison</span>
                      </div>
                      <span className="text-foreground font-black italic">{member.checkIn || '--:--'}</span>
                    </div>
                    <div className="h-px bg-border/50" />
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Shield className="h-3.5 w-3.5" />
                        <span className="font-bold uppercase tracking-tighter">État du Signal</span>
                      </div>
                      <span className="text-emerald-500 font-black italic uppercase tracking-widest">Actif</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="flex-1 h-12 bg-card border-border text-foreground hover:bg-muted font-bold rounded-xl transition-all"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 h-12 bg-card border-border text-foreground hover:bg-muted font-bold rounded-xl transition-all"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button 
                    onClick={() => handleStatusChange(member.id, member.name)}
                    className={`w-full font-black uppercase italic text-[10px] h-14 rounded-2xl transition-all shadow-lg ${
                      member.status === 'Present' 
                        ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-200' 
                        : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-200'
                    }`}
                  >
                    {member.status === 'Present' ? (
                      <><XCircle className="mr-2 h-4 w-4" /> SUSPENDRE LA RÉCEPTION</>
                    ) : (
                      <><LogIn className="mr-2 h-4 w-4" /> ACTIVER LA LIAISON</>
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
