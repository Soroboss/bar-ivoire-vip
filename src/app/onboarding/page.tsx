'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  MapPin, 
  Phone, 
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react"
import { useAppContext } from '@/context/AppContext'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const router = useRouter()
  const { registerEstablishment } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Lounge / Bar VIP',
    location: '',
    phone: '',
    owner: 'Propriétaire Démo'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await registerEstablishment({
        ...formData,
        currency: 'FCFA',
        taxRate: 18,
        invoiceNote: 'Merci de votre visite !'
      })
      
      toast.success("Demande d'inscription envoyée au Cloud !")
      router.push('/dashboard')
    } catch (e) {
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-10 pointer-events-none"></div>
      
      <Card className="w-full max-w-2xl bg-[#252545] border-[#3A3A5A] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="bg-[#D4AF37] h-2"></div>
        <CardHeader className="text-center space-y-4 pt-10">
          <div className="h-16 w-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mx-auto border border-[#D4AF37]/20">
            <Sparkles className="h-8 w-8 text-[#D4AF37]" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-[#D4AF37] bg-clip-text text-transparent">
              Configurez votre Espace VIP
            </CardTitle>
            <CardDescription className="text-[#A0A0B8] text-lg">
              Prêt à digitaliser votre établissement en quelques clics.
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8 p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#F4E4BC]">Nom de l'Etablissement</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]" />
                  <Input 
                    id="name" 
                    placeholder="Ex: Le Caveau VIP" 
                    className="pl-10 bg-[#1A1A2E] border-[#3A3A5A] text-white focus:border-[#D4AF37]" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-[#F4E4BC]">Type d'établissement</Label>
                <select 
                  id="type"
                  className="w-full h-10 px-3 rounded-md bg-[#1A1A2E] border-[#3A3A5A] text-white focus:border-[#D4AF37] outline-none text-sm"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option>Bar Gastronomique</option>
                  <option>Maquis VIP</option>
                  <option>Lounge / Chicha</option>
                  <option>Cave à Vins</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#F4E4BC]">Ville / Quartier (Côte d'Ivoire)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]" />
                  <Input 
                    id="location" 
                    placeholder="Ex: Abidjan, Rivera 2" 
                    className="pl-10 bg-[#1A1A2E] border-[#3A3A5A] text-white focus:border-[#D4AF37]" 
                    required 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#F4E4BC]">Numéro de téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]" />
                  <Input 
                    id="phone" 
                    placeholder="07 00 00 00 00" 
                    className="pl-10 bg-[#1A1A2E] border-[#3A3A5A] text-white focus:border-[#D4AF37]" 
                    required 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-[#D4AF37]" />
                <div>
                  <h4 className="text-white font-bold text-sm">7 Jours d'Essai Gratuit</h4>
                  <p className="text-[#A0A0B8] text-xs">Accès complet à toutes les fonctionnalités sans engagement.</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-10 pt-4">
            <Button 
              type="submit"
              className="w-full h-12 bg-[#D4AF37] text-[#1A1A2E] hover:bg-[#A68226] font-bold text-lg group shadow-xl shadow-[#D4AF37]/10"
              disabled={loading}
            >
              {loading ? (
                "Initialisation de votre espace..."
              ) : (
                <>Finaliser et accéder au logiciel <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
