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
           <div className="h-20 w-20 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto shadow-sm">
             <Wallet className="h-10 w-10 text-primary" />
           </div>
           <p className="subheading">Analyse de la Trésorerie en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
               <Wallet className="h-4 w-4 text-primary" />
            </div>
            <p className="subheading">Contrôle des Flux Financiers</p>
          </div>
          <h1 className="heading-xl">Trésorerie <span className="gold-gradient-text">& Dépenses</span></h1>
          <p className="text-muted-foreground font-semibold italic border-l-2 border-primary pl-4 py-1 leading-relaxed max-w-2xl">
            Surveillance des sorties de caisse et rationalisation de la trésorerie. Journalisation cryptée via <span className="text-foreground font-black italic">Supabase Cloud Vault</span>.
          </p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white font-black uppercase italic text-[10px] h-12 px-8 hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl flex items-center gap-2 transition-all hover:scale-105">
              <Plus className="h-4 w-4" /> Nouvelle Sortie
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-none ring-1 ring-border rounded-[2.5rem] p-10 max-w-md shadow-2xl">
            <DialogHeader>
              <DialogTitle className="heading-lg">Flux <span className="gold-gradient-text">Négatif</span></DialogTitle>
              <CardDescription className="font-semibold italic">Journaliser une nouvelle sortie de caisse dans le système.</CardDescription>
            </DialogHeader>
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label className="subheading">Catégorie de Charge</Label>
                <Select value={category} onValueChange={(val) => setCategory(val)}>
                  <SelectTrigger className="bg-muted border-none ring-1 ring-border text-foreground h-14 rounded-2xl px-6 focus:ring-primary/40 transition-all font-bold">
                    <SelectValue placeholder="Pointer une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none ring-1 ring-border rounded-2xl shadow-2xl">
                    <SelectItem value="Loyer" className="font-bold italic uppercase text-[10px]">Loyer & Charges</SelectItem>
                    <SelectItem value="Electricité" className="font-bold italic uppercase text-[10px]">Électricité / Eau</SelectItem>
                    <SelectItem value="Stock" className="font-bold italic uppercase text-[10px]">Achat de Stock</SelectItem>
                    <SelectItem value="Marketing" className="font-bold italic uppercase text-[10px]">Marketing / Publicité</SelectItem>
                    <SelectItem value="Maintenance" className="font-bold italic uppercase text-[10px]">Maintenance</SelectItem>
                    <SelectItem value="Autre" className="font-bold italic uppercase text-[10px]">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="subheading">Justification / Libellé</Label>
                <Input 
                  placeholder="Ex: Facture CIE Mars 2024" 
                  className="bg-muted border-none ring-1 ring-border text-foreground h-14 rounded-2xl px-6 focus:ring-primary/40 transition-all font-bold"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="subheading">Masse (F CFA)</Label>
                  <Input 
                    type="number" 
                    placeholder="25000" 
                    className="bg-muted border-none ring-1 ring-border text-foreground h-14 rounded-2xl px-6 font-bold"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="subheading">Datation</Label>
                  <Input 
                    type="date" 
                    className="bg-muted border-none ring-1 ring-border text-foreground h-14 rounded-2xl px-6 font-bold"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="pt-6">
                <Button 
                  className="w-full bg-primary text-white font-black uppercase italic h-16 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                  disabled={isSubmitting}
                  onClick={handleAddExpense}
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : "EXPÉDIER LA TRANSACTION"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {[
          { label: 'Flux Sortant (Période)', value: `${totalSpent.toLocaleString()} F`, icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/5", ring: "ring-red-500/10" },
          { label: 'Indice de Liquidité', value: `${balance.toLocaleString()} F`, icon: Wallet, color: balance < 50000 ? "text-orange-500" : "text-emerald-500", bg: "bg-emerald-500/5", ring: "ring-emerald-500/10" },
          { label: 'Dernier Libellé Cloud', value: expenses?.[0]?.category || "N/A", icon: History, color: "text-primary", bg: "bg-primary/5", ring: "ring-primary/10" },
        ].map((stat, i) => (
          <Card key={i} className="premium-card border-none ring-1 ring-border rounded-[2.5rem] overflow-hidden shadow-sm group hover:ring-primary/40 transition-all duration-700">
            <CardContent className="p-10">
              <div className="flex items-center gap-8">
                <div className={cn(
                    "h-16 w-16 rounded-[1.5rem] flex items-center justify-center border transition-all duration-700 group-hover:scale-110 group-hover:bg-white group-hover:shadow-2xl",
                    stat.bg, stat.color, stat.ring
                )}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="subheading text-muted-foreground/60">{stat.label}</p>
                  <p className="text-3xl font-black text-foreground italic tracking-tighter leading-none">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="premium-card border-none ring-1 ring-border rounded-[3rem] overflow-hidden shadow-sm">
        <CardHeader className="p-10 border-b border-border/50 bg-muted/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="heading-lg">Journal <span className="gold-gradient-text">Financier</span></h2>
              <p className="subheading mt-2">Audit cryptographique des flux de sortie.</p>
            </div>
            <div className="flex gap-4">
               <div className="h-12 w-12 bg-white ring-1 ring-border rounded-2xl flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Filter className="h-5 w-5" />
               </div>
               <div className="h-12 w-12 bg-white ring-1 ring-border rounded-2xl flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Search className="h-5 w-5" />
               </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-10">
          <div className="space-y-6">
            {!expenses || expenses.length === 0 ? (
              <div className="py-24 text-center space-y-6 bg-muted/20 border-2 border-dashed border-border rounded-[2.5rem]">
                 <Receipt className="h-20 w-20 text-muted-foreground opacity-10 mx-auto" />
                 <p className="subheading opacity-30">Aucun signal transactionnel capté</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {expenses.map((exp: any, idx: number) => (
                  <motion.div 
                    key={exp.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-8 rounded-[2rem] bg-white ring-1 ring-border hover:ring-primary/20 hover:bg-primary/[0.01] hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group"
                  >
                    <div className="flex items-center gap-8">
                      <div className="h-16 w-16 rounded-[1.25rem] bg-muted/40 border border-border flex items-center justify-center text-primary group-hover:bg-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
                        <Zap className="h-7 w-7 opacity-30 group-hover:opacity-100" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-foreground uppercase italic tracking-tighter leading-none mb-2 group-hover:text-primary transition-colors">{exp.category}</p>
                        <p className="text-[10px] font-black uppercase text-muted-foreground/30 tracking-[0.2em] italic">{exp.description || 'Protocole Standard'}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-12">
                      <div>
                        <p className="text-2xl font-black text-red-500 italic tracking-tight leading-none mb-2">-{Number(exp.amount).toLocaleString()} F</p>
                        <div className="flex items-center justify-end gap-2 text-muted-foreground/40">
                          <Calendar className="h-3 w-3" />
                          <p className="text-[10px] font-black uppercase tracking-widest">{format(new Date(exp.date), 'dd MMM yyyy', { locale: fr })}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground/20 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-200 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100">
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
