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
  UserCircle
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center text-foreground font-montserrat">
        <div className="space-y-6 animate-pulse">
          <div className="relative">
             <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
               <UserCircle className="h-8 w-8 text-primary" />
             </div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2">
               <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
             </div>
          </div>
          <p className="text-primary text-xs font-black uppercase tracking-[0.3em] italic">Analyse de la Clientèle...</p>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 space-y-10 bg-background text-foreground min-h-screen font-montserrat"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
               <UserCircle className="h-4 w-4 text-primary" />
            </div>
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic">Registre des Priviligiés</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter italic uppercase leading-none">
            Clients <span className="gold-gradient-text">& VIP</span>
          </h1>
          <p className="text-muted-foreground text-base border-l-2 border-primary pl-4 max-w-xl font-medium">
            Gestion de la fidélité orbitale. Synchronisation des profils et points de privilège via <span className="text-foreground italic">Supabase Cloud CRM</span>.
          </p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white font-black uppercase italic text-[10px] h-12 px-6 hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl flex items-center gap-2 transition-all hover:scale-105">
              <UserPlus className="h-4 w-4" /> Nouveau Client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border rounded-3xl p-8 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase italic gold-gradient-text">Enregistrement <span className="text-foreground">VIP</span></DialogTitle>
              <CardDescription className="font-semibold italic">Déployer un nouveau profil dans le registre de fidélité.</CardDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nom Complet</Label>
                <Input value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="bg-muted border-border text-foreground h-12 rounded-xl" placeholder="Inza Ouattara" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Numéro de Téléphone</Label>
                <Input value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="bg-muted border-border text-foreground h-12 rounded-xl" placeholder="0700000000" required />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full bg-primary text-white font-black uppercase italic h-14 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Enregistrer sur le Cloud</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Intercepter un profil (Nom ou Numéro)..." 
          className="pl-12 bg-card border-border text-foreground h-14 rounded-2xl text-sm focus:border-primary/30 transition-all shadow-sm" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
           <div className="col-span-full h-80 flex flex-col items-center justify-center gap-4 bg-muted/20 border-2 border-dashed border-border rounded-[2.5rem]">
              <UserCircle className="h-12 w-12 text-muted-foreground opacity-20" />
              <p className="text-sm font-black uppercase text-muted-foreground tracking-widest italic">Aucun profil détecté sous ce protocole</p>
           </div>
        ) : (
          filtered.map((client, idx) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-primary/40 transition-all duration-500 rounded-[2.5rem] overflow-hidden shadow-sm group">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 rounded-2xl border-2 border-background shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-black uppercase">
                          {client.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors italic uppercase tracking-tighter leading-none mb-1">{client.name}</h3>
                        <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {client.phone}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] px-3 py-1 font-black uppercase tracking-widest rounded-full">
                      {client.tier}
                    </Badge>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border group-hover:border-primary/20 transition-colors">
                      <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Points Privilège</p>
                      <p className="text-2xl font-black text-primary italic tracking-tight">{client.points}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border group-hover:border-primary/20 transition-colors">
                      <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">État Cloud</p>
                      <p className="text-sm font-black text-foreground uppercase tracking-widest mt-1">SYCHRONISÉ</p>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-2">
                    <Button variant="ghost" className="flex-1 h-12 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 rounded-xl border border-transparent hover:border-emerald-200 transition-all font-bold">
                      <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                    </Button>
                    <Button variant="ghost" className="h-12 w-12 p-0 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/20 transition-all">
                      <Star className="h-4 w-4 fill-current opacity-20" />
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
