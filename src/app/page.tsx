'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, Star, Shield, Smartphone, BarChart3, MessageCircle, 
  Package, Check, Wine, Zap, Crown, Building2, ChevronRight
} from 'lucide-react'

const features = [
  { icon: Smartphone, title: 'Caisse Tactile', desc: 'Prenez des commandes sur tablette ou téléphone. Paiement Mobile Money et espèces.' },
  { icon: Package, title: 'Gestion de Stock', desc: 'Suivi en temps réel, alertes de rupture automatiques. Fini les pertes invisibles.' },
  { icon: Star, title: 'Fidélité VIP', desc: 'Transformez vos clients en habitués. Système de points et récompenses automatisé.' },
  { icon: BarChart3, title: 'Rapports Financiers', desc: 'Chiffre d\'affaires, bénéfice net et dépenses en un coup d\'œil. Export PDF/Excel.' },
  { icon: MessageCircle, title: 'Marketing WhatsApp', desc: 'Envoyez des promos ciblées à vos clients directement sur WhatsApp. +40% de retours.' },
  { icon: Shield, title: 'Sécurité Totale', desc: 'Données chiffrées, accès par rôle (Gérant, Caissier, Serveur). Audit complet.' },
]

const plans = [
  {
    name: 'Starter',
    price: '15 000',
    period: '/mois',
    desc: 'Idéal pour démarrer votre digitalisation',
    color: 'from-blue-500 to-blue-600',
    badge: '',
    features: [
      'Caisse tactile (POS)',
      'Gestion de stock basique',
      'Jusqu\'à 50 produits',
      '1 utilisateur',
      'Rapports mensuels',
      'Support par email',
    ],
    cta: 'Commencer',
    slug: 'starter',
  },
  {
    name: 'Business',
    price: '35 000',
    period: '/mois',
    desc: 'Pour les bars et maquis en croissance',
    color: 'from-[#D4AF37] to-[#A68226]',
    badge: 'POPULAIRE',
    features: [
      'Tout le plan Starter +',
      'Stock illimité',
      'Module Fidélité VIP',
      'Jusqu\'à 5 utilisateurs',
      'Marketing WhatsApp',
      'Rapports en temps réel',
      'Support prioritaire',
    ],
    cta: 'Choisir Business',
    slug: 'business',
  },
  {
    name: 'VIP Premium',
    price: '75 000',
    period: '/mois',
    desc: 'L\'excellence pour les lounges haut de gamme',
    color: 'from-purple-500 to-purple-700',
    badge: 'EXCLUSIF',
    features: [
      'Tout le plan Business +',
      'Multi-établissements',
      'Utilisateurs illimités',
      'Dashboard Admin privé',
      'Trésorerie automatique',
      'Factures personnalisées',
      'Account Manager dédié',
      'API & intégrations',
    ],
    cta: 'Devenir VIP',
    slug: 'vip',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white">
      {/* Ambient Light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500 opacity-[0.03] blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#A68226] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:shadow-[#D4AF37]/40 transition-shadow">
              <Wine className="h-5 w-5 text-[#1A1A2E]" />
            </div>
            <span className="text-xl font-black tracking-tight">IVOIRE BAR <span className="text-[#D4AF37]">VIP</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-[#A0A0B8] hover:text-white">Connexion</Button>
            </Link>
            <Link href="#pricing">
              <Button className="bg-[#D4AF37] hover:bg-[#A68226] text-[#1A1A2E] font-bold rounded-xl">
                Démarrer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 py-24 md:py-32 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 mb-8">
          <Zap className="h-3 w-3 text-[#D4AF37]" />
          <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">N°1 en Côte d'Ivoire</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
          Gérez votre bar{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4E4BC]">
            comme un VIP.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-[#A0A0B8] max-w-2xl mx-auto mb-10 leading-relaxed">
          La solution tout-en-un pour les maquis, lounges et caves à vin. 
          Caisse, stock, fidélité et rapports financiers dans une seule plateforme cloud.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="#pricing">
            <Button size="lg" className="bg-[#D4AF37] hover:bg-[#A68226] text-[#1A1A2E] text-lg px-8 py-6 rounded-xl font-bold shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all">
              Créer mon établissement <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-[#3A3A5A] text-white hover:bg-white/5 text-lg px-8 py-6 rounded-xl">
              J'ai déjà un compte
            </Button>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-[#3A3A5A]">
          {['50+ Bars Partenaires', 'Abidjan & San Pedro', '99.9% Uptime', 'Support 24/7'].map(t => (
            <div key={t} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <Check className="h-3 w-3 text-[#D4AF37]" /> <span className="text-[#A0A0B8]">{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-24 bg-[#0A0A15]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Tout ce qu'il faut pour <span className="text-[#D4AF37]">réussir</span>
            </h2>
            <p className="text-[#A0A0B8] text-lg max-w-xl mx-auto">
              Des outils conçus spécifiquement pour les débits de boissons en Afrique de l'Ouest.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#1A1A2E]/50 border border-[#3A3A5A]/50 hover:border-[#D4AF37]/30 transition-all group backdrop-blur-sm">
                <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-[#A0A0B8] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 px-6 py-24 scroll-mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 mb-6">
              <Crown className="h-3 w-3 text-[#D4AF37]" />
              <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">Forfaits & Tarifs</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Choisissez votre <span className="text-[#D4AF37]">forfait</span>
            </h2>
            <p className="text-[#A0A0B8] text-lg max-w-xl mx-auto">
              Démarrez avec l'essai gratuit de 7 jours. Aucune carte bancaire requise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border ${i === 1 ? 'border-[#D4AF37]/50 bg-[#1A1A2E] shadow-2xl shadow-[#D4AF37]/10 scale-[1.02]' : 'border-[#3A3A5A]/50 bg-[#1A1A2E]/50'} p-8 flex flex-col transition-all hover:border-[#D4AF37]/30`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`bg-gradient-to-r ${plan.color} text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg`}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-[#A0A0B8] text-sm mt-1">{plan.desc}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-[#A0A0B8] text-sm ml-1">FCFA{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                      <span className="text-[#A0A0B8]">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/register?plan=${plan.slug}`} className="w-full">
                  <Button className={`w-full py-6 rounded-xl font-bold text-base ${i === 1 ? 'bg-[#D4AF37] hover:bg-[#A68226] text-[#1A1A2E] shadow-lg shadow-[#D4AF37]/20' : 'bg-white/5 hover:bg-white/10 border border-[#3A3A5A] text-white'}`}>
                    {plan.cta} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 px-6 py-24 bg-[#0A0A15]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#A68226] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#D4AF37]/20">
            <Building2 className="h-10 w-10 text-[#1A1A2E]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Prêt à digitaliser votre bar ?
          </h2>
          <p className="text-[#A0A0B8] text-lg mb-8">
            Rejoignez les 50+ établissements qui font confiance à Ivoire Bar VIP pour gérer leur business.
          </p>
          <Link href="#pricing">
            <Button size="lg" className="bg-[#D4AF37] hover:bg-[#A68226] text-[#1A1A2E] text-lg px-10 py-6 rounded-xl font-bold shadow-lg shadow-[#D4AF37]/20">
              Démarrer maintenant <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#A68226] flex items-center justify-center">
              <Wine className="h-4 w-4 text-[#1A1A2E]" />
            </div>
            <span className="text-sm font-bold">IVOIRE BAR VIP</span>
          </div>
          <p className="text-[#3A3A5A] text-xs font-medium uppercase tracking-widest">
            © 2026 Ivoire Tech • Conçu pour Abidjan & au-delà
          </p>
        </div>
      </footer>
    </div>
  )
}
