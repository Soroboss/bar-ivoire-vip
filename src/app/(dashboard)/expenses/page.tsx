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
  Receipt,
  Zap,
  History
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
      toast.success("Transaction enregistrée sur le cloud")
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSpent = (expenses || []).reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  const budget = 1500000 
  const balance = budget - totalSpent

  if (contextLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="space-y-6 animate-pulse">
           <div className="h-24 w-24 rounded-[2rem] bg-white/5 flex items-center justify-center mx-auto border border-white/10 shadow-2xl">
             <Wallet className="h-10 w-10 text-primary" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Audit de la trésorerie cloud...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <p className="subheading text-primary font-black uppercase tracking-widest text-[10px]">Flux financiers</p>
          </div>
          <h1 className="heading-xl tracking-tighter uppercase font-black">Trésorerie & Dépenses</h1>
          <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">
            Suivez vos dépenses opérationnelles et gardez un œil sur votre rentabilité nette après charges.
          </p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger>
            <Button className="bg-primary text-primary-foreground font-black h-16 px-10 rounded-2xl shadow-2xl shadow-primary/20 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-[10px]">
              <Plus className="h-5 w-5" /> Nouvelle dépense elite
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/90 border border-white/10 rounded-[2.5rem] p-10 max-w-md shadow-2xl backdrop-blur-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">Nouvelle Sortie</DialogTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Enregistrez une charge stratégique dans le système.</CardDescription>
            </DialogHeader>
            <div className="space-y-6 mt-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest ml-1">Catégorie</Label>
                <Select value={category} onValueChange={(val) => setCategory(val || '')}>
                  <SelectTrigger className="bg-white/5 border-white/5 h-14 rounded-xl px-4 focus:ring-primary/20 transition-all font-black text-white uppercase tracking-tight">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-white/10 rounded-2xl shadow-2xl">
                    <SelectItem value="Loyer" className="font-black text-[10px] uppercase tracking-widest py-3 focus:bg-primary/20">Loyer & Charges</SelectItem>
                    <SelectItem value="Electricité" className="font-black text-[10px] uppercase tracking-widest py-3 focus:bg-primary/20">Électricité / Eau</SelectItem>
                    <SelectItem value="Stock" className="font-black text-[10px] uppercase tracking-widest py-3 focus:bg-primary/20">Achat de Stock</SelectItem>
                    <SelectItem value="Marketing" className="font-black text-[10px] uppercase tracking-widest py-3 focus:bg-primary/20">Marketing</SelectItem>
                    <SelectItem value="Maintenance" className="font-black text-[10px] uppercase tracking-widest py-3 focus:bg-primary/20">Maintenance</SelectItem>
                    <SelectItem value="Autre" className="font-black text-[10px] uppercase tracking-widest py-3 focus:bg-primary/20">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest ml-1">Description</Label>
                <Input 
                  placeholder="Ex: Facture CIE Mars" 
                  className="bg-white/5 border-white/5 h-14 rounded-xl px-4 focus:ring-primary/20 transition-all font-black text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest ml-1">Montant (F)</Label>
                  <Input 
                    type="number" 
                    placeholder="25000" 
                    className="bg-white/5 border-white/5 h-14 rounded-xl px-4 font-black text-white"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest ml-1">Date</Label>
                  <Input 
                    type="date" 
                    className="bg-white/5 border-white/5 h-14 rounded-xl px-4 font-black text-white"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="pt-6">
                <Button 
                  className="w-full bg-primary text-primary-foreground font-black h-16 rounded-2xl shadow-2xl shadow-primary/30 uppercase tracking-widest text-[10px]"
                  disabled={isSubmitting}
                  onClick={handleAddExpense}
                >
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin mr-3" /> : "Valider la transaction"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Total sorties', value: `${totalSpent.toLocaleString()} F`, icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" },
          { label: 'Solde opé.', value: `${balance.toLocaleString()} F`, icon: Wallet, color: balance < 50000 ? "text-orange-400" : "text-primary", bg: "bg-primary/10" },
          { label: 'Dernière charge', value: expenses?.[0]?.category || "N/A", icon: Zap, color: "text-white", bg: "bg-white/10" },
        ].map((stat, i) => (
          <Card key={i} className="premium-card rounded-2xl overflow-hidden group border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 border border-white/5 shadow-2xl",
                    stat.bg, stat.color
                )}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                  <p className="text-2xl font-black text-white leading-none tracking-tight">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="premium-card rounded-[2.5rem] overflow-hidden border border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl">
        <CardHeader className="p-10 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Journal Financier</h2>
              <p className="text-xs font-medium text-muted-foreground mt-1">Audit complet de vos flux de trésorerie.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-10">
          <div className="space-y-4">
            {!expenses || expenses.length === 0 ? (
              <div className="py-24 text-center space-y-6 bg-white/[0.02] border border-white/5 rounded-[2rem] border-dashed">
                 <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                   <Receipt className="h-10 w-10 text-muted-foreground/20" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 leading-loose mx-10">La caisse est sereine — Aucune sortie détectée</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {expenses.map((exp: any, idx: number) => (
                  <motion.div 
                    key={exp.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-7 rounded-[1.8rem] bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-primary/5 hover:shadow-2xl transition-all duration-500 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl group-hover:shadow-primary/40 group-hover:-rotate-6">
                        <Zap className="h-7 w-7" />
                      </div>
                      <div className="">
                        <p className="font-black text-white text-lg leading-none mb-2 uppercase tracking-tighter">{exp.category}</p>
                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">{exp.description || 'Charge Standard'}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-8">
                      <div>
                        <p className="text-xl font-black text-red-500 leading-none mb-2 tracking-tighter">-{Number(exp.amount).toLocaleString()} F</p>
                        <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">{format(new Date(exp.date), 'dd MMM yyyy', { locale: fr })}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100">
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
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
