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
  ArrowRight
} from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/context/AppContext"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"

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
    return <div className="p-6 text-[#A0A0B8]">Chargement de la trésorerie...</div>
  }

  if (!establishment) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Établissement non trouvé</h2>
        <p className="text-[#A0A0B8]">Veuillez vous connecter avec un compte établissement valide.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 bg-[#1A1A2E] text-[#F4E4BC] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#D4AF37]">Gestion des Dépenses</h1>
          <p className="text-[#A0A0B8]">Suivi en temps réel des charges de {establishment.name}.</p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#D4AF37] text-[#1A1A2E] font-bold hover:bg-[#B8962E] transition-all">
              <Plus className="h-4 w-4 mr-2" /> Nouvelle Dépense
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A2E] border-[#3A3A5A] text-white">
            <DialogHeader>
              <DialogTitle className="text-[#D4AF37]">Enregistrer une dépense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={category} onValueChange={(val: string) => setCategory(val)}>
                  <SelectTrigger className="bg-[#0F0F1A] border-[#3A3A5A]">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A2E] border-[#3A3A5A] text-white">
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
                <Label>Description</Label>
                <Input 
                  placeholder="Ex: Facture CIE Mars 2024" 
                  className="bg-[#0F0F1A] border-[#3A3A5A]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Montant (F CFA)</Label>
                  <Input 
                    type="number" 
                    placeholder="25000" 
                    className="bg-[#0F0F1A] border-[#3A3A5A]"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    className="bg-[#0F0F1A] border-[#3A3A5A]"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                className="w-full bg-[#D4AF37] text-[#1A1A2E] font-bold mt-4"
                disabled={isSubmitting}
                onClick={handleAddExpense}
              >
                {isSubmitting ? "Enregistrement..." : "Confirmer la transaction"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-[#252545] border-[#3A3A5A] shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingDown className="h-24 w-24" />
          </div>
          <CardHeader>
            <CardDescription className="text-[#A0A0B8] uppercase text-[10px] tracking-widest">Total Dépensé</CardDescription>
            <CardTitle className="text-3xl font-bold text-white">{totalSpent.toLocaleString()} F</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-[#252545] border-[#3A3A5A] shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet className="h-24 w-24" />
          </div>
          <CardHeader>
            <CardDescription className="text-[#A0A0B8] uppercase text-[10px] tracking-widest">Budget Restant</CardDescription>
            <CardTitle className={cn("text-3xl font-bold font-bold", balance < 50000 ? "text-red-400" : "text-[#4CAF50]")}>
              {balance.toLocaleString()} F
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-[#252545] border-[#3A3A5A] shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Calendar className="h-24 w-24" />
          </div>
          <CardHeader>
            <CardDescription className="text-[#A0A0B8] uppercase text-[10px] tracking-widest">Dernière Dépense</CardDescription>
            <CardTitle className="text-xl font-bold text-white">
              {expenses && expenses.length > 0 ? expenses[0].category : "Aucune"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-[#252545] border-[#3A3A5A] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Historique des Transactions</CardTitle>
            <CardDescription className="text-[#A0A0B8]">Journal détaillé des sorties de caisse.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-[#A0A0B8] hover:text-white"><Filter className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="text-[#A0A0B8] hover:text-white"><Search className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!expenses || expenses.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="h-16 w-16 bg-[#1A1A2E] rounded-full flex items-center justify-center mx-auto border border-[#3A3A5A]">
                  <ArrowRight className="h-8 w-8 text-[#3A3A5A] -rotate-45" />
                </div>
                <p className="text-[#A0A0B8]">Commencez à suivre vos dépenses pour voir l'historique ici.</p>
              </div>
            ) : (
              expenses.map((exp: any) => (
                <div 
                  key={exp.id} 
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#1A1A2E]/50 border border-[#3A3A5A]/30 hover:bg-[#1A1A2E] hover:border-[#D4AF37]/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">{exp.category}</p>
                      <p className="text-xs text-[#A0A0B8]">{exp.description || 'Pas de description'}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div>
                      <p className="font-bold text-red-400">-{Number(exp.amount).toLocaleString()} F</p>
                      <p className="text-[10px] text-[#A0A0B8] uppercase">{format(new Date(exp.date), 'dd MMM yyyy', { locale: fr })}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-[#3A3A5A] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
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
