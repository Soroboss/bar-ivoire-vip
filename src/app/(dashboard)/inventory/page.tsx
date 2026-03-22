'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Plus, 
  Search, 
  Filter, 
  History,
  Wine,
  Trash2,
  Edit2
} from "lucide-react"
import { useAppContext } from '@/context/AppContext'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function InventoryPage() {
  const { products, addProduct, loading } = useAppContext()
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Bières', price: '', stock: '' })

  if (loading) {
    return (
      <div className="p-6 h-screen bg-[#1A1A2E] flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addProduct({
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        unit: 'Bouteille'
      })
      setNewProduct({ name: '', category: 'Bières', price: '', stock: '' })
      setIsAddOpen(false)
    } catch (e) {
      // toast in context
    }
  }

  return (
    <div className="p-6 space-y-8 bg-[#1A1A2E] text-[#F4E4BC] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#D4AF37]">Inventaire & <span className="text-white">Stock Cloud</span></h1>
          <p className="text-[#A0A0B8]">Gestion centralisée sur Supabase.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#3A3A5A] text-[#A0A0B8]">
            <History className="mr-2 h-4 w-4" /> Historique
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#D4AF37] text-[#1A1A2E] hover:bg-[#A68226]">
                <Plus className="mr-2 h-4 w-4" /> Nouveau Produit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#252545] border-[#3A3A5A] text-[#F4E4BC]">
              <DialogHeader>
                <DialogTitle className="text-[#D4AF37]">Ajouter un produit</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom du produit</Label>
                  <Input 
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="bg-[#1A1A2E] border-[#3A3A5A] text-white" 
                    placeholder="Bock 66cl" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prix de vente (F)</Label>
                    <Input 
                      type="number"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      className="bg-[#1A1A2E] border-[#3A3A5A] text-white" 
                      placeholder="1000" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock Initial</Label>
                    <Input 
                      type="number"
                      value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      className="bg-[#1A1A2E] border-[#3A3A5A] text-white" 
                      placeholder="48" 
                      required 
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="submit" className="bg-[#D4AF37] text-[#1A1A2E]">Enregistrer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
          <Input 
            placeholder="Rechercher un produit..." 
            className="pl-10 bg-[#252545] border-[#3A3A5A] text-[#F4E4BC]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-[#252545] border-[#3A3A5A]">
        <Table>
          <TableHeader className="border-b border-[#3A3A5A]">
            <TableRow className="hover:bg-transparent border-b-[#3A3A5A]">
              <TableHead className="text-[#A0A0B8]">Produit</TableHead>
              <TableHead className="text-[#A0A0B8]">Stock</TableHead>
              <TableHead className="text-[#A0A0B8]">Prix</TableHead>
              <TableHead className="text-[#A0A0B8] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
               <TableRow><TableCell colSpan={4} className="text-center py-10 text-[#A0A0B8]">Aucun produit trouvé.</TableCell></TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-b-[#3A3A5A] hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#1A1A2E] flex items-center justify-center text-[#D4AF37]">
                        <Wine className="h-5 w-5" />
                      </div>
                      <div>
                        <p>{product.name}</p>
                        <p className="text-[10px] text-[#A0A0B8]">{product.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-bold">{product.stock}</TableCell>
                  <TableCell className="text-[#D4AF37] font-bold">{product.price.toLocaleString()} F</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-[#A0A0B8]"><Edit2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
