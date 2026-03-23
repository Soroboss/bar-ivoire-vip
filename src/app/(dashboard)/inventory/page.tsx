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
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="space-y-6 animate-pulse">
           <div className="h-20 w-20 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto shadow-sm">
             <Package className="h-10 w-10 text-primary" />
           </div>
           <p className="subheading">Initialisation du Répertoire Logistique...</p>
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
               <Layers className="h-4 w-4 text-primary" />
            </div>
            <p className="subheading">Unités de Stockage Mesh Cloud</p>
          </div>
          <h1 className="heading-xl">Inventaire <span className="gold-gradient-text">& Stock</span></h1>
          <p className="text-muted-foreground font-semibold italic border-l-2 border-primary pl-4 py-1 leading-relaxed max-w-2xl">
            Supervision centralisée des effectifs liquides. Gestion en temps réel synchronisée avec l'unité <span className="text-foreground font-black italic">Supabase Cluster</span>.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 border-border text-foreground hover:bg-muted font-bold px-6 rounded-2xl transition-all shadow-sm">
            <History className="mr-2 h-4 w-4" /> Journal Cloud
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white font-black uppercase italic text-[10px] h-12 px-8 hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl flex items-center gap-2 transition-all hover:scale-105">
                <Plus className="h-4 w-4" /> Déployer Unité
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-none ring-1 ring-border rounded-[2.5rem] p-10 max-w-md shadow-2xl">
              <DialogHeader>
                <DialogTitle className="heading-lg">Ajout <span className="gold-gradient-text">Catalogue</span></DialogTitle>
                <CardDescription className="font-semibold italic">Enregistrer une nouvelle référence dans le système.</CardDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label className="subheading">Nom de l'Unité</Label>
                  <Input 
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="bg-muted border-none ring-1 ring-border text-foreground h-14 rounded-2xl px-6 focus:ring-primary/40 transition-all" 
                    placeholder="Bock 66cl (Vitre)" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="subheading">Valeur Unitaire (F)</Label>
                    <Input 
                      type="number"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      className="bg-muted border-none ring-1 ring-border text-foreground h-14 rounded-2xl px-6" 
                      placeholder="1000" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="subheading">Stock Initial</Label>
                    <Input 
                      type="number"
                      value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      className="bg-muted border-none ring-1 ring-border text-foreground h-14 rounded-2xl px-6" 
                      placeholder="48" 
                      required 
                    />
                  </div>
                </div>
                <DialogFooter className="pt-6">
                  <Button type="submit" className="w-full bg-primary text-white font-black uppercase italic h-16 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">VALIDER LE DÉPLOIEMENT</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-all" />
        <Input 
          placeholder="Intercepter une référence (Nom ou Catégorie)..." 
          className="pl-16 bg-white border-none ring-1 ring-border text-foreground h-16 rounded-[2rem] text-sm focus:ring-primary/20 transition-all shadow-sm" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Card className="premium-card border-none ring-1 ring-border shadow-sm rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-border/50 bg-muted/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="heading-lg">Registre <span className="gold-gradient-text">Logistique</span></h2>
              <p className="subheading mt-2">Suivi métrique des effectifs liquides.</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center">
              <Filter className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="subheading py-10 pl-12">Unité / Catégorie</TableHead>
                  <TableHead className="subheading py-10">Métrique Stock</TableHead>
                  <TableHead className="subheading py-10">Valeur Vente</TableHead>
                  <TableHead className="text-right subheading py-10 pr-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredProducts.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={4} className="h-80 text-center py-20">
                        <div className="flex flex-col items-center gap-6 opacity-20">
                           <Package className="h-16 w-16 text-muted-foreground" />
                           <p className="subheading">Aucun signal détecté sur ce spectre</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.map((product, idx) => (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-border hover:bg-primary/[0.02] transition-all group"
                    >
                      <TableCell className="pl-12 py-8">
                        <div className="flex items-center gap-6">
                          <div className="h-14 w-14 rounded-[1.25rem] bg-muted border border-border flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg transition-all duration-500">
                            <Wine className="h-6 w-6 opacity-40 group-hover:opacity-100" />
                          </div>
                          <div>
                            <p className="text-xl font-black text-foreground italic uppercase tracking-tighter leading-none mb-2 transition-colors group-hover:text-primary">{product.name}</p>
                            <Badge variant="outline" className="text-[8px] border-primary/20 text-primary font-black uppercase px-3 py-1 bg-primary/5 rounded-full tracking-widest">{product.category}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-8">
                        <div className="flex items-center gap-2">
                           <p className="text-2xl font-black text-foreground italic tracking-tighter">{product.stock}</p>
                           <span className="text-[10px] text-muted-foreground font-black uppercase italic tracking-widest opacity-40">Unités</span>
                        </div>
                        {product.stock <= 5 && (
                          <div className="flex items-center gap-2 mt-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                             <p className="text-[8px] text-red-500 font-black uppercase tracking-widest italic leading-none">Alerte Critique</p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-8">
                        <p className="text-2xl font-black text-primary italic tracking-tight leading-none">{product.price.toLocaleString()} F</p>
                        <p className="text-[8px] font-black uppercase text-muted-foreground/30 mt-2 tracking-widest italic">Cours Actualisé</p>
                      </TableCell>
                      <TableCell className="text-right pr-12 py-8">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-12 w-12 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl border border-transparent hover:border-primary/20 transition-all"
                            onClick={() => {
                              setSelectedProduct(product)
                              setIsEditOpen(true)
                            }}
                          >
                            <Edit2 className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-12 w-12 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-2xl border border-transparent hover:border-red-200 transition-all"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-5 w-5" />
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
        <DialogContent className="bg-white border-none ring-1 ring-border rounded-[2.5rem] p-10 max-w-md shadow-2xl">
          <DialogHeader>
            <DialogTitle className="heading-lg">Réglage <span className="gold-gradient-text">Unité</span></DialogTitle>
            <CardDescription className="font-semibold italic">Ajuster les métriques opérationnelles du produit.</CardDescription>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={handleUpdateProduct} className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label className="subheading">Désignation</Label>
                <Input 
                  value={selectedProduct.name}
                  onChange={e => setSelectedProduct({...selectedProduct, name: e.target.value})}
                  className="bg-muted border-none ring-1 ring-border text-foreground h-14 rounded-2xl px-6" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="subheading">Prix Vente (F)</Label>
                  <Input 
                    type="number"
                    value={selectedProduct.price}
                    onChange={e => setSelectedProduct({...selectedProduct, price: e.target.value})}
                    className="bg-muted border-none ring-1 ring-border text-foreground h-14 rounded-2xl px-6" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="subheading">Effectif Réel</Label>
                  <Input 
                    type="number"
                    value={selectedProduct.stock}
                    onChange={e => setSelectedProduct({...selectedProduct, stock: e.target.value})}
                    className="bg-muted border-none ring-1 ring-border text-foreground h-14 rounded-2xl px-6" 
                    required 
                  />
                </div>
              </div>
              <DialogFooter className="pt-6">
                <Button type="submit" className="w-full bg-primary text-white font-black uppercase italic h-16 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">APPLIQUER LES CHANGEMENTS</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
