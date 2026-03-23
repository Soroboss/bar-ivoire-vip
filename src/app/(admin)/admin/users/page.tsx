'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Search, Mail, ShieldCheck, MoreVertical, UserPlus, Filter, Loader2, Star, Zap, ShieldAlert, LayoutDashboard, Fingerprint } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { supabaseService } from "@/services/supabaseService"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { supabase } from "@/lib/supabase"
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

  const togglePermission = async (userId: string, currentPermissions: any, permissionKey: string) => {
    const defaultPerms = {
      "dashboard": true,
      "inventory": true,
      "revenue": true,
      "staff": true,
      "settings": true,
      "establishments": true
    }
    const perms = currentPermissions || defaultPerms
    const newPermissions = {
      ...perms,
      [permissionKey]: !perms[permissionKey]
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ permissions: newPermissions })
        .eq('id', userId)
      
      if (error) throw error
      toast.success('Permission synchronisée')
      fetchAdmins()
    } catch (e) {
      toast.error('Erreur de synchronisation Cloud')
    }
  }

  const filteredAdmins = admins.filter(admin => 
    admin.email?.toLowerCase().includes(search.toLowerCase()) ||
    admin.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const AVATAR_GRADIENTS = [
    'from-primary/20 via-primary/10 to-transparent',
    'from-blue-500/20 via-blue-500/10 to-transparent',
    'from-emerald-500/20 via-emerald-500/10 to-transparent',
    'from-violet-500/20 via-violet-500/10 to-transparent',
    'from-orange-500/20 via-orange-500/10 to-transparent'
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

  if (!isMounted) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center text-foreground font-montserrat">
      <div className="space-y-6 animate-pulse">
        <div className="h-20 w-20 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto shadow-sm">
           <Fingerprint className="h-10 w-10 text-primary" />
        </div>
        <p className="subheading">Analyse des Identités Stratégiques...</p>
      </div>
    </div>
  )

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 pb-20"
    >
      <motion.div 
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
               <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="subheading">Cohorte de Commandement Supérieure</p>
          </div>
          <h1 className="heading-xl">Équipe <span className="gold-gradient-text">Stratégique</span></h1>
          <p className="text-muted-foreground font-semibold italic border-l-2 border-primary pl-4 py-1 leading-relaxed max-w-2xl">
            Gestion granulaire des effectifs à haut privilège. Accordez les accès administratifs via le protocole <span className="text-foreground font-black italic">Supabase Matrix RBAC</span>.
          </p>
        </div>
        
        <form onSubmit={handlePromote} className="relative group lg:min-w-[450px]">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-all z-10" />
          <Input 
            placeholder="Intercepter email pour élévation..." 
            type="email"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            className="bg-white border-none ring-1 ring-border text-foreground h-16 pl-14 pr-32 rounded-2xl font-black italic text-sm focus:ring-primary/40 transition-all shadow-sm" 
          />
          <Button 
            type="submit"
            disabled={isPromoting}
            className="absolute right-2 top-2 bg-primary text-white font-black uppercase italic text-[10px] h-12 px-6 hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            {isPromoting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="h-4 w-4" /> ÉLEVER</>}
          </Button>
        </form>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-8 md:grid-cols-3">
        {[
          { label: 'Super Commandants', count: admins.filter(a => a.role === 'SUPER_ADMIN').length, icon: Star, color: "text-primary", bg: "bg-primary/5", ring: "ring-primary/10" },
          { label: 'Admins de Liaison', count: admins.filter(a => a.role === 'ADMIN').length, icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/5", ring: "ring-blue-500/10" },
          { label: 'Total Effectifs Cloud', count: admins.length, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/5", ring: "ring-emerald-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="premium-card border-none ring-1 ring-border rounded-[2.5rem] overflow-hidden shadow-sm group hover:ring-primary/40 transition-all duration-700">
            <CardContent className="p-10">
              <div className="flex items-center gap-8">
                <div className={cn(
                    "h-16 w-16 rounded-[1.5rem] flex items-center justify-center border transition-all duration-700 group-hover:scale-110 group-hover:bg-white group-hover:shadow-2xl",
                    stat.bg, stat.color, stat.ring
                )}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="subheading text-muted-foreground/60">{stat.label}</p>
                  <div className="flex items-end gap-3">
                     <p className="text-4xl font-black text-foreground italic tracking-tighter leading-none">{stat.count}</p>
                     <div className="h-2 w-2 rounded-full mb-1 bg-emerald-500 animate-pulse shadow-sm" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="premium-card border-none ring-1 ring-border rounded-[3rem] overflow-hidden shadow-sm">
          <CardHeader className="p-10 border-b border-border/50 bg-muted/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h2 className="heading-lg">Registre <span className="gold-gradient-text">Supérieur</span></h2>
                <p className="subheading mt-2">Répertoire crypté des accès et permissions RBAC.</p>
              </div>
              <div className="relative group w-full md:w-96">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30" />
                 <Input 
                  placeholder="Filtrer un membre par identité..." 
                  className="pl-14 bg-white border-none ring-1 ring-border text-foreground h-14 rounded-2xl text-xs font-black italic focus:ring-primary/40 transition-all shadow-sm" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="subheading py-10 pl-12 italic">Membre / Identifiant</TableHead>
                    <TableHead className="subheading py-10 italic">Autorisation</TableHead>
                    <TableHead className="subheading py-10 italic">Matrice Permissions</TableHead>
                    <TableHead className="text-right subheading py-10 pr-12 italic">Actions Control</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      <TableRow className="hover:bg-transparent text-center">
                        <TableCell colSpan={4} className="h-80 py-20">
                           <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                           <p className="subheading opacity-30">Décryptage en cours...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredAdmins.length === 0 ? (
                      <TableRow className="hover:bg-transparent text-center">
                        <TableCell colSpan={4} className="h-80 py-20">
                           <ShieldAlert className="h-16 w-16 text-red-500 opacity-20 mx-auto mb-4" />
                           <p className="subheading opacity-30">Aucun signal détecté sur ce spectre</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredAdmins.map((admin, idx) => (
                      <motion.tr 
                        key={admin.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="border-border hover:bg-primary/[0.01] transition-all group cursor-default"
                      >
                        <TableCell className="pl-12 py-8">
                          <div className="flex items-center gap-6">
                            <div className="relative">
                              <div className={cn(
                                "h-16 w-16 rounded-[1.25rem] bg-gradient-to-br flex items-center justify-center text-primary font-black text-2xl italic border border-primary/10 shadow-lg group-hover:scale-110 transition-transform duration-700",
                                AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]
                              )}>
                                 {admin.email?.[0].toUpperCase() || '?'}
                              </div>
                              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-background bg-emerald-500 shadow-xl" />
                            </div>
                            <div>
                               <p className="text-xl font-black text-foreground group-hover:text-primary transition-colors italic uppercase tracking-tighter leading-none mb-2">{admin.full_name || 'Opérateur Cloud'}</p>
                               <div className="flex items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                                  <Mail className="h-3 w-3" />
                                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">{admin.email}</p>
                               </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-8">
                          <Badge className={cn(
                            "text-[8px] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] border-none shadow-lg transition-all group-hover:scale-110",
                            admin.role === 'SUPER_ADMIN' ? "bg-primary text-white shadow-primary/20" : "bg-blue-500 text-white shadow-blue-500/20"
                          )}>
                            {admin.role === 'SUPER_ADMIN' && <Star className="h-3 w-3 mr-2 fill-white" />}
                            {admin.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-8">
                            <div className="flex flex-wrap gap-3 max-w-[400px]">
                                {Object.keys(admin.permissions || {
                                  "dashboard": true,
                                  "inventory": true,
                                  "revenue": true,
                                  "staff": true,
                                  "settings": true,
                                  "establishments": true
                                }).map((key) => {
                                    const isActive = (admin.permissions || {
                                        "dashboard": true,
                                        "inventory": true,
                                        "revenue": true,
                                        "staff": true,
                                        "settings": true,
                                        "establishments": true
                                      })[key];
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => togglePermission(admin.id, admin.permissions, key)}
                                            className={cn(
                                                "px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest italic transition-all shadow-sm active:scale-95",
                                                isActive 
                                                  ? 'bg-primary/5 text-primary ring-1 ring-primary/20 hover:bg-primary hover:text-white' 
                                                  : 'bg-muted/40 text-muted-foreground/40 ring-1 ring-border hover:bg-muted hover:text-muted-foreground'
                                            )}
                                        >
                                            {key}
                                        </button>
                                    );
                                })}
                            </div>
                        </TableCell>
                        <TableCell className="text-right pr-12 py-8">
                           <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground/20 hover:text-primary hover:bg-primary/5 rounded-2xl border border-transparent hover:border-primary/20 transition-all group-hover:scale-110">
                             <MoreVertical className="h-6 w-6" />
                           </Button>
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
