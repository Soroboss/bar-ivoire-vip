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
  Settings2
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center text-foreground font-montserrat">
        <div className="space-y-6 animate-pulse">
          <div className="relative">
             <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
               <Settings2 className="h-8 w-8 text-primary" />
             </div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2">
               <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
             </div>
          </div>
          <p className="text-primary text-xs font-black uppercase tracking-[0.3em] italic">Synchronisation Globale...</p>
        </div>
      </div>
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    updateEstablishment(formData)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Paramètres enregistrés sur le Cloud')
    }, 1000)
  }

  const handleLogoMock = () => {
    setFormData({ ...formData, logo: "https://api.dicebear.com/7.x/identicon/svg?seed=bar" })
    toast.info("Aperçu logo généré")
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
               <Settings2 className="h-4 w-4 text-primary" />
            </div>
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic">Configuration Système</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter italic uppercase leading-none">
            Paramètres <span className="gold-gradient-text">& Cloud</span>
          </h1>
          <p className="text-muted-foreground text-base border-l-2 border-primary pl-4 max-w-xl font-medium">
            Pilotage de l'identité et des protocoles de facturation. Vos modifications sont propagées en temps réel via <span className="text-foreground italic">Supabase Edge Engine</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-2xl border border-border">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest italic opacity-60 text-foreground">Status: Liaison Sécurisée</span>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-8">
        <TabsList className="bg-muted/30 border border-border p-1.5 h-auto flex-wrap justify-start rounded-2xl">
          <TabsTrigger value="branding" className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black italic uppercase text-[10px] tracking-widest transition-all">
            <Palette className="h-3.5 w-3.5 mr-2" /> Branding
          </TabsTrigger>
          <TabsTrigger value="general" className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black italic uppercase text-[10px] tracking-widest transition-all">
            <Building2 className="h-3.5 w-3.5 mr-2" /> Coordonnées
          </TabsTrigger>
          <TabsTrigger value="invoice" className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black italic uppercase text-[10px] tracking-widest transition-all">
            <FileText className="h-3.5 w-3.5 mr-2" /> Facturation
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSave} className="space-y-8">
          <TabsContent value="branding" className="focus-visible:outline-none">
            <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-sm">
              <CardHeader className="p-8 border-b border-border bg-muted/20">
                 <CardTitle className="text-xl font-black uppercase italic gold-gradient-text leading-none">Identité <span className="text-foreground">Visuelle</span></CardTitle>
                 <CardDescription className="font-semibold italic">Définition du logo et de l'empreinte de marque sur les documents.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
                <div className="relative group">
                  <div className="h-40 w-40 rounded-[2.5rem] bg-muted/40 border-4 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/40 shadow-inner">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" />
                    ) : (
                      <Building2 className="h-12 w-12 text-muted-foreground opacity-20" />
                    )}
                  </div>
                  <Button type="button" onClick={handleLogoMock} size="icon" className="absolute -bottom-2 -right-2 h-12 w-12 rounded-2xl bg-primary text-white shadow-xl shadow-primary/40 border-4 border-background hover:scale-110 transition-transform">
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-4 max-w-sm text-center md:text-left">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter leading-none">Emblème de l'Établissement</h3>
                    <p className="text-xs text-muted-foreground font-semibold italic">Ce symbole sera déployé sur vos reçus physiques et interfaces clients.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] font-black uppercase tracking-widest">SVG supporté</Badge>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] font-black uppercase tracking-widest">Dimension Max: 500px</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="focus-visible:outline-none">
             <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-sm">
               <CardHeader className="p-8 border-b border-border bg-muted/20">
                  <CardTitle className="text-xl font-black uppercase italic gold-gradient-text leading-none">Données <span className="text-foreground">Géographiques</span></CardTitle>
                  <CardDescription className="font-semibold italic">Localisation et identification légale de l'unité opérationnelle.</CardDescription>
               </CardHeader>
               <CardContent className="grid gap-8 md:grid-cols-2 p-8 md:p-12">
                 <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nom de l'Établissement</Label>
                   <div className="relative group">
                     <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                     <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-muted border-border text-foreground h-14 pl-12 rounded-2xl font-bold focus:border-primary/20 transition-all" />
                   </div>
                 </div>
                 <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Adresse / Ville Opérationnelle</Label>
                   <div className="relative group">
                     <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                     <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-muted border-border text-foreground h-14 pl-12 rounded-2xl font-bold focus:border-primary/20 transition-all" />
                   </div>
                 </div>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="invoice" className="focus-visible:outline-none">
            <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-sm">
              <CardHeader className="p-8 border-b border-border bg-muted/20">
                 <CardTitle className="text-xl font-black uppercase italic gold-gradient-text leading-none">Matrice <span className="text-foreground">Fiscale</span></CardTitle>
                 <CardDescription className="font-semibold italic">Paramètres de calcul des taxes et notes de bas de facture.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-8 md:grid-cols-2 p-8 md:p-12">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Taux TVA / Taxe (%)</Label>
                  <div className="relative group">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <Input type="number" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: Number(e.target.value)})} className="bg-muted border-border text-foreground h-14 pl-12 rounded-2xl font-bold focus:border-primary/20 transition-all" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Note de courtoisie du Reçu</Label>
                  <div className="relative group">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <Input value={formData.invoiceNote} onChange={e => setFormData({...formData, invoiceNote: e.target.value})} className="bg-muted border-border text-foreground h-14 pl-12 rounded-2xl font-bold focus:border-primary/20 transition-all" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-muted/20 p-8 rounded-[2rem] border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black uppercase italic tracking-tighter leading-none mb-1">Protection des Données Cloud</p>
                <p className="text-[10px] text-muted-foreground font-semibold">Toutes les modifications sont cryptées de bout en bout.</p>
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto bg-primary text-white font-black uppercase italic text-xs h-14 px-10 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all" disabled={isSaving}>
              {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Synchronisation...</> : <><Save className="h-4 w-4 mr-2" /> Déployer les Mise à Jour</>}
            </Button>
          </div>
        </form>
      </Tabs>
    </motion.div>
  )
}
