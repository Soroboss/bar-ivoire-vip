'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Crown, 
  Zap, 
  Star, 
  Package, 
  Check, 
  Edit3, 
  Save, 
  X,
  Plus,
  RefreshCw,
  Info,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { saasService } from '@/services/saasService'
import { Plan } from '@/types'
import { toast } from 'sonner'

export default function AdminPlansPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<Plan>>({})

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      setLoading(true)
      const data = await saasService.getPlans()
      setPlans(data)
    } catch (error) {
      toast.error('Erreur lors du chargement des forfaits')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (plan: Plan) => {
    setEditingId(plan.id)
    setEditValues(plan)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  const handleSave = async (planId: string) => {
    try {
      await saasService.updatePlan(planId, editValues)
      toast.success('Forfait mis à jour avec succès')
      setEditingId(null)
      loadPlans()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
            <Crown className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Offres & Stratégie</span>
          </div>
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/admin/dashboard')}
              className="h-14 w-14 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all flex-shrink-0"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
              Gestion des <span className="gold-gradient-text">Forfaits</span>
            </h1>
          </div>
          <p className="text-muted-foreground/60 text-sm max-w-xl font-medium leading-relaxed">
            Configurez les prix, descriptions et avantages. Les modifications sont appliquées instantanément sur la Landing Page publique.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-14 px-8 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all">
            <Plus className="mr-2 h-4 w-4" /> Nouveau Forfait
          </Button>
        </div>
      </header>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const isEditing = editingId === plan.id
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "relative group overflow-hidden bg-sidebar/40 border-white/5 p-8 h-full flex flex-col transition-all duration-500",
                "hover:border-primary/30 hover:shadow-[0_0_50px_rgba(212,175,55,0.05)]",
                isEditing && "border-primary/50 shadow-[0_0_50px_rgba(212,175,55,0.1)] ring-1 ring-primary/20"
              )}>
                {/* Visual Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 pointer-events-none ${
                    index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-primary' : 'bg-purple-500'
                }`} />

                {/* Badge/Icon */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {index === 0 ? <Zap className="h-6 w-6 text-blue-400" /> : 
                     index === 1 ? <Star className="h-6 w-6 text-primary" /> : 
                     <Package className="h-6 w-6 text-purple-400" />}
                  </div>
                  {plan.color_badge && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                      {plan.color_badge}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-6 flex-1 relative z-10">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 pl-1">Nom du Forfait</label>
                        <Input 
                          value={editValues.name} 
                          onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                          className="bg-white/5 border-white/10 text-white font-black h-12 rounded-xl focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 pl-1">Prix (FCFA / mois)</label>
                        <Input 
                          type="number"
                          value={editValues.price} 
                          onChange={(e) => setEditValues({...editValues, price: Number(e.target.value)})}
                          className="bg-white/5 border-white/10 text-white font-black h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 pl-1">Jours d'Essai</label>
                        <Input 
                          type="number"
                          value={editValues.trial_days} 
                          onChange={(e) => setEditValues({...editValues, trial_days: Number(e.target.value)})}
                          className="bg-white/5 border-white/10 text-white font-black h-12 rounded-xl"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{plan.name}</h3>
                      <div className="flex items-baseline mt-2 gap-2">
                        <span className="text-3xl font-black text-white">{(plan.price || 0).toLocaleString()}</span>
                        <span className="text-muted-foreground/40 text-xs font-bold uppercase tracking-widest">FCFA / mois</span>
                      </div>
                      <p className="text-sm text-muted-foreground/60 mt-4 leading-relaxed font-medium">
                        {plan.description}
                      </p>
                    </div>
                  )}

                  {/* Features List */}
                  <div className="pt-6 border-t border-white/5 space-y-3">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Fonctionnalités Incluses</p>
                    {plan.features.slice(0, 5).map((feature, fIdx) => (
                       <div key={fIdx} className="flex items-center gap-3 text-xs text-muted-foreground/50 font-medium">
                         <div className="h-1.5 w-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                         {feature}
                       </div>
                    ))}
                    {plan.features.length > 5 && (
                      <p className="text-[9px] text-muted-foreground/30 font-bold uppercase pl-4">+{plan.features.length - 5} autres...</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-10 pt-8 border-t border-white/5 flex gap-3 relative z-10">
                  {isEditing ? (
                    <>
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/80 text-black font-black text-[10px] uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-primary/10"
                        onClick={() => handleSave(plan.id)}
                      >
                        <Save className="mr-2 h-4 w-4" /> Enregistrer
                      </Button>
                      <Button 
                        variant="ghost"
                        className="flex-1 text-white/30 hover:text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-widest h-12 rounded-xl"
                        onClick={handleCancel}
                      >
                        <X className="mr-2 h-4 w-4" /> Annuler
                      </Button>
                    </>
                  ) : (
                    <Button 
                      className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black text-[10px] uppercase tracking-widest h-12 rounded-xl transition-all group/btn"
                      onClick={() => handleEdit(plan)}
                    >
                      <Edit3 className="mr-2 h-4 w-4 group-hover/btn:text-primary transition-colors" /> Configurer le Forfait
                    </Button>
                  )}
                </div>

                {/* Trial Info Footer */}
                <div className="mt-4 flex items-center justify-between text-[9px] text-muted-foreground/20 font-black uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Essai: {plan.trial_days} Jours</span>
                  <span>ID: {plan.slug}</span>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
