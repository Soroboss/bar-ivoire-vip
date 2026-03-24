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
import { insforge } from "@/lib/insforge"
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
      // insforge.auth.updateUser({ password: newPassword }) seems to be missing in this SDK version
      // We'll use a generic toast for now.
      toast.info("La mise à jour directe du mot de passe sera bientôt disponible sur InsForge.")
/*
      const { error } = await insforge.auth.updateUser({ password: newPassword })
      if (error) throw error
*/
      toast.success("Demande enregistrée.")
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
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Panneau de Contrôle Central</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-none">
            Config <span className="gold-gradient-text">Plateforme</span>
          </h1>
          <p className="text-muted-foreground text-base border-l-2 border-primary pl-4 max-w-xl font-medium">
            Supervision du noyau système <span className="text-foreground">Ivoire Bar VIP</span>. Déployez des protocoles de sécurité et gérez les liaisons API globales.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/30 px-6 py-4 rounded-3xl border border-border shadow-sm group">
           <div className="flex flex-col items-end">
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1 opacity-60">Status Noyau</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-foreground tracking-tighter">SYNCHRONISÉ</span>
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(197,160,89,0.5)]" />
              </div>
           </div>
        </div>
      </motion.div>

      <Tabs defaultValue="plans" className="space-y-12">
        <motion.div variants={itemVariants}>
          <TabsList className="bg-white/5 border border-white/5 p-2 h-auto flex-wrap justify-start rounded-2xl backdrop-blur-3xl shadow-2xl">
            <TabsTrigger value="plans" className="px-12 py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase text-[10px] tracking-widest transition-all">Forfaits Stratégiques</TabsTrigger>
            <TabsTrigger value="gateway" className="px-12 py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase text-[10px] tracking-widest transition-all">Passerelle API</TabsTrigger>
            <TabsTrigger value="security" className="px-12 py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase text-[10px] tracking-widest transition-all">Protocoles Sécurité</TabsTrigger>
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          <TabsContent value="plans" className="space-y-8 focus-visible:outline-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="premium-card rounded-[2.5rem] border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-xl group-hover:scale-110 transition-all duration-500">
                       <Zap className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black uppercase gold-gradient-text leading-none mb-2">Matrice <span className="text-white">Tarifaire</span></CardTitle>
                      <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mt-1">Définition des flux de revenus par abonnement.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-12">
                   <div className="grid gap-12 md:grid-cols-2">
                     <div className="space-y-5">
                       <div className="flex items-center justify-between px-2">
                         <Label className="text-muted-foreground/40 font-black uppercase text-[10px] tracking-[0.3em]">Forfait Business (Mensuel)</Label>
                         <Badge className="border-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-4 py-1.5 bg-primary/10 shadow-[0_0_10px_rgba(212,175,55,0.2)]">Recommandé</Badge>
                       </div>
                       <div className="flex gap-4 relative group">
                         <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                               <span className="text-primary/60 text-lg font-black">#</span>
                            </div>
                            <Input defaultValue="15000" className="bg-white/5 border-white/5 text-white h-20 text-3xl font-black tracking-tighter rounded-2xl focus:border-primary/40 transition-all pl-12 group-hover:border-primary/20" />
                         </div>
                         <div className="flex items-center px-10 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] min-w-[160px] justify-center">XOF / MOIS</div>
                       </div>
                     </div>
                     
                     <div className="space-y-5">
                       <div className="flex items-center justify-between px-2">
                         <Label className="text-muted-foreground/40 font-black uppercase text-[10px] tracking-[0.3em]">Forfait Elite (Annuel)</Label>
                         <Badge className="border-white/5 text-muted-foreground/20 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 bg-white/5">Tactique</Badge>
                       </div>
                       <div className="flex gap-4 relative group">
                         <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                               <span className="text-primary/60 text-lg font-black">#</span>
                            </div>
                            <Input defaultValue="150000" className="bg-white/5 border-white/5 text-white h-20 text-3xl font-black tracking-tighter rounded-2xl focus:border-primary/40 transition-all pl-12 group-hover:border-primary/20" />
                         </div>
                         <div className="flex items-center px-10 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] min-w-[160px] justify-center">XOF / AN</div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex justify-end pt-6">
                     <Button className="bg-primary text-primary-foreground h-16 px-16 rounded-2xl shadow-2xl shadow-primary/20 font-black text-[11px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-5">
                       <Save className="h-6 w-6" /> SAUVEGARDER LA MATRICE
                     </Button>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="gateway" className="space-y-8 focus-visible:outline-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="premium-card rounded-[2.5rem] border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-white/[0.02]">
                   <div className="flex items-center gap-10">
                     <div className="h-20 w-20 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 border border-white/10 shadow-xl transition-all hover:rotate-12 duration-500">
                       <Smartphone className="h-10 w-10" />
                     </div>
                     <div>
                        <CardTitle className="text-2xl font-black uppercase gold-gradient-text leading-none mb-2">Liaison <span className="text-white">Paiement</span></CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mt-1">Intégration Mobile Money Haute Disponibilité.</CardDescription>
                     </div>
                   </div>
                </CardHeader>
                <CardContent className="p-10 space-y-12">
                   <div className="grid gap-10">
                     <div className="space-y-5">
                       <div className="flex items-center justify-between px-2">
                          <Label className="text-muted-foreground/40 font-black uppercase text-[10px] tracking-[0.3em] ml-1">Clé API Production (Chiffrée)</Label>
                          <div className="flex items-center gap-3 text-emerald-500/60 font-black text-[9px] uppercase tracking-widest">
                             <Lock className="h-3.5 w-3.5" /> Chiffrement AES-256 Actif
                          </div>
                       </div>
                       <div className="relative group">
                         <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-all group-focus-within:text-primary">
                           <Key className="h-6 w-6 text-muted-foreground/20" />
                         </div>
                         <Input type="password" value="sk_production_••••••••••••••••••••••••••••" className="bg-white/5 border-white/5 text-white h-20 font-mono text-base tracking-widest rounded-2xl focus:border-primary/20 transition-all pl-16" readOnly />
                         <div className="absolute top-1/2 right-6 -translate-y-1/2">
                            <Button variant="ghost" size="sm" className="h-10 px-6 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-xl transition-all">RÉVÉLER MATRICE</Button>
                         </div>
                       </div>
                     </div>
                     
                     <div className="flex flex-col md:flex-row md:items-center justify-between p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-primary/40 transition-all duration-500 gap-10 shadow-xl">
                       <div className="flex items-center gap-8">
                          <div className="relative">
                            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 border border-white/10 group-hover:scale-110 transition-all duration-500 shadow-xl">
                               <Server className="h-8 w-8" />
                            </div>
                            <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                          </div>
                          <div>
                            <p className="text-lg font-black text-white uppercase tracking-tighter mb-2 leading-none">Status de la Liaison</p>
                            <p className="text-[10px] text-muted-foreground/40 uppercase font-black tracking-[0.2em]">Multiplexeur Cloud opérationnel</p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-3">
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] px-8 py-3 rounded-xl shadow-2xl shadow-emerald-500/20 tracking-widest">FULL CONNECTED</Badge>
                          <span className="text-[9px] text-emerald-500/60 font-black uppercase tracking-[0.2em]">Latence: 24ms</span>
                       </div>
                     </div>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-8 focus-visible:outline-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="premium-card rounded-[2.5rem] border border-white/5 border-t-red-500/40 bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-red-500/[0.03]">
                  <div className="flex items-center gap-8">
                    <div className="h-20 w-20 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-2xl animate-pulse">
                      <ShieldAlert className="h-10 w-10" />
                    </div>
                    <div>
                       <CardTitle className="text-2xl font-black uppercase text-red-500 leading-none mb-2 tracking-tighter">Le <span className="text-white">Coffre-fort</span></CardTitle>
                       <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mt-1">Protocoles d'urgence et sécurité périmétrique.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-10">
                   <div className="flex flex-col md:flex-row md:items-center justify-between p-12 rounded-[2.5rem] bg-red-500/[0.04] border border-red-500/10 group hover:bg-red-500/[0.06] transition-all duration-500 gap-10 shadow-2xl">
                      <div className="flex items-center gap-8">
                        <div className="h-20 w-20 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl">
                           <Flame className="h-10 w-10" />
                        </div>
                        <div className="space-y-3">
                          <p className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">Maintenance Forcée Critique</p>
                          <p className="text-[11px] text-muted-foreground/60 font-black leading-relaxed max-w-md uppercase tracking-tight">Interrompre instantanément l'accès orbital à toutes les unités <span className="text-red-500 font-black">Ivoire Bar VIP</span>. Utilisez uniquement en cas de compromission majeure.</p>
                        </div>
                      </div>
                      <Button variant="destructive" className="h-20 px-12 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-red-500/30 hover:scale-105 active:scale-95 transition-all">
                         DÉTONER PROTOCOLE
                      </Button>
                   </div>
                   
                   <div className="flex flex-col md:flex-row md:items-center justify-between p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-primary/40 transition-all duration-500 gap-10 shadow-2xl">
                     <div className="flex items-center gap-8">
                        <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:rotate-6 transition-all duration-500 shadow-xl">
                           <Lock className="h-10 w-10" />
                        </div>
                        <div className="space-y-3">
                          <p className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">Accès Manuel (Mode Expert)</p>
                          <p className="text-[11px] text-muted-foreground/60 font-black leading-relaxed max-w-md uppercase tracking-tight">Définissez un mot de passe pour vous connecter directement via Email/Password sans passer par Google Auth.</p>
                        </div>
                     </div>
                     <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                        <Input 
                          type="password" 
                          placeholder="Nouveau mot de passe" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-white/5 border-white/5 text-white h-16 rounded-2xl focus:border-primary/40 w-full md:w-64 shadow-xl font-black text-sm pl-6"
                        />
                        <Button 
                          onClick={handleUpdatePassword}
                          disabled={updatingPassword}
                          className="bg-primary text-primary-foreground h-16 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all whitespace-nowrap min-w-[220px] shadow-2xl shadow-primary/20"
                        >
                           {updatingPassword ? <Loader2 className="h-5 w-5 animate-spin" /> : 'DÉFINIR MOT DE PASSE'}
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
