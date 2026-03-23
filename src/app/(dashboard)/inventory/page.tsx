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
  Trash2
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center text-foreground font-montserrat">
        <div className="space-y-6 animate-pulse">
          <div className="relative">
             <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
               <Package className="h-8 w-8 text-primary" />
             </div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2">
               <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
             </div>
          </div>
          <p className="text-primary text-xs font-black uppercase tracking-[0.3em] italic">Chargement du Stock...</p>
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 space-y-10 bg-background text-foreground min-h-screen font-montserrat"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
               <Package className="h-4 w-4 text-primary" />
            </div>
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic">Unités de Stockage Cloud</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter italic uppercase leading-none">
            Inventaire <span className="gold-gradient-text">& Stock</span>
          </h1>
          <p className="text-muted-foreground text-base border-l-2 border-primary pl-4 max-w-xl font-medium">
            Supervision centralisée des effectifs liquides. Gestion en temps réel synchronisée avec l'unité <span className="text-foreground italic">Supabase Cloud</span>.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 border-border text-foreground hover:bg-muted font-bold px-6 rounded-xl transition-all">
            <History className="mr-2 h-4 w-4" /> Historique
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white font-black uppercase italic text-[10px] h-12 px-6 hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl flex items-center gap-2 transition-all hover:scale-105">
                <Plus className="h-4 w-4" /> Nouveau Produit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border rounded-3xl p-8 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black uppercase italic gold-gradient-text">Enregistrement <span className="text-foreground">Produit</span></DialogTitle>
                <CardDescription className="font-semibold italic">Déployer une nouvelle unité dans le catalogue Cloud.</CardDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nom de l'Unité</Label>
                  <Input 
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="bg-muted border-border text-foreground h-12 rounded-xl" 
                    placeholder="Bock 66cl" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prix de Vente (F)</Label>
                    <Input 
                      type="number"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      className="bg-muted border-border text-foreground h-12 rounded-xl" 
                      placeholder="1000" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stock Initial</Label>
                    <Input 
                      type="number"
                      value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      className="bg-muted border-border text-foreground h-12 rounded-xl" 
                      placeholder="48" 
                      required 
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full bg-primary text-white font-black uppercase italic h-14 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Déployer dans le Cloud</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Intercepter une référence produit..." 
          className="pl-12 bg-card border-border text-foreground h-14 rounded-2xl text-sm focus:border-primary/30 transition-all shadow-sm" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <CardHeader className="p-8 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-foreground text-2xl font-black uppercase italic">Répertoire <span className="gold-gradient-text">Logistique</span></CardTitle>
              <CardDescription className="text-muted-foreground text-sm font-semibold italic">Suivi des effectifs et valorisation du stock.</CardDescription>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center">
              <Filter className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-primary uppercase text-[9px] font-black tracking-[0.2em] py-8 pl-10">Unité / Catégorie</TableHead>
                  <TableHead className="text-primary uppercase text-[9px] font-black tracking-[0.2em] py-8">Effectif Disponibles</TableHead>
                  <TableHead className="text-primary uppercase text-[9px] font-black tracking-[0.2em] py-8">Valeur de Vente</TableHead>
                  <TableHead className="text-right text-primary uppercase text-[9px] font-black tracking-[0.2em] py-8 pr-10">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredProducts.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={4} className="h-60 text-center py-20">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                           <Package className="h-12 w-12 text-muted-foreground" />
                           <p className="text-sm font-black uppercase text-muted-foreground tracking-widest italic">Aucun produit détecté sous ce protocole</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.map((product, idx) => (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-border hover:bg-muted/30 transition-all group"
                    >
                      <TableCell className="pl-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-muted border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                            <Wine className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-lg font-black text-foreground italic uppercase tracking-tighter leading-none mb-1 group-hover:text-primary transition-colors">{product.name}</p>
                            <Badge variant="outline" className="text-[8px] border-primary/20 text-primary font-black uppercase px-2 py-0 bg-primary/5">{product.category}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center gap-2">
                           <p className="text-xl font-black text-foreground">{product.stock}</p>
                           <span className="text-[10px] text-muted-foreground font-black uppercase italic">unités</span>
                        </div>
                        {product.stock <= 5 && (
                          <p className="text-[8px] text-red-500 font-bold uppercase mt-1 animate-pulse">STOCK CRITIQUE</p>
                        )}
                      </TableCell>
                      <TableCell className="py-6">
                        <p className="text-xl font-black text-primary italic tracking-tight">{product.price.toLocaleString()} F</p>
                      </TableCell>
                      <TableCell className="text-right pr-10 py-6">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/20 transition-all"
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
                            className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-all"
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
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-card border-border rounded-3xl p-8 max-w-md font-montserrat">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic gold-gradient-text">Modification <span className="text-foreground">Unité</span></DialogTitle>
            <CardDescription className="font-semibold italic">Mise à jour des paramètres logistiques dans le Cloud.</CardDescription>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={handleUpdateProduct} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nom du Produit</Label>
                <Input 
                  value={selectedProduct.name}
                  onChange={e => setSelectedProduct({...selectedProduct, name: e.target.value})}
                  className="bg-muted border-border text-foreground h-12 rounded-xl" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prix (F)</Label>
                  <Input 
                    type="number"
                    value={selectedProduct.price}
                    onChange={e => setSelectedProduct({...selectedProduct, price: e.target.value})}
                    className="bg-muted border-border text-foreground h-12 rounded-xl" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stock</Label>
                  <Input 
                    type="number"
                    value={selectedProduct.stock}
                    onChange={e => setSelectedProduct({...selectedProduct, stock: e.target.value})}
                    className="bg-muted border-border text-foreground h-12 rounded-xl" 
                    required 
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full bg-primary text-white font-black uppercase italic h-14 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Appliquer les Modifications</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
