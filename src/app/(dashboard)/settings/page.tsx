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
  Percent
} from "lucide-react"
import { toast } from 'sonner'
import { useAppContext } from '@/context/AppContext'

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
      <div className="p-6 h-screen bg-[#1A1A2E] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
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
    <div className="p-6 space-y-8 bg-[#1A1A2E] text-[#F4E4BC] min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#D4AF37]">Configuration <span className="text-white">Établissement</span></h1>
        <p className="text-[#A0A0B8]">Gérez votre identité visuelle et vos paramètres Cloud.</p>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="bg-[#252545] border-[#3A3A5A] p-1 h-auto flex-wrap justify-start">
          <TabsTrigger value="branding" className="py-2.5 data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1A1A2E]">
            <Palette className="h-4 w-4 mr-2" /> Branding
          </TabsTrigger>
          <TabsTrigger value="general" className="py-2.5 data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1A1A2E]">
            <Building2 className="h-4 w-4 mr-2" /> Coordonnées
          </TabsTrigger>
          <TabsTrigger value="invoice" className="py-2.5 data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1A1A2E]">
            <FileText className="h-4 w-4 mr-2" /> Facturation
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSave} className="space-y-6">
          <TabsContent value="branding">
            <Card className="bg-[#252545] border-[#3A3A5A]">
              <CardHeader>
                <CardTitle className="text-white font-bold">Logo de l'établissement</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-8">
                <div className="relative group">
                  <div className="h-28 w-28 rounded-2xl bg-[#1A1A2E] border-2 border-dashed border-[#3A3A5A] flex items-center justify-center overflow-hidden transition-all group-hover:border-[#D4AF37]">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-10 w-10 text-[#3A3A5A]" />
                    )}
                  </div>
                  <Button type="button" onClick={handleLogoMock} size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#D4AF37] text-black">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold">Image de Marque Cloud</p>
                  <p className="text-xs text-[#A0A0B8]">Visible sur tous vos terminaux connectés.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general">
             <Card className="bg-[#252545] border-[#3A3A5A]">
               <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
                 <div className="space-y-2">
                   <Label>Nom de l'établissement</Label>
                   <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-[#1A1A2E] border-[#3A3A5A]" />
                 </div>
                 <div className="space-y-2">
                   <Label>Adresse / Ville</Label>
                   <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-[#1A1A2E] border-[#3A3A5A]" />
                 </div>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="invoice">
            <Card className="bg-[#252545] border-[#3A3A5A]">
              <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
                <div className="space-y-2">
                  <Label>Taux TVA (%)</Label>
                  <Input type="number" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: Number(e.target.value)})} className="bg-[#1A1A2E] border-[#3A3A5A]" />
                </div>
                <div className="space-y-2">
                  <Label>Message bas de page</Label>
                  <Input value={formData.invoiceNote} onChange={e => setFormData({...formData, invoiceNote: e.target.value})} className="bg-[#1A1A2E] border-[#3A3A5A]" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-[#D4AF37] text-[#1A1A2E] font-bold px-8 h-12" disabled={isSaving}>
              {isSaving ? "Synchronisation..." : <><Save className="h-5 w-5 mr-2" /> Enregistrer les modifications</>}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
