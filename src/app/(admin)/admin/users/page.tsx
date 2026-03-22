'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Search, Mail, ShieldCheck, MoreVertical, UserPlus, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

const MOCK_ADMIN_USERS = [
  { id: 'u1', name: 'Administrateur Principal', email: 'admin@ivoirebar.vip', role: 'Super Admin', status: 'Actif', lastLogin: 'Il y a 2h' },
  { id: 'u2', name: 'Support Technique', email: 'support@ivoirebar.vip', role: 'Support', status: 'Actif', lastLogin: 'Hier' },
  { id: 'u3', name: 'Agent Commercial', email: 'sales@ivoirebar.vip', role: 'Sales', status: 'Inactif', lastLogin: '5 jours' },
]

export default function SaaSUsersPage() {
  return (
    <div className="p-6 space-y-8 bg-[#0F0F1A] text-[#F4E4BC] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Équipe <span className="text-[#D4AF37]">SaaS</span></h1>
          <p className="text-[#A0A0B8]">Gérez les accès internes à la plateforme de régie.</p>
        </div>
        <Button className="bg-[#D4AF37] text-[#1A1A2E] font-bold">
          <UserPlus className="h-4 w-4 mr-2" /> Nouvel Utilisateur
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Super Admins', count: 1, icon: ShieldCheck },
          { label: 'Support', count: 1, icon: Mail },
          { label: 'Total Staff', count: 3, icon: Users },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#1A1A2E] border-[#3A3A5A]">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#A0A0B8] uppercase">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.count}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[#1A1A2E] border-[#3A3A5A]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Utilisateurs Plateforme</CardTitle>
          <div className="flex gap-2">
             <Input placeholder="Filtrer..." className="w-64 bg-[#0F0F1A] border-[#3A3A5A] text-white" />
             <Button variant="outline" className="border-[#3A3A5A] text-[#A0A0B8]"><Filter className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="border-b border-[#3A3A5A]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[#A0A0B8]">Utilisateur</TableHead>
                <TableHead className="text-[#A0A0B8]">Rôle</TableHead>
                <TableHead className="text-[#A0A0B8]">Dernière Connexion</TableHead>
                <TableHead className="text-[#A0A0B8]">Statut</TableHead>
                <TableHead className="text-right text-[#A0A0B8]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ADMIN_USERS.map((user) => (
                <TableRow key={user.id} className="border-b-[#3A3A5A] hover:bg-white/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                         {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-xs text-[#A0A0B8]">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-[#D4AF37]/20 text-[#D4AF37]">{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-[#A0A0B8]">{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge className={user.status === 'Actif' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-400'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-[#A0A0B8]"><MoreVertical className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
