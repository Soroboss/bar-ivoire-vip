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
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { insforgeService } from "@/services/insforgeService"
import { toast } from "sonner"
import { format } from "date-fns"

export default function StaffPage() {
  const { staff, toggleStaffStatus, loading, addStaff, userRole, establishment } = useAppContext()
  
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showShiftsDialog, setShowShiftsDialog] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [shifts, setShifts] = useState<any[]>([])
  const [loadingShifts, setLoadingShifts] = useState(false)
  const [shiftStaff, setShiftStaff] = useState('')
  const [shiftStart, setShiftStart] = useState('')
  const [shiftEnd, setShiftEnd] = useState('')

  const allowedRoles = (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN')
    ? ['ADMIN', 'MANAGER', 'CASHIER', 'WAITER', 'BARMAN']
    : userRole === 'MANAGER' 
      ? ['CASHIER', 'WAITER', 'BARMAN'] 
      : []

  const handleAddStaff = async () => {
    if (!newName || !newEmail || !newRole) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    setIsSubmitting(true)
    try {
      await addStaff({ full_name: newName, email: newEmail, role: newRole })
      setShowAddDialog(false)
      setNewName('')
      setNewEmail('')
      setNewRole('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadShifts = async () => {
    if (!establishment) return
    setLoadingShifts(true)
    try {
      const data = await insforgeService.getShifts(establishment.id)
      setShifts(data || [])
    } catch (e) {
      toast.error("Erreur planning")
    } finally {
      setLoadingShifts(false)
    }
  }

  const handleAddShift = async () => {
    if (!shiftStaff || !shiftStart || !shiftEnd || !establishment) return
    setIsSubmitting(true)
    try {
      const profile = staff.find((s: any) => s.id === shiftStaff)
      await insforgeService.addShift({
        establishment_id: establishment.id,
        profile_id: shiftStaff,
        start_time: shiftStart,
        end_time: shiftEnd,
        role: profile?.role || 'STAFF'
      })
      toast.success("Shift ajouté au planning")
      setShiftStaff('')
      setShiftStart('')
      setShiftEnd('')
      loadShifts()
    } catch (e) {
      toast.error("Erreur création shift")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (showShiftsDialog) loadShifts()
  }, [showShiftsDialog])

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
          {allowedRoles.length > 0 && (
            <Dialog open={showShiftsDialog} onOpenChange={setShowShiftsDialog}>
              <DialogTrigger>
                <Button variant="outline" className="h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 font-black px-6 rounded-xl transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-white/5">
                  <Clock className="mr-2 h-4 w-4 text-primary" /> Planning
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card/95 backdrop-blur-3xl border-white/10 rounded-[2.5rem] p-0 overflow-hidden max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
                <div className="p-8 border-b border-white/5 shrink-0 flex items-center gap-4">
                   <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                     <Clock className="h-6 w-6 text-primary" />
                   </div>
                   <div>
                     <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">Planning Équipe</DialogTitle>
                     <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Gérez les horaires (Shifts) de votre personnel.</CardDescription>
                   </div>
                </div>
                <div className="p-8 overflow-y-auto space-y-8">
                   <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
                     <h3 className="text-sm font-black uppercase text-white tracking-widest">Nouveau Shift</h3>
                     <div className="grid grid-cols-2 gap-4">
                       <Select value={shiftStaff} onValueChange={(val) => setShiftStaff(val || '')}>
                         <SelectTrigger className="bg-card/50 border-white/10 h-12 rounded-xl text-white font-bold">
                           <SelectValue placeholder="Choisir un membre" />
                         </SelectTrigger>
                         <SelectContent className="bg-card/90 backdrop-blur-xl border-white/10 text-white">
                           {staff.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name} ({s.role})</SelectItem>)}
                         </SelectContent>
                       </Select>
                       <Input type="datetime-local" value={shiftStart} onChange={e => setShiftStart(e.target.value)} className="bg-card/50 border-white/10 h-12 rounded-xl text-white font-bold text-xs [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                       <Input type="datetime-local" value={shiftEnd} onChange={e => setShiftEnd(e.target.value)} className="bg-card/50 border-white/10 h-12 rounded-xl text-white font-bold text-xs [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                       <Button disabled={isSubmitting} onClick={handleAddShift} className="bg-primary text-black font-black uppercase h-12 rounded-xl">Assigner</Button>
                     </div>
                   </div>

                   <div className="space-y-4">
                     <h3 className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.2em] ml-2">Shifts Récents</h3>
                     {loadingShifts ? <div className="py-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div> : shifts.map((s: any) => (
                       <div key={s.id} className="flex justify-between items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                         <div>
                           <p className="font-bold text-white text-sm">{s.profiles?.full_name}</p>
                           <p className="text-xs text-muted-foreground capitalize mt-1 text-[10px] font-black tracking-widest">{s.role}</p>
                         </div>
                         <div className="text-right">
                           <Badge className="bg-white/5 text-white/60 mb-1 border-white/10">{format(new Date(s.start_time), 'HH:mm')} - {format(new Date(s.end_time), 'HH:mm')}</Badge>
                           <p className="text-[9px] text-muted-foreground/40">{format(new Date(s.start_time), 'dd MMM yyyy')}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {allowedRoles.length > 0 && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger>
                <Button className="bg-primary text-primary-foreground font-black h-12 px-8 hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl flex items-center gap-2 transition-all uppercase text-[10px] tracking-widest">
                  <UserPlus className="h-4 w-4" /> Nouveau Membre
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card/95 backdrop-blur-3xl border-white/10 rounded-[2.5rem] p-8 max-w-md shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">Accréditation Staff</DialogTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Délivrez un accès officiel à un nouveau collaborateur.</CardDescription>
                </DialogHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Nom Complet</Label>
                     <Input placeholder="Jean Dupont" value={newName} onChange={e => setNewName(e.target.value)} className="bg-white/5 border-white/5 h-14 rounded-xl px-4 text-white font-bold focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Email (Identifiant POS)</Label>
                     <Input type="email" placeholder="jean.d@ivoire.bar" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="bg-white/5 border-white/5 h-14 rounded-xl px-4 text-white font-bold focus:ring-primary/20 transition-all" />
                     <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-2 ml-1">Un mot de passe aléatoire lui sera affecté.</p>
                  </div>
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Rôle / Accréditation</Label>
                     <Select value={newRole} onValueChange={(val) => setNewRole(val || '')}>
                        <SelectTrigger className="bg-white/5 border-white/5 h-14 rounded-xl px-4 text-white font-black uppercase tracking-widest">
                          <SelectValue placeholder="Sélectionnez un rôle" />
                        </SelectTrigger>
                        <SelectContent className="bg-card/90 backdrop-blur-xl border-white/10 text-white rounded-2xl">
                          {allowedRoles.map(role => (
                            <SelectItem key={role} value={role} className="font-black text-[10px] uppercase tracking-widest py-3 focus:bg-primary/20">{role}</SelectItem>
                          ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <DialogFooter className="pt-4 mt-8 border-t border-white/5">
                    <Button disabled={isSubmitting} onClick={handleAddStaff} className="w-full bg-primary text-primary-foreground font-black h-14 rounded-xl shadow-xl shadow-primary/20 uppercase tracking-tighter text-sm">
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <><ShieldCheck className="h-5 w-5 mr-2" /> DÉLIVRER L'ACCÈS</>}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          )}
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
                        <AvatarFallback className="bg-primary text-primary-foreground font-black text-3xl uppercase">
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
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{member.name}</h2>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1.5 rounded-xl border border-primary/20 uppercase tracking-widest">
                        {member.role}
                      </Badge>
                      <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] ml-1">Statut: Actif</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-8">
                  <div className="space-y-4 bg-white/[0.03] p-6 rounded-[1.5rem] border border-white/5 group-hover:bg-primary/5 transition-all duration-700">
                    <div className="flex justify-between items-center text-muted-foreground/40 font-black text-[9px] uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span>Arrivée</span>
                      </div>
                      <span className="text-sm font-black text-white not- tracking-tighter">{member.checkIn || '--:--'}</span>
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
