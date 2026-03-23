'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  ShieldCheck, 
  Smartphone, 
  Globe, 
  Database,
  Save,
  Lock,
  MessageSquare,
  Zap,
  Cpu,
  Server,
  Key,
  Flame,
  Activity,
  ShieldAlert,
  Loader2,
  Settings2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function SaaSConfigPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [updatingPassword, setUpdatingPassword] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Le mot de passe doit faire au moins 6 caractères")
      return
    }

    setUpdatingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success("Mot de passe mis à jour ! Vous pouvez maintenant vous connecter manuellement.")
      setNewPassword("")
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour")
    } finally {
      setUpdatingPassword(false)
    }
  }

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
      className="p-6 md:p-10 space-y-10 bg-background text-foreground min-h-screen font-montserrat"
    >
      {/* Configuration Strategic Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
               <Settings2 className="h-4 w-4 text-primary" />
            </div>
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic">Panneau de Contrôle Central</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter italic uppercase leading-none">
            Config <span className="gold-gradient-text">Plateforme</span>
          </h1>
          <p className="text-muted-foreground text-base border-l-2 border-primary pl-4 max-w-xl font-medium">
            Supervision du noyau système <span className="text-foreground italic">Ivoire Bar VIP</span>. Déployez des protocoles de sécurité et gérez les liaisons API globales.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/30 px-6 py-4 rounded-3xl border border-border shadow-sm group">
           <div className="flex flex-col items-end">
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1 opacity-60 italic">Status Noyau</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-foreground italic tracking-tighter">SYNCHRONISÉ</span>
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(197,160,89,0.5)]" />
              </div>
           </div>
        </div>
      </motion.div>

      <Tabs defaultValue="plans" className="space-y-8">
        <motion.div variants={itemVariants}>
          <TabsList className="bg-muted/30 border border-border p-1.5 h-auto flex-wrap justify-start rounded-2xl">
            <TabsTrigger value="plans" className="px-10 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black italic uppercase text-[10px] tracking-widest transition-all">Forfaits</TabsTrigger>
            <TabsTrigger value="gateway" className="px-10 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black italic uppercase text-[10px] tracking-widest transition-all">Passerelle</TabsTrigger>
            <TabsTrigger value="security" className="px-10 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black italic uppercase text-[10px] tracking-widest transition-all">Sécurité</TabsTrigger>
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          <TabsContent value="plans" className="space-y-6 focus-visible:outline-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                <CardHeader className="p-8 border-b border-border bg-muted/20">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm group-hover:scale-110 transition-transform">
                       <Zap className="h-7 w-7" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black uppercase italic gold-gradient-text leading-none mb-1">Matrice <span className="text-foreground">Tarifaire</span></CardTitle>
                      <CardDescription className="text-xs font-semibold italic mt-1">Définition des flux de revenus par abonnement.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-12">
                   <div className="grid gap-12 md:grid-cols-2">
                     <div className="space-y-4">
                       <div className="flex items-center justify-between px-2">
                         <Label className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.2em] italic">Forfait Business (Mensuel)</Label>
                         <Badge variant="outline" className="border-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-3 bg-primary/5">Recommandé</Badge>
                       </div>
                       <div className="flex gap-3 relative group">
                         <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                               <span className="text-primary/40 text-sm font-black italic">#</span>
                            </div>
                            <Input defaultValue="15000" className="bg-muted/40 border-border text-foreground h-16 text-2xl font-black tracking-tighter rounded-2xl focus:border-primary/40 transition-all pl-12 group-hover:border-primary/20" />
                         </div>
                         <div className="flex items-center px-8 bg-muted border border-border rounded-2xl text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] italic min-w-[140px] justify-center">XOF / MOIS</div>
                       </div>
                     </div>
                     
                     <div className="space-y-4">
                       <div className="flex items-center justify-between px-2">
                         <Label className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.2em] italic">Forfait Elite (Annuel)</Label>
                         <Badge variant="outline" className="border-border text-muted-foreground text-[8px] font-black uppercase tracking-widest px-3 opacity-40">Tactique</Badge>
                       </div>
                       <div className="flex gap-3 relative group">
                         <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                               <span className="text-primary/40 text-sm font-black italic">#</span>
                            </div>
                            <Input defaultValue="150000" className="bg-muted/40 border-border text-foreground h-16 text-2xl font-black tracking-tighter rounded-2xl focus:border-primary/40 transition-all pl-12 group-hover:border-primary/20" />
                         </div>
                         <div className="flex items-center px-8 bg-muted border border-border rounded-2xl text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] italic min-w-[140px] justify-center">XOF / AN</div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex justify-end pt-4">
                     <Button className="bg-primary text-white h-16 px-12 rounded-2xl shadow-xl shadow-primary/20 font-black text-[11px] uppercase tracking-[0.3em] italic hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-4">
                       <Save className="h-5 w-5" /> Sauvegarder la Matrice
                     </Button>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="gateway" className="space-y-6 focus-visible:outline-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                <CardHeader className="p-8 border-b border-border bg-muted/20">
                   <div className="flex items-center gap-8">
                     <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-sm transition-transform hover:rotate-12">
                       <Smartphone className="h-8 w-8" />
                     </div>
                     <div>
                        <CardTitle className="text-2xl font-black uppercase italic gold-gradient-text leading-none mb-1">Liaison <span className="text-foreground">Paiement</span></CardTitle>
                        <CardDescription className="text-xs font-semibold italic mt-1">Intégration Mobile Money Haute Disponibilité.</CardDescription>
                     </div>
                   </div>
                </CardHeader>
                <CardContent className="p-10 space-y-12">
                   <div className="grid gap-8">
                     <div className="space-y-4">
                       <div className="flex items-center justify-between px-2">
                          <Label className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.2em] italic ml-1">Clé API Production (Chiffrée)</Label>
                          <div className="flex items-center gap-2 text-emerald-600/60 font-black text-[8px] uppercase tracking-widest">
                             <Lock className="h-3 w-3" /> Chiffrement AES-256 Actif
                          </div>
                       </div>
                       <div className="relative group">
                         <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                           <Key className="h-5 w-5 text-muted-foreground/30" />
                         </div>
                         <Input type="password" value="sk_production_••••••••••••••••••••••••••••" className="bg-muted border-border text-foreground h-16 font-mono text-sm tracking-widest rounded-2xl focus:border-primary/20 transition-all pl-16" readOnly />
                         <div className="absolute top-1/2 right-6 -translate-y-1/2">
                            <Button variant="ghost" size="sm" className="h-8 text-[8px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-lg">RÉVÉLER</Button>
                         </div>
                       </div>
                     </div>
                     
                     <div className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[2rem] bg-muted/20 border border-border group hover:border-primary/20 transition-all gap-8 shadow-sm">
                       <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-sm">
                               <Server className="h-7 w-7" />
                            </div>
                            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-foreground italic uppercase tracking-tighter mb-1 leading-none">Status de la Liaison</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] opacity-60">Multiplexeur Cloud opérationnel</p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] px-6 py-2 rounded-full shadow-lg shadow-emerald-500/20 tracking-widest">FULL CONNECTED</Badge>
                          <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest italic">Latence: 24ms</span>
                       </div>
                     </div>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6 focus-visible:outline-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-card border-border border-t-red-500/30 rounded-[2.5rem] overflow-hidden shadow-sm">
                <CardHeader className="p-8 border-b border-border bg-red-500/[0.02]">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-md animate-pulse">
                      <ShieldAlert className="h-8 w-8" />
                    </div>
                    <div>
                       <CardTitle className="text-2xl font-black uppercase italic text-red-600 leading-none mb-1">Le <span className="text-foreground">Coffre-fort</span></CardTitle>
                       <CardDescription className="text-xs font-semibold italic mt-1">Protocoles d'urgence et sécurité périmétrique.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                   <div className="flex flex-col md:flex-row md:items-center justify-between p-10 rounded-[2.5rem] bg-red-500/[0.03] border border-red-500/10 group hover:bg-red-500/[0.05] transition-all gap-8">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform shadow-sm">
                           <Flame className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-black text-foreground italic uppercase tracking-tighter leading-none mb-1">Maintenance Forcée Critique</p>
                          <p className="text-[11px] text-muted-foreground font-medium leading-relaxed max-w-md">Interrompre instantanément l'accès orbital à toutes les unités <span className="text-red-500 font-bold italic">Ivoire Bar VIP</span>. Utilisez uniquement en cas de compromission majeure.</p>
                        </div>
                      </div>
                      <Button variant="destructive" className="h-16 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] italic shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all">
                         DÉTONER PROTOCOLE
                      </Button>
                   </div>
                   
                   <div className="flex flex-col md:flex-row md:items-center justify-between p-10 rounded-[2.5rem] bg-muted/20 border border-border group hover:border-primary/20 transition-all gap-8">
                     <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:rotate-12 transition-transform shadow-sm">
                           <Lock className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-black text-foreground italic uppercase tracking-tighter leading-none mb-1">Accès Manuel (Mode Expert)</p>
                          <p className="text-[11px] text-muted-foreground font-medium leading-relaxed max-w-md">Définissez un mot de passe pour vous connecter directement via Email/Password sans passer par Google Auth.</p>
                        </div>
                     </div>
                     <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <Input 
                          type="password" 
                          placeholder="Nouveau mot de passe" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-card border-border text-foreground h-12 rounded-xl focus:border-primary/20 w-full md:w-48 shadow-sm"
                        />
                        <Button 
                          onClick={handleUpdatePassword}
                          disabled={updatingPassword}
                          className="bg-primary text-white h-12 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary/90 transition-all whitespace-nowrap min-w-[150px] shadow-lg shadow-primary/10"
                        >
                           {updatingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : 'DÉFINIR MOT DE PASSE'}
                         </Button>
                      </div>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  )
}
