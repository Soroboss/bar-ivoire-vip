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
  MessageSquare
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SaaSConfigPage() {
  return (
    <div className="p-6 space-y-8 bg-[#0F0F1A] text-[#F4E4BC] min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white italic">Paramètres <span className="text-[#D4AF37]">Plateforme</span></h1>
        <p className="text-[#A0A0B8]">Configurez les variables globales du SaaS Ivoire Bar VIP.</p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="bg-[#1A1A2E] border-[#3A3A5A] p-1">
          <TabsTrigger value="plans" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1A1A2E]">Forfaits</TabsTrigger>
          <TabsTrigger value="gateway" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1A1A2E]">Passerelle</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1A1A2E]">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <Card className="bg-[#1A1A2E] border-[#3A3A5A]">
            <CardHeader>
              <CardTitle className="text-white">Gestion des Tarifs</CardTitle>
              <CardDescription className="text-[#A0A0B8]">Définissez les prix des abonnements mensuels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="grid gap-6 md:grid-cols-2">
                 <div className="space-y-2">
                   <Label className="text-white">Business (Mensuel)</Label>
                   <div className="flex gap-2">
                     <Input defaultValue="15000" className="bg-[#0F0F1A] border-[#3A3A5A] text-white" />
                     <span className="flex items-center text-xs text-[#A0A0B8]">FCFA</span>
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-white">Enterprise (Annuel)</Label>
                   <div className="flex gap-2">
                     <Input defaultValue="150000" className="bg-[#0F0F1A] border-[#3A3A5A] text-white" />
                     <span className="flex items-center text-xs text-[#A0A0B8]">FCFA</span>
                   </div>
                 </div>
               </div>
               <div className="flex justify-end">
                 <Button className="bg-[#D4AF37] text-[#1A1A2E] font-bold"><Save className="h-4 w-4 mr-2" /> Enregistrer les tarifs</Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gateway">
          <Card className="bg-[#1A1A2E] border-[#3A3A5A]">
            <CardHeader className="flex flex-row items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                 <Smartphone className="h-6 w-6" />
               </div>
               <div>
                  <CardTitle className="text-white">CinetPay / Wave Integration</CardTitle>
                  <CardDescription className="text-[#A0A0B8]">Passerelle de paiement Mobile Money.</CardDescription>
               </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                 <Label className="text-white">API Key (Production)</Label>
                 <Input type="password" value="sk_test_••••••••••••••••" className="bg-[#0F0F1A] border-[#3A3A5A] text-white" readOnly />
               </div>
               <div className="flex items-center gap-2">
                 <Badge className="bg-green-500 text-white border-none">CONNECTÉ</Badge>
                 <span className="text-xs text-[#A0A0B8]">Dernière synchronisation : Il y a 5 min</span>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="bg-[#1A1A2E] border-[#3A3A5A]">
            <CardHeader>
              <CardTitle className="text-white font-serif italic">Coffre-fort SaaS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Maintenance Forcée</p>
                    <p className="text-[10px] text-[#A0A0B8]">Couper l'accès à tous les établissements</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">Activer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
