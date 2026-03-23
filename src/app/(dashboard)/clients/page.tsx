'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, 
  Phone,
  MessageCircle,
  Star,
  Search,
  Loader2,
  Filter,
  MoreVertical,
  UserCircle,
  ShieldCheck,
  Zap,
  LayoutDashboard
} from "lucide-react"
import { useAppContext } from '@/context/AppContext'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from 'framer-motion'

export default function ClientsPage() {
  const { clients, addClient, loading } = useAppContext()
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', phone: '' })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="space-y-6 animate-pulse">
           <div className="h-20 w-20 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto shadow-sm">
             <UserCircle className="h-10 w-10 text-primary" />
           </div>
           <p className="subheading">Analyse du Registre de Fidélité...</p>
        </div>
      </div>
    )
  }

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  )

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    await addClient(newClient)
    setNewClient({ name: '', phone: '' })
    setIsAddOpen(false)
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
               <UserCircle className="h-4 w-4 text-primary" />
            </div>
            <p className="subheading">Cohorte des Privilégiés</p>
          </div>
          <h1 className="heading-xl">Clients <span className="gold-gradient-text">& VIP</span></h1>
          <p className="text-muted-foreground font-semibold italic border-l-2 border-primary pl-4 py-1 leading-relaxed max-w-2xl">
            Gestion de la fidélité orbitale. Synchronisation des profils et points de privilège via <span className="text-foreground font-black italic">Supabase CRM Mesh</span>.
          </p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white font-black uppercase italic text-[10px] h-12 px-8 hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl flex items-center gap-2 transition-all hover:scale-105">
              <UserPlus className="h-4 w-4" /> Nouveau Profil
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-none ring-1 ring-border rounded-[2.5rem] p-10 max-w-md shadow-2xl">
            <DialogHeader>
              <DialogTitle className="heading-lg">Adhésion <span className="gold-gradient-text">VIP</span></DialogTitle>
              <CardDescription className="font-semibold italic">Enregistrer un nouveau profil dans le registre de fidélité.</CardDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label className="subheading">Nom Complet</Label>
                <Input value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="bg-muted border-none ring-1 ring-border text-foreground h-14 rounded-2xl px-6 focus:ring-primary/40 transition-all font-bold" placeholder="Inza Ouattara" required />
              </div>
              <div className="space-y-2">
                <Label className="subheading">Numéro de Liaison</Label>
                <Input value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="bg-muted border-none ring-1 ring-border text-foreground h-14 rounded-2xl px-6 focus:ring-primary/40 transition-all font-bold" placeholder="0700000000" required />
              </div>
              <DialogFooter className="pt-6">
                <Button type="submit" className="w-full bg-primary text-white font-black uppercase italic h-16 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">VALIDER L'ADMISSION</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-all" />
        <Input 
          placeholder="Intercepter un profil (Nom ou Numéro)..." 
          className="pl-16 bg-white border-none ring-1 ring-border text-foreground h-16 rounded-[2rem] text-sm focus:ring-primary/20 transition-all shadow-sm" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
           <div className="col-span-full h-80 flex flex-col items-center justify-center gap-6 bg-muted/20 border-2 border-dashed border-border rounded-[3rem]">
              <UserCircle className="h-16 w-16 text-muted-foreground opacity-20" />
              <p className="subheading">Aucun profil détecté dans ce secteur</p>
           </div>
        ) : (
          filtered.map((client, idx) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="premium-card border-none ring-1 ring-border rounded-[3rem] overflow-hidden shadow-sm group">
                <CardContent className="p-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-16 w-16 rounded-[1.25rem] border-2 border-background shadow-xl group-hover:scale-110 transition-transform duration-700">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-black uppercase italic">
                          {client.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors italic uppercase tracking-tighter leading-none mb-2">{client.name}</h3>
                        <div className="flex items-center gap-3 opacity-60">
                           <Phone className="h-3 w-3 text-primary" />
                           <p className="text-[10px] font-black uppercase tracking-widest">{client.phone}</p>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] px-3 py-1 font-black uppercase tracking-widest rounded-full shadow-sm">
                      {client.tier}
                    </Badge>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-[1.5rem] bg-primary/[0.03] border border-primary/10 group-hover:bg-primary/10 transition-colors shadow-inner">
                      <p className="subheading text-primary/60 mb-2">Points Privilège</p>
                      <p className="text-3xl font-black text-primary italic tracking-tight">{client.points}</p>
                    </div>
                    <div className="p-6 rounded-[1.5rem] bg-muted/30 border border-border group-hover:border-primary/10 transition-colors shadow-inner">
                      <p className="subheading mb-2">État Signal</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-foreground uppercase tracking-widest italic">Synchronisé</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-4">
                    <Button variant="ghost" className="flex-1 h-14 bg-white border-none ring-1 ring-border text-muted-foreground hover:text-emerald-600 hover:ring-emerald-500/20 hover:bg-emerald-50 transition-all font-black uppercase italic text-[10px] tracking-widest rounded-2xl shadow-sm">
                      <MessageCircle className="h-4 w-4 mr-3" /> WhatsApp
                    </Button>
                    <Button variant="ghost" className="h-14 w-14 p-0 bg-white border-none ring-1 ring-border text-muted-foreground hover:text-primary hover:ring-primary/20 hover:bg-primary/5 transition-all rounded-2xl shadow-sm">
                      <Star className="h-5 w-5 fill-current opacity-10" />
                    </Button>
                  </div>
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
