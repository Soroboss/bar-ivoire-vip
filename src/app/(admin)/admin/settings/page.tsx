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
  Loader2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"

export default function SaaSConfigPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
      {/* Configuration Strategic Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
               <Settings className="h-4 w-4 text-[#D4AF37]" />
            </div>
            <span className="text-[#A0A0B8] text-[10px] font-black uppercase tracking-widest italic">Panneau de Contrôle Central</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase leading-none">
            Config <span className="gold-gradient-text">Plateforme</span>
          </h1>
          <p className="text-[#A0A0B8] text-base border-l-2 border-[#D4AF37] pl-4 max-w-xl">
            Ajustez les paramètres fondamentaux de l'écosystème <span className="text-white italic">Ivoire Bar VIP</span>. Modifiez les tarifs, les clés d'accès et la sécurité orbitale.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-3xl group transition-all hover:border-[#D4AF37]/30">
           <div className="flex flex-col items-end">
              <p className="text-[9px] text-[#A0A0B8] uppercase font-black tracking-[0.2em] mb-1 opacity-50">Status Noyau</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white italic tracking-tighter">SYNCHRONISÉ</span>
                <div className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_12px_#D4AF37]" />
              </div>
           </div>
        </div>
      </motion.div>

      <Tabs defaultValue="plans" className="space-y-8">
        <motion.div variants={itemVariants}>
          <TabsList className="bg-black/40 border border-white/5 p-1.5 rounded-2xl backdrop-blur-3xl h-16 w-full md:w-auto">
            <TabsTrigger value="plans" className="flex-1 md:flex-none rounded-[1.25rem] px-10 h-13 text-[10px] uppercase font-black tracking-[0.2em] data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black data-[state=active]:shadow-lg active:scale-95 transition-all">Forfaits</TabsTrigger>
            <TabsTrigger value="gateway" className="flex-1 md:flex-none rounded-[1.25rem] px-10 h-13 text-[10px] uppercase font-black tracking-[0.2em] data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black data-[state=active]:shadow-lg active:scale-95 transition-all">Passerelle</TabsTrigger>
            <TabsTrigger value="security" className="flex-1 md:flex-none rounded-[1.25rem] px-10 h-13 text-[10px] uppercase font-black tracking-[0.2em] data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black data-[state=active]:shadow-lg active:scale-95 transition-all">Sécurité</TabsTrigger>
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          <TabsContent value="plans" className="space-y-6 focus-visible:ring-0 outline-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass-card border-white/5 rounded-[2.5rem] overflow-hidden scanline shadow-2xl">
                <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:scale-110 transition-transform">
                       <Zap className="h-7 w-7" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-3xl font-black uppercase italic tracking-tighter leading-none mb-1">Matrice <span className="gold-gradient-text">Tarifaire</span></CardTitle>
                      <CardDescription className="text-[#A0A0B8] text-[10px] font-bold uppercase tracking-widest italic">Définition des flux de revenus par abonnement.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-12">
                   <div className="grid gap-12 md:grid-cols-2">
                     <div className="space-y-5">
                       <div className="flex items-center justify-between px-2">
                         <Label className="text-white font-black uppercase text-[10px] tracking-[0.2em] italic">Forfait Business (Mensuel)</Label>
                         <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] text-[8px] font-black uppercase tracking-widest px-3 bg-[#D4AF37]/5">Recommandé</Badge>
                       </div>
                       <div className="flex gap-3 relative group">
                         <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                               <span className="text-[#A0A0B8] text-sm opacity-30 font-black italic mt-1">#</span>
                            </div>
                            <Input defaultValue="15000" className="bg-black/50 border-white/5 text-white h-16 text-2xl font-black tracking-tighter rounded-2xl focus:border-[#D4AF37]/40 transition-all pl-12 group-hover:border-white/10" />
                         </div>
                         <div className="flex items-center px-8 bg-white/[0.03] border border-white/5 rounded-2xl text-[9px] font-black text-[#A0A0B8] uppercase tracking-[0.3em] italic min-w-[140px] justify-center">XOF / MOIS</div>
                       </div>
                     </div>
                     
                     <div className="space-y-5">
                       <div className="flex items-center justify-between px-2">
                         <Label className="text-white font-black uppercase text-[10px] tracking-[0.2em] italic">Forfait Elite (Annuel)</Label>
                         <Badge variant="outline" className="border-white/10 text-[#A0A0B8] text-[8px] font-black uppercase tracking-widest px-3 opacity-40">Tactique</Badge>
                       </div>
                       <div className="flex gap-3 relative group">
                         <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                               <span className="text-[#A0A0B8] text-sm opacity-30 font-black italic mt-1">#</span>
                            </div>
                            <Input defaultValue="150000" className="bg-black/50 border-white/5 text-white h-16 text-2xl font-black tracking-tighter rounded-2xl focus:border-[#D4AF37]/40 transition-all pl-12 group-hover:border-white/10" />
                         </div>
                         <div className="flex items-center px-8 bg-white/[0.03] border border-white/5 rounded-2xl text-[9px] font-black text-[#A0A0B8] uppercase tracking-[0.3em] italic min-w-[140px] justify-center">XOF / AN</div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="relative py-4">
                      <Separator className="bg-white/5" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#05050A] border border-white/5 flex items-center justify-center">
                         <Activity className="h-3 w-3 text-[#D4AF37]/30" />
                      </div>
                   </div>
                   
                   <div className="flex justify-end">
                     <Button className="bg-[#D4AF37] text-black h-16 px-12 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.1)] font-black text-[11px] uppercase tracking-[0.3em] italic hover:bg-[#B6962E] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-4">
                       <Save className="h-5 w-5" /> Sauvegarder la Matrice
                     </Button>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="gateway" className="space-y-6 focus-visible:ring-0 outline-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass-card border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center gap-8 bg-white/[0.01]">
                   <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-transform hover:rotate-12">
                     <Smartphone className="h-8 w-8" />
                   </div>
                   <div>
                      <CardTitle className="text-white text-3xl font-black uppercase italic tracking-tighter leading-none mb-1">Liaison <span className="gold-gradient-text">Paiement</span></CardTitle>
                      <CardDescription className="text-[#A0A0B8] text-[10px] font-black uppercase tracking-widest italic">Intégration Mobile Money Haute Disponibilité.</CardDescription>
                   </div>
                </CardHeader>
                <CardContent className="p-10 space-y-12">
                   <div className="grid gap-12">
                     <div className="space-y-5">
                       <div className="flex items-center justify-between px-2">
                          <Label className="text-white font-black uppercase text-[10px] tracking-[0.2em] italic">Clé API Production (Chiffrée)</Label>
                          <div className="flex items-center gap-2 text-green-500/50 font-black text-[8px] uppercase tracking-widest">
                             <Lock className="h-3 w-3" /> Chiffrement AES-256 Actif
                          </div>
                       </div>
                       <div className="relative group">
                         <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors group-hover:text-[#D4AF37]">
                           <Key className="h-5 w-5 text-white/10" />
                         </div>
                         <Input type="password" value="sk_production_••••••••••••••••••••••••••••" className="bg-black/50 border-white/5 text-white h-16 font-mono text-sm tracking-widest rounded-2xl focus:border-[#D4AF37]/50 transition-all pl-16 group-hover:border-white/10" readOnly />
                         <div className="absolute top-1/2 right-6 -translate-y-1/2">
                            <Button variant="ghost" size="sm" className="h-8 text-[8px] font-black uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg">RÉVÉLER</Button>
                         </div>
                       </div>
                     </div>
                     
                     <div className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 group hover:border-[#D4AF37]/20 transition-all gap-8">
                       <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 group-hover:scale-110 transition-transform">
                               <Server className="h-7 w-7" />
                            </div>
                            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 animate-ping opacity-40" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white italic uppercase tracking-tighter mb-1">Status de la Liaison</p>
                            <p className="text-[10px] text-[#A0A0B8] uppercase font-bold tracking-[0.2em] opacity-60">Serveurs Agnostiques opérationnels (Paris / Abidjan)</p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <Badge className="bg-green-500 text-black border-none font-black text-[9px] px-6 py-2 rounded-full shadow-xl shadow-green-500/10 tracking-widest">FULL CONNECTED</Badge>
                          <span className="text-[8px] text-green-500/50 font-black uppercase tracking-widest">Latence: 24ms</span>
                       </div>
                     </div>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6 focus-visible:ring-0 outline-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass-card border-white/5 border-t-red-500/30 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="p-8 border-b border-white/5 bg-red-500/[0.02]">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-2xl shadow-red-500/10 animate-pulse">
                      <ShieldAlert className="h-8 w-8" />
                    </div>
                    <div>
                       <CardTitle className="text-white text-3xl font-black uppercase italic tracking-tighter leading-none mb-1">Le <span className="text-red-500">Coffre-fort</span></CardTitle>
                       <CardDescription className="text-[#A0A0B8] text-[10px] font-black uppercase tracking-widest italic">Protocoles d'urgence et sécurité périmétrique.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                   <div className="flex flex-col md:flex-row md:items-center justify-between p-10 rounded-[2.5rem] bg-red-500/[0.03] border border-red-500/10 group hover:bg-red-500/[0.05] transition-all gap-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Flame className="h-24 w-24 text-red-500" />
                     </div>
                     <div className="flex items-center gap-6 relative z-10">
                        <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform shadow-xl">
                           <Flame className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-black text-white italic uppercase tracking-tighter">Maintenance Forcée Critique</p>
                          <p className="text-[11px] text-[#A0A0B8] font-medium leading-relaxed max-w-md">Interrompre instantanément l'accès orbital à toutes les unités <span className="text-red-400 font-black italic">Ivoire Bar VIP</span>. Utilisez uniquement en cas de compromission majeure.</p>
                        </div>
                     </div>
                     <div className="relative z-10">
                        <Button variant="destructive" className="h-16 px-10 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.3em] italic shadow-2xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all border border-red-500/30">
                           DÉTONER PROTOCOLE
                        </Button>
                     </div>
                   </div>
                   
                   <div className="flex flex-col md:flex-row md:items-center justify-between p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-[#D4AF37]/30 transition-all gap-8">
                     <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 group-hover:rotate-12 transition-transform shadow-xl shadow-[#D4AF37]/5">
                           <Cpu className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-black text-white italic uppercase tracking-tighter">Mode Analyse Heuristique</p>
                          <p className="text-[11px] text-[#A0A0B8] font-medium leading-relaxed max-w-md">Monitoring avancé des logs de connexion et détection proactive des anomalies de force brute par signature fractale.</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 bg-[#A0A0B8]/5 px-8 py-5 rounded-[1.25rem] border border-white/5 shadow-inner">
                        <div className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">ACTIF</span>
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
