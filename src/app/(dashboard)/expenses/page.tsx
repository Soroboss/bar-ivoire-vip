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
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
             <Wallet className="h-8 w-8 text-blue-600" />
           </div>
           <p className="text-sm font-medium text-slate-500">Chargement de la trésorerie...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-blue-600 rounded-full" />
            <p className="subheading text-blue-600">Flux financiers</p>
          </div>
          <h1 className="heading-xl">Trésorerie & Dépenses</h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
            Suivez vos dépenses opérationnelles et gardez un œil sur votre rentabilité nette après charges.
          </p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger>
            <Button className="bg-blue-600 text-white font-bold h-12 px-8 hover:bg-blue-700 shadow-lg shadow-blue-100 rounded-xl flex items-center gap-2 transition-all">
              <Plus className="h-4 w-4" /> Nouvelle dépense
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-none rounded-2xl p-8 max-w-md shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Nouvelle Sortie</DialogTitle>
              <CardDescription>Enregistrez une charge dans le système.</CardDescription>
            </DialogHeader>
            <div className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Catégorie</Label>
                <Select value={category} onValueChange={(val) => setCategory(val || '')}>
                  <SelectTrigger className="bg-slate-50 border-slate-100 h-12 rounded-xl px-4 focus:ring-blue-100 transition-all font-bold">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none rounded-xl shadow-2xl">
                    <SelectItem value="Loyer" className="font-bold">Loyer & Charges</SelectItem>
                    <SelectItem value="Electricité" className="font-bold">Électricité / Eau</SelectItem>
                    <SelectItem value="Stock" className="font-bold">Achat de Stock</SelectItem>
                    <SelectItem value="Marketing" className="font-bold">Marketing</SelectItem>
                    <SelectItem value="Maintenance" className="font-bold">Maintenance</SelectItem>
                    <SelectItem value="Autre" className="font-bold">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Description</Label>
                <Input 
                  placeholder="Ex: Facture CIE Mars" 
                  className="bg-slate-50 border-slate-100 h-12 rounded-xl px-4 focus:ring-blue-100 transition-all font-bold"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-400">Montant (F)</Label>
                  <Input 
                    type="number" 
                    placeholder="25000" 
                    className="bg-slate-50 border-slate-100 h-12 rounded-xl px-4 font-bold"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-400">Date</Label>
                  <Input 
                    type="date" 
                    className="bg-slate-50 border-slate-100 h-12 rounded-xl px-4 font-bold"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button 
                  className="w-full bg-blue-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-100"
                  disabled={isSubmitting}
                  onClick={handleAddExpense}
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Enregistrer la dépense"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Total sorties', value: `${totalSpent.toLocaleString()} F`, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
          { label: 'Indice liquidité', value: `${balance.toLocaleString()} F`, icon: Wallet, color: balance < 50000 ? "text-orange-600" : "text-emerald-600", bg: "bg-emerald-50" },
          { label: 'Dernière catégorie', value: expenses?.[0]?.category || "N/A", icon: History, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((stat, i) => (
          <Card key={i} className="premium-card rounded-2xl overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className={cn(
                    "h-14 w-14 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm",
                    stat.bg, stat.color
                )}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="premium-card rounded-2xl overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Journal Financier</h2>
              <p className="text-xs font-medium text-slate-500 mt-1">Audit complet de vos flux de trésorerie.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {!expenses || expenses.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-slate-50 border-2 border-dashed border-slate-100 rounded-2xl">
                 <Receipt className="h-12 w-12 text-slate-300 mx-auto" />
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Aucune transaction enregistrée</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {expenses.map((exp: any, idx: number) => (
                  <motion.div 
                    key={exp.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-6 rounded-xl bg-white border border-slate-100 hover:bg-slate-50/50 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <Zap className="h-6 w-6 opacity-40 group-hover:opacity-100" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none mb-1">{exp.category}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{exp.description || 'Charge Standard'}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-8">
                      <div>
                        <p className="text-lg font-bold text-red-600 leading-none mb-1">-{Number(exp.amount).toLocaleString()} F</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(exp.date), 'dd MMM yyyy', { locale: fr })}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-4 w-4" />
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
