'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingDown, 
  Wallet, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Loader2,
  TrendingUp,
  Receipt
} from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/context/AppContext"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { motion, AnimatePresence } from 'framer-motion'

export default function ExpensesPage() {
  const { establishment, loading: contextLoading, expenses, addExpense } = useAppContext()
  const [showAddDialog, setShowAddDialog] = useState(false)
  
  // Form State
  const [category, setCategory] = useState<string>('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddExpense = async () => {
    if (!category || !amount || !establishment) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }
    
    setIsSubmitting(true)
    try {
      await addExpense({
        category,
        description,
        amount: parseFloat(amount),
        date,
        status: 'Payé'
      })
      setShowAddDialog(false)
      setCategory('')
      setDescription('')
      setAmount('')
      toast.success("Dépense enregistrée avec succès")
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSpent = (expenses || []).reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  const budget = 1500000 // Fixed budget for demo
  const balance = budget - totalSpent

  if (contextLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center text-foreground font-montserrat">
        <div className="space-y-6 animate-pulse">
          <div className="relative">
             <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
               <Wallet className="h-8 w-8 text-primary" />
             </div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2">
               <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
             </div>
          </div>
          <p className="text-primary text-xs font-black uppercase tracking-[0.3em] italic">Analyse de la Trésorerie...</p>
        </div>
      </div>
    )
  }

  if (!establishment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center text-foreground font-montserrat">
        <div className="max-w-md space-y-4">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto opacity-40" />
          <h2 className="text-xl font-bold uppercase italic tracking-tighter">Établissement non trouvé</h2>
          <p className="text-sm text-muted-foreground font-semibold italic">Veuillez vous connecter avec un compte établissement valide pour accéder au flux de trésorerie.</p>
        </div>
      </div>
    )
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
               <Wallet className="h-4 w-4 text-primary" />
            </div>
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic">Gestion des Flux</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter italic uppercase leading-none">
            Trésorerie <span className="gold-gradient-text">& Dépenses</span>
          </h1>
          <p className="text-muted-foreground text-base border-l-2 border-primary pl-4 max-w-xl font-medium">
            Suivi des sorties de caisse et rationalisation des charges. Journalisation des flux financiers synchronisée avec <span className="text-foreground italic">Supabase Cloud Vault</span>.
          </p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white font-black uppercase italic text-[10px] h-12 px-6 hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl flex items-center gap-2 transition-all hover:scale-105">
              <Plus className="h-4 w-4" /> Nouvelle Dépense
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border rounded-3xl p-8 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase italic gold-gradient-text">Enregistrement <span className="text-foreground">Flux</span></DialogTitle>
              <CardDescription className="font-semibold italic">Journaliser une nouvelle sortie de caisse dans le Cloud.</CardDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Catégorie</Label>
                <Select value={category} onValueChange={(val) => setCategory(val)}>
                  <SelectTrigger className="bg-muted border-border text-foreground h-12 rounded-xl">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="Loyer">Loyer & Charges</SelectItem>
                    <SelectItem value="Electricité">Électricité / Eau</SelectItem>
                    <SelectItem value="Stock">Achat de Stock</SelectItem>
                    <SelectItem value="Marketing">Marketing / Publicité</SelectItem>
                    <SelectItem value="Maintenance">Maintenance / Réparation</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</Label>
                <Input 
                  placeholder="Ex: Facture CIE Mars 2024" 
                  className="bg-muted border-border text-foreground h-12 rounded-xl"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Montant (F CFA)</Label>
                  <Input 
                    type="number" 
                    placeholder="25000" 
                    className="bg-muted border-border text-foreground h-12 rounded-xl"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</Label>
                  <Input 
                    type="date" 
                    className="bg-muted border-border text-foreground h-12 rounded-xl"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button 
                  className="w-full bg-primary text-white font-black uppercase italic h-14 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                  disabled={isSubmitting}
                  onClick={handleAddExpense}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Confirmer la Transaction"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Total Dépensé (Période)', value: `${totalRevenue.toLocaleString()} F`, icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10" },
          { label: 'Budget de Sécurité', value: `${balance.toLocaleString()} F`, icon: Wallet, color: balance < 50000 ? "text-orange-500" : "text-emerald-500", bg: balance < 50000 ? "bg-orange-500/10" : "bg-emerald-500/10" },
          { label: 'Dernière Sortie Cloud', value: expenses?.[0]?.category || "Aucune", icon: History, color: "text-blue-500", bg: "bg-blue-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border rounded-[2rem] overflow-hidden shadow-sm hover:border-primary/40 transition-all duration-500 group">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border border-current/10 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <CardHeader className="p-8 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black uppercase italic gold-gradient-text leading-none">Journal <span className="text-foreground">Transactionnel</span></CardTitle>
              <CardDescription className="text-sm font-semibold italic mt-1">Audit complet des sorties de caisse et charges opérationnelles.</CardDescription>
            </div>
            <div className="flex gap-2">
               <div className="h-10 w-10 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-center">
                  <Filter className="h-4 w-4 text-primary" />
               </div>
               <div className="h-10 w-10 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-center">
                  <Search className="h-4 w-4 text-primary" />
               </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {!expenses || expenses.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-muted/20 border-2 border-dashed border-border rounded-[2rem]">
                 <Receipt className="h-12 w-12 text-muted-foreground opacity-20 mx-auto" />
                 <p className="text-sm font-black uppercase text-muted-foreground tracking-widest italic">Aucun flux détecté dans le journal</p>
              </div>
            ) : (
              <AnimatePresence>
                {expenses.map((exp: any, idx: number) => (
                  <motion.div 
                    key={exp.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-6 rounded-3xl bg-card border border-border hover:bg-muted/30 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-foreground uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-none mb-1">{exp.category}</p>
                        <p className="text-[10px] text-muted-foreground font-semibold italic">{exp.description || 'Protocole Standard'}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-8">
                      <div>
                        <p className="text-xl font-black text-red-500 italic tracking-tight">-{Number(exp.amount).toLocaleString()} F</p>
                        <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">{format(new Date(exp.date), 'dd MMM yyyy', { locale: fr })}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-11 w-11 text-muted-foreground/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200 opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
