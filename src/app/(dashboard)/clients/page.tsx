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
  Star
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
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ClientsPage() {
  const { clients, addClient, loading } = useAppContext()
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', phone: '' })

  if (loading) {
    return (
      <div className="p-6 h-screen bg-[#1A1A2E] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
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
    <div className="p-6 space-y-8 bg-[#1A1A2E] text-[#F4E4BC] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#D4AF37]">Clients <span className="text-white">VIP Cloud</span></h1>
          <p className="text-[#A0A0B8]">Fidélité et CRM synchronisés en temps réel.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#D4AF37] text-[#1A1A2E] hover:bg-[#A68226]">
              <UserPlus className="mr-2 h-4 w-4" /> Nouveau Client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#252545] border-[#3A3A5A] text-[#F4E4BC]">
            <DialogHeader>
              <DialogTitle className="text-[#D4AF37]">Enregistrer un client</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="bg-[#1A1A2E] border-[#3A3A5A]" placeholder="Inza Ouattara" required />
              </div>
              <div className="space-y-2">
                <Label>Numéro de téléphone</Label>
                <Input value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="bg-[#1A1A2E] border-[#3A3A5A]" placeholder="0700000000" required />
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit" className="bg-[#D4AF37] text-[#1A1A2E]">Enregistrer sur le Cloud</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
        <Input 
          placeholder="Rechercher par nom ou numéro..." 
          className="pl-10 bg-[#252545] border-[#3A3A5A] text-white"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
           <div className="col-span-full text-center py-20 text-[#A0A0B8]">Aucun client trouvé.</div>
        ) : (
          filtered.map(client => (
            <Card key={client.id} className="bg-[#252545] border-[#3A3A5A] group hover:border-[#D4AF37] transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-[#D4AF37]/20">
                      <AvatarFallback className="bg-[#1A1A2E] text-[#D4AF37]">{client.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-[#D4AF37]">{client.name}</h3>
                      <p className="text-xs text-[#A0A0B8] flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {client.phone}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-[#D4AF37] text-[#1A1A2E]">{client.tier}</Badge>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-[#1A1A2E] border border-[#3A3A5A]/50">
                    <p className="text-[10px] text-[#A0A0B8] uppercase">Points Fidélité</p>
                    <p className="text-lg font-bold text-[#D4AF37]">{client.points}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1A1A2E] border border-[#3A3A5A]/50">
                    <p className="text-[10px] text-[#A0A0B8] uppercase">Visite</p>
                    <p className="text-lg font-bold text-white">Cloud OK</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="ghost" className="flex-1 text-[#A0A0B8] hover:text-[#D4AF37] hover:bg-white/5 border border-transparent hover:border-[#3A3A5A]">
                    <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                  </Button>
                  <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]">
                    <Star className="h-4 w-4" />
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
