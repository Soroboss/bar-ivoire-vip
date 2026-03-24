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
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
             <Settings2 className="h-8 w-8 text-primary" />
           </div>
           <p className="text-sm font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Initialisation Système...</p>
        </div>
      </div>
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateEstablishment(formData)
      toast.success('Paramètres mis à jour')
    } catch (e) {}
    setIsSaving(false)
  }

  const handleLogoMock = () => {
    setFormData({ ...formData, logo: "https://api.dicebear.com/7.x/identicon/svg?seed=bar" })
    toast.info("Génération de l'emblème simulée")
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <p className="subheading text-primary font-bold">Configuration VIP</p>
          </div>
          <h1 className="heading-xl">Identité & Système</h1>
          <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">
            Configurez l'identité de votre établissement, vos informations de contact et vos préférences de facturation.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
           <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Connexion sécurisée</span>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/5 p-1.5 h-auto flex-wrap justify-start rounded-2xl backdrop-blur-3xl">
          <TabsTrigger value="branding" className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 text-muted-foreground/40 text-center">
            <Palette className="h-4 w-4 mr-2" /> Identité
          </TabsTrigger>
          <TabsTrigger value="general" className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 text-muted-foreground/40 text-center">
            <Building2 className="h-4 w-4 mr-2" /> Contact
          </TabsTrigger>
          <TabsTrigger value="invoice" className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 text-muted-foreground/40 text-center">
            <FileText className="h-4 w-4 mr-2" /> Facturation
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSave} className="space-y-8">
          <TabsContent value="branding" className="focus-visible:outline-none outline-none">
            <Card className="premium-card rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl">
              <CardHeader className="p-10 border-b border-white/5">
                 <h2 className="text-xl font-black text-white uppercase tracking-tighter">Logo de l'établissement</h2>
                 <p className="text-xs font-medium text-muted-foreground mt-1">Définissez l'image qui apparaîtra sur vos reçus.</p>
              </CardHeader>
              <CardContent className="p-10 flex flex-col md:flex-row items-center gap-12">
                <div className="relative group">
                  <div className="h-48 w-48 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/20 shadow-2xl duration-700 ring-4 ring-primary/5">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-16 w-16 text-muted-foreground/20" />
                    )}
                  </div>
                  <Button type="button" onClick={handleLogoMock} size="icon" className="absolute -bottom-2 -right-2 h-12 w-12 rounded-2xl bg-primary text-primary-foreground shadow-2xl border-4 border-card hover:scale-110 transition-all shadow-primary/40">
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-6 max-w-sm text-center md:text-left">
                  <div>
                    <h3 className="text-xl font-black text-white leading-none mb-3 uppercase tracking-tighter">Image de marque</h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">Privilégiez un logo sur fond transparent pour un rendu optimal sur les factures imprimées.</p>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl">Format recommandé: SVG / PNG</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="focus-visible:outline-none outline-none">
             <Card className="premium-card rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl">
               <CardHeader className="p-10 border-b border-white/5">
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">Coordonnées Pro</h2>
                  <p className="text-xs font-medium text-muted-foreground mt-1">Gérez vos informations de contact public.</p>
               </CardHeader>
               <CardContent className="grid gap-8 md:grid-cols-2 p-10">
                 <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest ml-1">Nom de l'établissement</Label>
                   <div className="relative group">
                     <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                     <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-white/5 h-14 pl-12 rounded-xl font-black text-white focus:ring-primary/20 transition-all uppercase tracking-tight" />
                   </div>
                 </div>
                 <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest ml-1">Localisation</Label>
                   <div className="relative group">
                     <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                     <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-white/5 border-white/5 h-14 pl-12 rounded-xl font-black text-white focus:ring-primary/20 transition-all uppercase tracking-tight" />
                   </div>
                 </div>
                 <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest ml-1">Contact</Label>
                   <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                     <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-white/5 border-white/5 h-14 pl-12 rounded-xl font-black text-white focus:ring-primary/20 transition-all" />
                   </div>
                 </div>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="invoice" className="focus-visible:outline-none outline-none">
            <Card className="premium-card rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl">
              <CardHeader className="p-10 border-b border-white/5">
                 <h2 className="text-xl font-black text-white uppercase tracking-tighter">Paramètres de Facturation</h2>
                 <p className="text-xs font-medium text-muted-foreground mt-1">Configurez les taxes et les notes de bas de page.</p>
              </CardHeader>
              <CardContent className="grid gap-8 md:grid-cols-2 p-10">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest ml-1">Taux de taxe (%)</Label>
                  <div className="relative group">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                    <Input type="number" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: Number(e.target.value)})} className="bg-white/5 border-white/5 h-14 pl-12 rounded-xl font-black text-white focus:ring-primary/20 transition-all" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest ml-1">Note sur la facture</Label>
                  <div className="relative group">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                    <Input value={formData.invoiceNote} onChange={e => setFormData({...formData, invoiceNote: e.target.value})} className="bg-white/5 border-white/5 h-14 pl-12 rounded-xl font-black text-white focus:ring-primary/20 transition-all" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="h-16 w-16 rounded-[1.5rem] bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40 ring-4 ring-primary/10 transition-all rotate-3 group-hover:rotate-0">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xl font-black text-white leading-none mb-2 uppercase tracking-tighter">Protection des données</p>
                <p className="text-xs font-medium text-muted-foreground/60">Vos paramètres sont sécurisés et synchronisés via InsForge Cloud.</p>
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto bg-primary text-primary-foreground font-black h-16 px-12 rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-[10px] relative z-10" disabled={isSaving}>
              {isSaving ? <><Loader2 className="h-5 w-5 mr-3 animate-spin" /> Synchronisation...</> : <><Save className="h-5 w-5 mr-3" /> Appliquer les changements</>}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
