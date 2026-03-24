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
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
             <Settings2 className="h-8 w-8 text-blue-600" />
           </div>
           <p className="text-sm font-medium text-slate-500">Chargement des paramètres...</p>
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
            <div className="h-2 w-8 bg-blue-600 rounded-full" />
            <p className="subheading text-blue-600">Configuration</p>
          </div>
          <h1 className="heading-xl">Paramètres du système</h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
            Configurez l'identité de votre établissement, vos informations de contact et vos préférences de facturation.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
           <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Connexion sécurisée</span>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-8">
        <TabsList className="bg-slate-50 border border-slate-100 p-1.5 h-auto flex-wrap justify-start rounded-xl">
          <TabsTrigger value="branding" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider transition-all">
            <Palette className="h-4 w-4 mr-2" /> Identité
          </TabsTrigger>
          <TabsTrigger value="general" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider transition-all">
            <Building2 className="h-4 w-4 mr-2" /> Contact
          </TabsTrigger>
          <TabsTrigger value="invoice" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider transition-all">
            <FileText className="h-4 w-4 mr-2" /> Facturation
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSave} className="space-y-8">
          <TabsContent value="branding" className="focus-visible:outline-none outline-none">
            <Card className="premium-card rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/20">
                 <h2 className="text-lg font-bold text-slate-900">Logo de l'établissement</h2>
                 <p className="text-xs font-medium text-slate-500 mt-1">Définissez l'image qui apparaîtra sur vos reçus.</p>
              </CardHeader>
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-12">
                <div className="relative group">
                  <div className="h-40 w-40 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-200 shadow-sm duration-500">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-12 w-12 text-slate-200" />
                    )}
                  </div>
                  <Button type="button" onClick={handleLogoMock} size="icon" className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-blue-600 text-white shadow-lg border-2 border-white hover:scale-110 transition-all">
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-4 max-w-sm text-center md:text-left">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-none mb-2">Image de marque</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">Privilégiez un logo sur fond transparent pour un rendu optimal sur les factures imprimées.</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-none text-[8px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Format recommandé: SVG</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="focus-visible:outline-none outline-none">
             <Card className="premium-card rounded-2xl overflow-hidden shadow-sm">
               <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/20">
                  <h2 className="text-lg font-bold text-slate-900">Coordonnées Pro</h2>
                  <p className="text-xs font-medium text-slate-500 mt-1">Gérez vos informations de contact public.</p>
               </CardHeader>
               <CardContent className="grid gap-8 md:grid-cols-2 p-8">
                 <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase text-slate-400">Nom de l'établissement</Label>
                   <div className="relative">
                     <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                     <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-slate-50 border-slate-100 h-12 pl-12 rounded-xl font-bold text-slate-900 focus:ring-blue-100 transition-all" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase text-slate-400">Localisation</Label>
                   <div className="relative">
                     <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                     <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-slate-50 border-slate-100 h-12 pl-12 rounded-xl font-bold text-slate-900 focus:ring-blue-100 transition-all" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase text-slate-400">Contact</Label>
                   <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                     <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-slate-50 border-slate-100 h-12 pl-12 rounded-xl font-bold text-slate-900 focus:ring-blue-100 transition-all" />
                   </div>
                 </div>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="invoice" className="focus-visible:outline-none outline-none">
            <Card className="premium-card rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/20">
                 <h2 className="text-lg font-bold text-slate-900">Paramètres de Facturation</h2>
                 <p className="text-xs font-medium text-slate-500 mt-1">Configurez les taxes et les notes de bas de page.</p>
              </CardHeader>
              <CardContent className="grid gap-8 md:grid-cols-2 p-8">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-400">Taux de taxe (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input type="number" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: Number(e.target.value)})} className="bg-slate-50 border-slate-100 h-12 pl-12 rounded-xl font-bold text-slate-900 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-400">Note sur la facture</Label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input value={formData.invoiceNote} onChange={e => setFormData({...formData, invoiceNote: e.target.value})} className="bg-slate-50 border-slate-100 h-12 pl-12 rounded-xl font-bold text-slate-900 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-50/50 p-8 rounded-2xl border border-blue-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 leading-none mb-1">Protection des données</p>
                <p className="text-xs font-medium text-slate-500">Vos paramètres sont synchronisés en temps réel sur le cloud.</p>
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-bold h-14 px-10 rounded-xl shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50" disabled={isSaving}>
              {isSaving ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Synchronisation...</> : <><Save className="h-5 w-5 mr-2" /> Enregistrer les réglages</>}
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
