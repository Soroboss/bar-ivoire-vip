'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Search, Mail, ShieldCheck, MoreVertical, UserPlus, Filter, Loader2, Star, Zap, ShieldAlert } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { supabaseService } from "@/services/supabaseService"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { motion, AnimatePresence, Variants } from "framer-motion"

export default function SaaSUsersPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [promoteEmail, setPromoteEmail] = useState('')
  const [isPromoting, setIsPromoting] = useState(false)
  const [search, setSearch] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const data = await supabaseService.getAdminUsers()
      setAdmins(data)
    } catch (e) {
      toast.error("Échec de liaison avec le registre des membres")
    } finally {
      setLoading(false)
    }
  }

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoteEmail) return
    
    setIsPromoting(true)
    try {
      await supabaseService.promoteUserToAdmin(promoteEmail)
      toast.success(`${promoteEmail} a été élevé au rang stratégique`)
      setPromoteEmail('')
      fetchAdmins()
    } catch (e: any) {
      toast.error(e.message || "Erreur d'élévation de rang")
    } finally {
      setIsPromoting(false)
    }
  }

  const filteredAdmins = admins.filter(admin => 
    admin.email?.toLowerCase().includes(search.toLowerCase()) ||
    admin.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const AVATAR_GRADIENTS = [
    'from-[#D4AF37] via-[#B6962E] to-[#8C6F1F]',
    'from-[#3B82F6] via-[#2563EB] to-[#1D4ED8]',
    'from-[#10B981] via-[#059669] to-[#047857]',
    'from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9]',
    'from-[#F59E0B] via-[#D97706] to-[#B45309]'
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (!isMounted) return null

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 md:p-10 space-y-10 bg-[#05050A] text-[#F4E4BC] min-h-screen selection:bg-[#D4AF37]/30"
    >
      {/* Strategic Team Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
               <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
            </div>
            <span className="text-[#A0A0B8] text-[10px] font-black uppercase tracking-widest italic">Cohorte de Commandement</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase leading-none">
            Équipe <span className="gold-gradient-text">Stratégique</span>
          </h1>
          <p className="text-[#A0A0B8] text-base border-l-2 border-[#D4AF37] pl-4 max-w-xl">
            Gestion des effectifs à haut privilège. Accordez les accès administratifs aux membres de confiance de l'unité <span className="text-white italic">SaaS Ivoire Bar VIP</span>.
          </p>
        </div>
        
        <form onSubmit={handlePromote} className="flex gap-2 bg-black/40 p-2 rounded-2xl border border-white/5 backdrop-blur-3xl lg:min-w-[400px] group transition-all hover:border-[#D4AF37]/30">
          <Input 
            placeholder="Intercepter email pour élévation..." 
            type="email"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            className="bg-black/50 border-none text-white focus:ring-0 h-12 rounded-xl text-sm placeholder:text-[#3A3A5A]" 
          />
          <Button 
            type="submit"
            disabled={isPromoting}
            className="bg-[#D4AF37] text-black font-black uppercase italic text-[10px] h-12 px-6 hover:bg-[#B6962E] shadow-lg shadow-[#D4AF37]/10 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            {isPromoting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="h-4 w-4" /> ELEVER</>}
          </Button>
        </form>
      </motion.div>

      {/* KPI Access Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Super Commandants', count: admins.filter(a => a.role === 'SUPER_ADMIN').length, icon: Star, color: "#D4AF37", bg: "from-[#D4AF37]/10" },
          { label: 'Admins de Liaison', count: admins.filter(a => a.role === 'ADMIN').length, icon: Mail, color: "#3B82F6", bg: "from-[#3B82F6]/10" },
          { label: 'Total Effectifs', count: admins.length, icon: Users, color: "#4CAF50", bg: "from-[#4CAF50]/10" },
        ].map((stat, i) => (
          <Card key={i} className="glass-card border-white/5 group hover:border-[#D4AF37]/40 transition-all duration-500 rounded-[2rem] overflow-hidden">
            <div className={`absolute -bottom-10 -right-10 h-32 w-32 bg-gradient-to-br ${stat.bg} to-transparent opacity-5 group-hover:opacity-10 transition-all duration-700`} />
            <CardContent className="flex items-center gap-6 pt-8 pb-8">
              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500" style={{ color: stat.color }}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] text-[#A0A0B8] uppercase font-black tracking-[0.2em] mb-1">{stat.label}</p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-white tracking-tighter">{stat.count}</p>
                  <div className="h-2 w-2 rounded-full mb-3 bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Team Member Terminal */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-white/5 rounded-[2.5rem] overflow-hidden scanline">
          <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <CardTitle className="text-white text-2xl font-black uppercase italic">Protocole <span className="gold-gradient-text">Actif</span></CardTitle>
                <CardDescription className="text-[#A0A0B8] text-sm font-medium">Répertoire crypté des accès administratifs orbitaux.</CardDescription>
              </div>
              <div className="relative group w-full md:w-80">
                 <div className="absolute inset-0 bg-[#D4AF37]/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/40" />
                 <Input 
                  placeholder="Filtrer un membre..." 
                  className="pl-10 bg-black/40 border-white/5 text-white h-11 rounded-xl text-xs focus:border-[#D4AF37]/30 transition-all" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="text-[#D4AF37] uppercase text-[9px] font-black tracking-[0.2em] py-8 pl-10">Membre / Identifiant</TableHead>
                    <TableHead className="text-[#D4AF37] uppercase text-[9px] font-black tracking-[0.2em] py-8">Autorisation</TableHead>
                    <TableHead className="text-[#D4AF37] uppercase text-[9px] font-black tracking-[0.2em] py-8">Date d'Enrôlement</TableHead>
                    <TableHead className="text-right text-[#D4AF37] uppercase text-[9px] font-black tracking-[0.2em] py-8 pr-10">Liaison de Commandement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={4} className="h-60 text-center py-20">
                          <div className="flex flex-col items-center gap-4 opacity-30">
                            <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" />
                            <p className="text-sm font-black uppercase text-[#A0A0B8] tracking-widest">Décryptage en cours...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredAdmins.length === 0 ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={4} className="h-60 text-center py-20">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                            <ShieldAlert className="h-12 w-12 text-red-400" />
                            <p className="text-sm font-black uppercase text-[#A0A0B8] tracking-widest italic">Aucun membre détecté sous ce protocole</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredAdmins.map((admin, idx) => (
                      <motion.tr 
                        key={admin.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="border-white/5 hover:bg-white/[0.03] transition-all group cursor-default"
                      >
                        <TableCell className="pl-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="relative group/avatar">
                              <motion.div 
                                whileHover={{ scale: 1.1, rotateY: 15, rotateX: -10 }}
                                className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} flex items-center justify-center text-[#05050A] font-black text-xl shadow-xl transition-all duration-300 relative overflow-hidden`}
                              >
                                 <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none" />
                                 {admin.email[0].toUpperCase()}
                              </motion.div>
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#05050A] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            </div>
                            <div className="text-left">
                              <p className="text-lg font-black text-white group-hover:text-[#D4AF37] transition-colors italic uppercase tracking-tighter leading-none mb-1">{admin.full_name || 'MEMBRE OPS'}</p>
                              <p className="text-[10px] text-[#A0A0B8] font-mono opacity-60 group-hover:opacity-100 transition-opacity italic tracking-tight">{admin.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <Badge className={`
                            ${admin.role === 'SUPER_ADMIN' 
                              ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.15)] animate-pulse" 
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"}
                            text-[10px] px-4 py-1 rounded-full font-black uppercase tracking-widest border transition-all group-hover:scale-105
                          `}>
                            {admin.role === 'SUPER_ADMIN' && <Star className="h-3 w-3 mr-1.5 fill-[#D4AF37]" />}
                            {admin.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-6 text-xs text-white font-black italic tracking-tighter opacity-70">
                          {admin.created_at 
                            ? format(new Date(admin.created_at), 'dd MMM yyyy', { locale: fr })
                            : 'Période Inconnue'}
                        </TableCell>
                        <TableCell className="text-right pr-10 py-6">
                          <div className="flex justify-end gap-2">
                             <Button variant="ghost" size="icon" className="h-11 w-11 text-white/20 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 rounded-[1.25rem] transition-all group/btn border border-transparent hover:border-[#D4AF37]/20">
                               <MoreVertical className="h-5 w-5 group-hover/btn:rotate-90 transition-transform" />
                             </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
