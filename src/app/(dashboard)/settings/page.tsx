'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  Palette, 
  Database, 
  Save,
  Camera,
  FileText,
  Percent,
  Loader2,
  Globe,
  ShieldCheck,
  Settings2,
  Zap,
  Globe2,
  Lock
} from "lucide-react"
import { toast } from 'sonner'
import { useAppContext } from '@/context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function SettingsPage() {
  const { establishment, updateEstablishment, loading } = useAppContext()
  const [formData, setFormData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (establishment) {
      setFormData(establishment)
    }
  }, [establishment])

  if (loading || !formData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="space-y-6 animate-pulse">
           <div className="h-20 w-20 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto shadow-sm">
             <Settings2 className="h-10 w-10 text-primary" />
           </div>
           <p className="subheading">Synchronisation des Protocoles Globaux...</p>
        </div>
      </div>
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateEstablishment(formData)
      toast.success('Paramètres synchronisés avec le Cloud')
    } catch (e) {}
    setIsSaving(false)
  }

  const handleLogoMock = () => {
    setFormData({ ...formData, logo: "https://api.dicebear.com/7.x/identicon/svg?seed=bar" })
    toast.info("Génération de l'emblème simulée")
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
               <Settings2 className="h-4 w-4 text-primary" />
            </div>
            <p className="subheading">Matrice de Configuration Système</p>
          </div>
          <h1 className="heading-xl">Réglages <span className="gold-gradient-text">& Cloud</span></h1>
          <p className="text-muted-foreground font-semibold italic border-l-2 border-primary pl-4 py-1 leading-relaxed max-w-2xl">
            Gestion de l'identité visuelle et des protocoles de facturation. Propagation instantanée via <span className="text-foreground font-black italic">Supabase Edge Engine</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-emerald-50/50 px-6 py-3 rounded-2xl ring-1 ring-emerald-500/20 shadow-sm shadow-emerald-500/5">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest italic text-emerald-600">Liaison Sécurisée Active</span>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-10">
        <TabsList className="bg-muted/20 ring-1 ring-border p-2 h-auto flex-wrap justify-start rounded-[1.5rem] backdrop-blur-xl">
          <TabsTrigger value="branding" className="px-8 py-3.5 rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-primary/20 font-black italic uppercase text-[10px] tracking-widest transition-all">
            <Palette className="h-4 w-4 mr-3" /> Identité
          </TabsTrigger>
          <TabsTrigger value="general" className="px-8 py-3.5 rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-primary/20 font-black italic uppercase text-[10px] tracking-widest transition-all">
            <Building2 className="h-4 w-4 mr-3" /> Coordonnées
          </TabsTrigger>
          <TabsTrigger value="invoice" className="px-8 py-3.5 rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-primary/20 font-black italic uppercase text-[10px] tracking-widest transition-all">
            <FileText className="h-4 w-4 mr-3" /> Facturation
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSave} className="space-y-10">
          <TabsContent value="branding" className="focus-visible:outline-none outline-none">
            <Card className="premium-card border-none ring-1 ring-border rounded-[3rem] overflow-hidden shadow-sm">
              <CardHeader className="p-10 border-b border-border/50 bg-muted/10">
                 <h2 className="heading-lg">Empreinte <span className="gold-gradient-text">Visuelle</span></h2>
                 <p className="subheading mt-2">Définition du logo et du style de marque sur les reçus.</p>
              </CardHeader>
              <CardContent className="p-12 flex flex-col md:flex-row items-center gap-16">
                <div className="relative group">
                  <div className="h-48 w-48 rounded-[3rem] bg-white ring-1 ring-border flex items-center justify-center overflow-hidden transition-all group-hover:ring-primary/40 shadow-inner group-hover:shadow-2xl duration-700">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-700" />
                    ) : (
                      <Building2 className="h-16 w-16 text-muted-foreground opacity-10" />
                    )}
                  </div>
                  <Button type="button" onClick={handleLogoMock} size="icon" className="absolute -bottom-2 -right-2 h-14 w-14 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/40 border-4 border-background hover:scale-110 active:scale-90 transition-all">
                    <Camera className="h-6 w-6" />
                  </Button>
                </div>
                <div className="space-y-6 max-w-md text-center md:text-left">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter leading-none">Blason Orbitale</h3>
                    <p className="subheading leading-relaxed">Ce symbole sera déployé sur vos reçus physiques et interfaces clients. Privilégiez un format haut ratio de contraste.</p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Optimal: Transparent SVG</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="focus-visible:outline-none outline-none">
             <Card className="premium-card border-none ring-1 ring-border rounded-[3rem] overflow-hidden shadow-sm">
               <CardHeader className="p-10 border-b border-border/50 bg-muted/10">
                  <h2 className="heading-lg">Coordonnées <span className="gold-gradient-text">Logistiques</span></h2>
                  <p className="subheading mt-2">Identification officielle de l'unité opérationnelle.</p>
               </CardHeader>
               <CardContent className="grid gap-10 md:grid-cols-2 p-12">
                 <div className="space-y-3">
                   <Label className="subheading ml-1 opacity-60">Désignation de l'Établissement</Label>
                   <div className="relative group">
                     <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-all" />
                     <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-muted/30 border-none ring-1 ring-border text-foreground h-16 pl-14 rounded-2xl font-black italic text-lg focus:ring-primary/40 transition-all shadow-inner" />
                   </div>
                 </div>
                 <div className="space-y-3">
                   <Label className="subheading ml-1 opacity-60">Zone de Liaison Cloud (Adresse)</Label>
                   <div className="relative group">
                     <Globe2 className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-all" />
                     <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-muted/30 border-none ring-1 ring-border text-foreground h-16 pl-14 rounded-2xl font-black italic text-lg focus:ring-primary/40 transition-all shadow-inner" />
                   </div>
                 </div>
                 <div className="space-y-3">
                   <Label className="subheading ml-1 opacity-60">Contact de Réception</Label>
                   <div className="relative group">
                     <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-all" />
                     <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-muted/30 border-none ring-1 ring-border text-foreground h-16 pl-14 rounded-2xl font-black italic text-lg focus:ring-primary/40 transition-all shadow-inner" />
                   </div>
                 </div>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="invoice" className="focus-visible:outline-none outline-none">
            <Card className="premium-card border-none ring-1 ring-border rounded-[3rem] overflow-hidden shadow-sm">
              <CardHeader className="p-10 border-b border-border/50 bg-muted/10">
                 <h2 className="heading-lg">Gravité <span className="gold-gradient-text">Fiscale</span></h2>
                 <p className="subheading mt-2">Paramètres dynamiques de calcul et d'étiquetage.</p>
              </CardHeader>
              <CardContent className="grid gap-10 md:grid-cols-2 p-12">
                <div className="space-y-3">
                  <Label className="subheading ml-1 opacity-60">Amplitude TVA (%)</Label>
                  <div className="relative group">
                    <Percent className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-all" />
                    <Input type="number" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: Number(e.target.value)})} className="bg-muted/30 border-none ring-1 ring-border text-foreground h-16 pl-14 rounded-2xl font-black italic text-lg focus:ring-primary/40 transition-all shadow-inner" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="subheading ml-1 opacity-60">Mention de Clôture du Reçu</Label>
                  <div className="relative group">
                    <FileText className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-all" />
                    <Input value={formData.invoiceNote} onChange={e => setFormData({...formData, invoiceNote: e.target.value})} className="bg-muted/30 border-none ring-1 ring-border text-foreground h-16 pl-14 rounded-2xl font-black italic text-lg focus:ring-primary/40 transition-all shadow-inner" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-primary/[0.03] p-10 rounded-[2.5rem] border border-primary/10 shadow-inner">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl shadow-primary/10">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-black uppercase italic tracking-tighter leading-none mb-1">Protection Orbitale Active</p>
                <p className="subheading">Vos modifications sont cryptées de bout en bout avant propagation.</p>
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto bg-primary text-white font-black uppercase italic text-[11px] h-16 px-12 rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-50" disabled={isSaving}>
              {isSaving ? <><Loader2 className="h-5 w-5 mr-3 animate-spin" /> SYNCHRONISATION...</> : <><Save className="h-5 w-5 mr-3" /> DÉPLOYER LA CONFIGURATION</>}
            </Button>
          </div>
        </form>
      </Tabs>
    </motion.div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
