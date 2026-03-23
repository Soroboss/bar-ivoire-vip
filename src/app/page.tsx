import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Shield, Smartphone } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-[#F4E4BC]">
      {/* Header */}
      <header className="border-b border-[#3A3A5A] px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#D4AF37]">Ivoire Bar VIP</h1>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-[#F4E4BC] hover:text-[#D4AF37]">Connexion</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-[#D4AF37] text-[#1A1A2E] hover:bg-[#A68226]">Démarrer</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-24 text-center space-y-8 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
          Gérez votre bar avec <span className="text-[#D4AF37]">Excellence.</span>
        </h2>
        <p className="text-xl text-[#A0A0B8]">
          La solution SaaS n°1 en Côte d'Ivoire pour les maquis VIP, lounges et caves à vin. 
          Stock, Caisse, Personnel et Fidélité dans une seule main.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="bg-[#D4AF37] text-[#1A1A2E] hover:bg-[#A68226] text-lg px-8">
              Créer mon établissement <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-[#3A3A5A] text-[#F4E4BC] text-lg px-8">
            Voir la démo
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-[#151525]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
              <Smartphone className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl font-bold">Caisse Tactile</h3>
            <p className="text-[#A0A0B8]">Prenez des commandes sur tablette ou téléphone en un éclair. Paiement Mobile Money intégré.</p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
              <Star className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl font-bold">Fidélité VIP</h3>
            <p className="text-[#A0A0B8]">Transformez vos clients réguliers en VIP. Système de points et notifications WhatsApp.</p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
              <Shield className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl font-bold">Sécurité & Stocks</h3>
            <p className="text-[#A0A0B8]">Fini les pertes. Suivi des stocks en temps réel avec alertes anti-vol et casses.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#3A3A5A] px-6 py-12 text-center text-[#A0A0B8] text-sm">
        <p>© 2026 Ivoire Bar VIP. Conçu pour Abidjan & au-delà.</p>
      </footer>
    </div>
  )
}
