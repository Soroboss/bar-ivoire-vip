'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  Wallet,
  Calendar,
  Tag
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppContext } from '@/context/AppContext'
import { supabaseService } from '@/services/supabaseService'
import { toast } from 'sonner'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExpensesPage() {
  const { establishment, loading: contextLoading } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [expenses, setExpenses] = useState<any[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  
  // Form State
  const [category, setCategory] = useState('Stock')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (establishment) {
      loadExpenses()
    }
  }, [establishment])

  async function loadExpenses() {
    try {
      setLoading(true)
      const data = await supabaseService.getExpenses(establishment!.id)
      setExpenses(data)
    } catch (e) {
      console.error('Error loading expenses:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async () => {
    if (!amount || !description) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    try {
      await supabaseService.addExpense({
        establishment_id: establishment!.id,
        category,
        description,
        amount: Number(amount),
        date
      })
      toast.success('Dépense enregistrée avec succès')
      setShowAddDialog(false)
      loadExpenses()
      // Reset form
      setDescription('')
      setAmount('')
    } catch (e) {
      toast.error('Erreur lors de l\'enregistrement')
    }
  }

  if (contextLoading || !establishment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A2E]">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
      </div>
    )
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <div className="p-6 space-y-8 bg-[#1A1A2E] text-[#F4E4BC] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white italic underline decoration-[#D4AF37]">Suivi des <span className="text-[#D4AF37]">Charges</span></h1>
          <p className="text-[#A0A0B8]">Gérez vos sorties d'argent et calculez votre profit net.</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#D4AF37] text-[#1A1A2E] font-bold">
              <Plus className="h-4 w-4 mr-2" /> Nouvelle Dépense
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A2E] border-[#3A3A5A] text-white">
            <DialogHeader>
              <DialogTitle>Enregistrer une dépense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-[#0F0F1A] border-[#3A3A5A]">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F0F1A] border-[#3A3A5A] text-white">
                    <SelectItem value="Stock">Stock / Boissons</SelectItem>
                    <SelectItem value="Loyer">Loyer</SelectItem>
                    <SelectItem value="Salaires">Salaires Staff</SelectItem>
                    <SelectItem value="Electricité">Electricité / Eau</SelectItem>
                    <SelectItem value="Marketing">Marketing / VIP</SelectItem>
                    <SelectItem value="Autres">Autres Charges</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  placeholder="Ex: Achat pack de bierre" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-[#0F0F1A] border-[#3A3A5A]"
                />
              </div>
              <div className="space-y-2">
                <Label>Montant ({establishment.currency})</Label>
                <Input 
                  type="number"
                  placeholder="5000" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-[#0F0F1A] border-[#3A3A5A]"
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-[#0F0F1A] border-[#3A3A5A]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddExpense} className="w-full bg-[#D4AF37] text-[#1A1A2E]">
                Confirmer la dépense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#252545] border-[#3A3A5A] border-t-4 border-t-red-500">
          <CardContent className="pt-6">
            <p className="text-xs text-[#A0A0B8] uppercase">Total Charges (Mois)</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalExpenses.toLocaleString()} {establishment.currency}</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#252545] border-[#3A3A5A]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Receipt className="h-5 w-5 text-[#D4AF37]" /> Journal des Dépenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
            </div>
          ) : (
            <Table>
              <TableHeader className="border-b border-[#3A3A5A]">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[#A0A0B8]">Date</TableHead>
                  <TableHead className="text-[#A0A0B8]">Catégorie</TableHead>
                  <TableHead className="text-[#A0A0B8]">Description</TableHead>
                  <TableHead className="text-right text-[#A0A0B8]">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id} className="border-b-[#3A3A5A] hover:bg-white/5 transition-colors">
                    <TableCell className="text-white text-sm">
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-red-500/30 text-red-400 text-[10px]">
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{expense.description}</TableCell>
                    <TableCell className="text-right font-bold text-white">
                      {Number(expense.amount).toLocaleString()} F
                    </TableCell>
                  </TableRow>
                ))}
                {expenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-[#3A3A5A]">Aucune dépense enregistrée</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
