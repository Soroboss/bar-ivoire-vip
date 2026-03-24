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
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
             <UserCircle className="h-8 w-8 text-blue-600" />
           </div>
           <p className="text-sm font-medium text-slate-500">Chargement de la clientèle...</p>
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
            <div className="h-2 w-8 bg-blue-600 rounded-full" />
            <p className="subheading text-blue-600">Relation Client</p>
          </div>
          <h1 className="heading-xl">Fidélité & Clients</h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
            Gérez votre base de clients, suivez leurs points de fidélité et communiquez avec eux pour booster votre récurrence.
          </p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger>
            <Button className="bg-blue-600 text-white font-bold h-12 px-8 hover:bg-blue-700 shadow-lg shadow-blue-100 rounded-xl flex items-center gap-2 transition-all">
              <UserPlus className="h-4 w-4" /> Nouveau client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-none rounded-2xl p-8 max-w-md shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Nouveau Profil</DialogTitle>
              <CardDescription>Remplissez les informations du client.</CardDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Nom complet</Label>
                <Input value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="bg-slate-50 border-slate-100 h-12 rounded-xl px-4 focus:ring-blue-100 transition-all" placeholder="Ex: Inza Ouattara" required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Téléphone</Label>
                <Input value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="bg-slate-50 border-slate-100 h-12 rounded-xl px-4 focus:ring-blue-100 transition-all" placeholder="0700000000" required />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full bg-blue-600 text-white font-bold h-12 rounded-xl">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input 
          placeholder="Rechercher par nom ou numéro..." 
          className="pl-12 bg-white border-slate-200 h-12 rounded-xl text-sm focus:ring-blue-100 transition-all shadow-sm" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
           <div className="col-span-full h-64 flex flex-col items-center justify-center gap-4 bg-slate-50 border-2 border-dashed border-slate-100 rounded-2xl">
              <UserCircle className="h-12 w-12 text-slate-300" />
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Aucun client trouvé</p>
           </div>
        ) : (
          filtered.map((client, idx) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="premium-card rounded-2xl overflow-hidden group">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 rounded-xl border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-bold uppercase">
                          {client.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-none mb-1">{client.name}</h3>
                        <div className="flex items-center gap-2 text-slate-400">
                           <Phone className="h-3 w-3" />
                           <p className="text-[10px] font-bold">{client.phone}</p>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-full">
                      {client.tier || 'STANDARD'}
                    </Badge>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Points</p>
                      <p className="text-2xl font-bold text-blue-600 leading-none">{client.points}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-900 uppercase">Actif</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Button variant="outline" className="flex-1 h-12 bg-white border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all rounded-xl font-bold text-[10px] uppercase">
                      <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                    </Button>
                    <Button variant="outline" className="h-12 w-12 p-0 bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-xl">
                      <Star className="h-4 w-4" />
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
