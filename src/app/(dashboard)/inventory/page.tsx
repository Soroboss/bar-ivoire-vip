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
  History,
  Wine,
  Edit2,
  Package,
  Loader2,
  Filter,
  Trash2,
  Layers
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
import { motion, AnimatePresence } from 'framer-motion'

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useAppContext()
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Bières', price: '', stock: '' })
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
             <Package className="h-8 w-8 text-blue-600" />
           </div>
           <p className="text-sm font-medium text-slate-500">Chargement de l'inventaire...</p>
        </div>
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
    } catch (e) {}
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    try {
      await updateProduct(selectedProduct.id, {
        name: selectedProduct.name,
        category: selectedProduct.category,
        price: Number(selectedProduct.price),
        stock: Number(selectedProduct.stock)
      })
      setIsEditOpen(false)
    } catch (e) {}
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await deleteProduct(id)
    }
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-blue-600 rounded-full" />
            <p className="subheading text-blue-600">Gestion des stocks</p>
          </div>
          <h1 className="heading-xl">Inventaire</h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
            Gérez vos références produits, ajustez vos prix et suivez vos niveaux de stock en temps réel pour éviter les ruptures.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-6 rounded-xl transition-all">
            <History className="mr-2 h-4 w-4" /> Historique
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger>
              <Button className="bg-blue-600 text-white font-bold h-12 px-8 hover:bg-blue-700 shadow-lg shadow-blue-100 rounded-xl flex items-center gap-2 transition-all">
                <Plus className="h-4 w-4" /> Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-none rounded-2xl p-8 max-w-md shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Nouveau Produit</DialogTitle>
                <CardDescription>Remplissez les informations ci-dessous.</CardDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-400">Nom du produit</Label>
                  <Input 
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="bg-slate-50 border-slate-100 h-12 rounded-xl px-4 focus:ring-blue-100 transition-all" 
                    placeholder="Ex: Heineken 33cl" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400">Prix (F)</Label>
                    <Input 
                      type="number"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      className="bg-slate-50 border-slate-100 h-12 rounded-xl px-4" 
                      placeholder="1000" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400">Stock</Label>
                    <Input 
                      type="number"
                      value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      className="bg-slate-50 border-slate-100 h-12 rounded-xl px-4" 
                      placeholder="48" 
                      required 
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full bg-blue-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-100">Enregistrer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input 
          placeholder="Rechercher une référence..." 
          className="pl-12 bg-white border-slate-200 h-12 rounded-xl text-sm focus:ring-blue-100 transition-all shadow-sm" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Card className="premium-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="py-6 pl-8 text-xs font-bold uppercase text-slate-400">Produit</TableHead>
                <TableHead className="py-6 text-xs font-bold uppercase text-slate-400">Stock</TableHead>
                <TableHead className="py-6 text-xs font-bold uppercase text-slate-400">Prix</TableHead>
                <TableHead className="text-right py-6 pr-8 text-xs font-bold uppercase text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredProducts.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="h-64 text-center py-20">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                         <Package className="h-12 w-12 text-slate-400" />
                         <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Aucun produit trouvé</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.map((product, idx) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-slate-50 hover:bg-slate-50/50 transition-all group"
                  >
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                          <Wine className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{product.name}</p>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{product.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex items-center gap-2">
                         <p className="text-lg font-bold text-slate-900">{product.stock}</p>
                         <span className="text-[10px] text-slate-400 font-bold uppercase">Unités</span>
                      </div>
                      {product.stock <= 5 && (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 text-[8px] mt-1 uppercase font-bold px-2 py-0">Critique</Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-5">
                      <p className="text-lg font-bold text-blue-600">{product.price.toLocaleString()} F</p>
                    </TableCell>
                    <TableCell className="text-right pr-8 py-5">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          onClick={() => {
                            setSelectedProduct(product)
                            setIsEditOpen(true)
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white border-none rounded-2xl p-8 max-w-md shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Modifier le produit</DialogTitle>
            <CardDescription>Mettez à jour les informations du stock.</CardDescription>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={handleUpdateProduct} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Désignation</Label>
                <Input 
                  value={selectedProduct.name}
                  onChange={e => setSelectedProduct({...selectedProduct, name: e.target.value})}
                  className="bg-slate-50 border-slate-100 h-12 rounded-xl px-4" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-400">Prix (F)</Label>
                  <Input 
                    type="number"
                    value={selectedProduct.price}
                    onChange={e => setSelectedProduct({...selectedProduct, price: e.target.value})}
                    className="bg-slate-50 border-slate-100 h-12 rounded-xl px-4" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-400">Stock</Label>
                  <Input 
                    type="number"
                    value={selectedProduct.stock}
                    onChange={e => setSelectedProduct({...selectedProduct, stock: e.target.value})}
                    className="bg-slate-50 border-slate-100 h-12 rounded-xl px-4" 
                    required 
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full bg-blue-600 text-white font-bold h-12 rounded-xl">Enregistrer les modifications</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
