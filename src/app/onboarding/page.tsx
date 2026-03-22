'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Clock, Wine, LogOut, MessageSquare } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const { establishment, signOut } = useAppContext()
  const router = useRouter()

  if (establishment?.status === 'Active') {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex flex-col items-center justify-center p-4">
      {/* Background Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37] blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-2xl space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#A68226] text-[#1A1A2E] shadow-2xl shadow-[#D4AF37]/20 mb-2">
            <Clock className="h-10 w-10 animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Inscription <span className="text-[#D4AF37]">reçue</span></h1>
          <p className="text-[#A0A0B8] text-lg font-medium">Votre établissement "{establishment?.name || 'Bar VIP'}" est en cours de validation.</p>
        </div>

        <Card className="bg-[#1A1A2E]/50 border-[#3A3A5A] backdrop-blur-xl shadow-2xl p-4">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center flex items-center justify-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#D4AF37]" /> Analyse de Sécurité
            </CardTitle>
            <CardDescription className="text-center text-[#A0A0B8]">
              Nous vérifions vos informations pour garantir l'excellence de la régie.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Vérification Identité", status: "Terminé", color: "text-green-400" },
                { label: "Configuration Cloud", status: "Terminé", color: "text-green-400" },
                { label: "Validation Finale", status: "En cours...", color: "text-[#D4AF37]" },
              ].map((step, i) => (
                <div key={i} className="bg-[#0F0F1A] border border-[#3A3A5A] p-4 rounded-2xl text-center space-y-1">
                  <p className="text-[10px] text-[#A0A0B8] uppercase tracking-widest">{step.label}</p>
                  <p className={`text-sm font-bold ${step.color}`}>{step.status}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-6 rounded-2xl space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-[#D4AF37] p-2 rounded-lg text-[#1A1A2E]">
                  <Wine className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Un conseiller va vous contacter</h4>
                  <p className="text-sm text-[#A0A0B8]">Un membre de notre équipe technique vous appellera dans les prochaines 24h pour finaliser votre accès VIP.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <Button 
                onClick={() => window.open('https://wa.me/2250700000000', '_blank')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-xl"
              >
                <MessageSquare className="h-5 w-5 mr-2" /> Contacter Support
              </Button>
              <Button 
                onClick={signOut}
                variant="outline"
                className="flex-1 border-[#3A3A5A] text-[#A0A0B8] hover:bg-white/5 font-bold py-6 rounded-xl"
              >
                <LogOut className="h-5 w-5 mr-2" /> Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-[#3A3A5A] font-medium uppercase tracking-widest">
          ID ÉTABLISSEMENT : {establishment?.id.split('-')[0].toUpperCase() || 'SEARCHING...'}
        </p>
      </div>
    </div>
  )
}
