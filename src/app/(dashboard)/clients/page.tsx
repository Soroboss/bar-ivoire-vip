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
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
             <UserCircle className="h-8 w-8 text-primary" />
           </div>
           <p className="text-sm font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Initialisation CRM...</p>
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
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <p className="subheading text-primary font-bold">Relation Client</p>
          </div>
          <h1 className="heading-xl">Fidélité & Clients</h1>
          <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">
            Gérez votre base de clients, suivez leurs points de fidélité et communiquez avec eux pour booster votre récurrence.
          </p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger>
            <Button className="bg-primary text-primary-foreground font-black h-12 px-8 hover:bg-primary/90 shadow-lg shadow-primary/10 rounded-xl flex items-center gap-2 transition-all uppercase tracking-tighter">
              <UserPlus className="h-4 w-4" /> Nouveau client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/5 rounded-[2rem] p-8 max-w-md shadow-2xl backdrop-blur-3xl overflow-hidden selection:bg-primary/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">Nouveau Profil</DialogTitle>
              <CardDescription className="text-muted-foreground font-medium">Remplissez les informations du client.</CardDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest ml-1">Nom complet</Label>
                <Input value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="bg-white/5 border-white/5 h-12 rounded-xl px-4 text-white font-bold placeholder:text-muted-foreground/30 focus:ring-primary/20 transition-all" placeholder="Ex: Inza Ouattara" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest ml-1">Téléphone</Label>
                <Input value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="bg-white/5 border-white/5 h-12 rounded-xl px-4 text-white font-black placeholder:text-muted-foreground/30 focus:ring-primary/20 transition-all" placeholder="0700000000" required />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full bg-primary text-primary-foreground font-black h-14 rounded-xl shadow-xl shadow-primary/20 uppercase tracking-tighter">Créer la fiche VIP</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-xl group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity rounded-full" />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Rechercher par nom ou numéro..." 
          className="relative pl-12 bg-white/5 border-white/10 h-12 rounded-xl text-sm font-bold text-white focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
           <div className="col-span-full h-80 flex flex-col items-center justify-center gap-6 bg-white/[0.02] border border-white/5 rounded-[2rem] text-center border-dashed">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center">
                <UserCircle className="h-10 w-10 text-muted-foreground/20" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 leading-loose mx-10">La salle est vide — Invitez vos clients VIP</p>
           </div>
        ) : (
          filtered.map((client, idx) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="premium-card rounded-[2rem] overflow-hidden group border-white/5 bg-card/50 backdrop-blur-3xl shadow-2xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 rounded-2xl border-2 border-white/5 shadow-2xl ring-4 ring-primary/5">
                        <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl uppercase">
                          {client.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors leading-none mb-2 uppercase tracking-tighter">{client.name}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground/60">
                           <Phone className="h-3 w-3 text-primary/50" />
                           <p className="text-[10px] font-black tracking-widest">{client.phone}</p>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border border-primary/20 text-[9px] px-3 py-1 font-black uppercase tracking-widest rounded-xl">
                      {client.tier || 'STANDARD'}
                    </Badge>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
                      <p className="text-[9px] font-black text-muted-foreground/40 uppercase mb-2 tracking-widest">Points Fidélité</p>
                      <p className="text-3xl font-black text-primary tracking-tighter">{client.points}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[9px] font-black text-muted-foreground/40 uppercase mb-2 tracking-widest">Espace</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Actif VIP</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Button variant="outline" className="flex-1 h-14 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/10">
                      <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp VIP
                    </Button>
                    <Button variant="outline" className="h-14 w-14 p-0 bg-white/5 border-white/5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all rounded-2xl">
                      <Star className="h-5 w-5" />
                    </Button>
                  </div>
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
