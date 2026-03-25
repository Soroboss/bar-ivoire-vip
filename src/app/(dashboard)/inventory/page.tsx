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
  const { establishment, products, addProduct, updateProduct, deleteProduct, loading } = useAppContext()
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [movements, setMovements] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Bières', price: '', stock: '' })

  const loadHistory = async () => {
    if (!establishment) return
    setShowHistory(true)
    setLoadingHistory(true)
    try {
      const { insforgeService } = await import('@/services/insforgeService')
      const data = await insforgeService.getStockMovements(establishment.id)
      setMovements(data)
    } catch(e) {}
    setLoadingHistory(false)
  }

  const handleRestock = (product: any) => {
    const message = encodeURIComponent(`Bonjour, je souhaite passer une commande urgente pour mon établissement "${establishment?.name}".\n\nProduit : ${product.name}\nQuantité souhaitée : `)
    // In MVP, we just open WhatsApp directly, user picks the contact
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
             <Package className="h-8 w-8 text-primary" />
           </div>
           <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Flux de données en cours...</p>
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
            <div className="h-2 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <p className="subheading text-primary font-bold">Gestion des stocks</p>
          </div>
          <h1 className="heading-xl">Inventaire</h1>
          <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">
            Gérez vos références produits, ajustez vos prix et suivez vos niveaux de stock en temps réel pour éviter les ruptures.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button 
            onClick={loadHistory}
            variant="outline" 
            className="h-12 border-white/10 text-muted-foreground hover:bg-white/5 font-bold px-6 rounded-xl transition-all"
          >
            <History className="mr-2 h-4 w-4" /> Historique
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger>
              <Button className="bg-primary text-primary-foreground font-bold h-12 px-8 hover:bg-primary/90 shadow-lg shadow-primary/10 rounded-xl flex items-center gap-2 transition-all">
                <Plus className="h-4 w-4" /> Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card/90 border-white/10 rounded-[2rem] p-6 md:p-8 max-w-md max-h-[85vh] overflow-y-auto scrollbar-hide shadow-2xl backdrop-blur-2xl selection:bg-primary/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">Nouveau Produit</DialogTitle>
                <CardDescription className="text-muted-foreground font-medium">Remplissez les informations ci-dessous.</CardDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest ml-1">Nom du produit</Label>
                  <Input 
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="bg-white/5 border-white/5 h-12 rounded-xl px-4 text-white font-bold placeholder:text-muted-foreground/30 focus:ring-primary/20 transition-all font-bold" 
                    placeholder="Ex: Heineken 33cl" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest ml-1">Prix (F)</Label>
                    <Input 
                      type="number"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      className="bg-white/5 border-white/5 h-12 rounded-xl px-4 text-white font-black placeholder:text-muted-foreground/30 focus:ring-primary/20 transition-all" 
                      placeholder="1000" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest ml-1">Stock</Label>
                    <Input 
                      type="number"
                      value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      className="bg-white/5 border-white/5 h-12 rounded-xl px-4 text-white font-black placeholder:text-muted-foreground/30 focus:ring-primary/20 transition-all" 
                      placeholder="48" 
                      required 
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full bg-primary text-primary-foreground font-black h-14 rounded-xl shadow-xl shadow-primary/20 uppercase tracking-tighter">Enregistrer le stock</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative max-w-xl group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity rounded-full" />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Rechercher une référence..." 
          className="relative pl-12 bg-white/5 border-white/10 h-12 rounded-xl text-sm font-bold text-white focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Card className="premium-card rounded-2xl overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/[0.02] border-b border-white/5">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="py-6 pl-8 text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">Produit</TableHead>
                <TableHead className="py-6 text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">Stock</TableHead>
                <TableHead className="py-6 text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">Prix</TableHead>
                <TableHead className="text-right py-6 pr-8 text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                 {filteredProducts.length === 0 ? (
                  <TableRow className="hover:bg-transparent border-none">
                    <TableCell colSpan={4} className="h-64 text-center py-20">
                      <div className="flex flex-col items-center gap-4">
                         <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                           <Package className="h-8 w-8 text-muted-foreground/20" />
                         </div>
                         <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">Aucun produit trouvé</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.map((product, idx) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-white/5 hover:bg-white/[0.02] transition-all group"
                  >
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                          <Wine className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white tracking-tight">{product.name}</p>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">{product.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex items-center gap-2">
                         <p className="text-lg font-black text-white">{product.stock}</p>
                         <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">Unités</span>
                      </div>
                      {product.stock <= 5 && (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[8px] mt-1 uppercase font-black px-2 py-0">Critique — Réappro</Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-5">
                      <p className="text-xl font-black text-primary tracking-tighter">{product.price.toLocaleString()} F</p>
                    </TableCell>
                    <TableCell className="text-right pr-8 py-5">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        {product.stock <= 5 && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                            onClick={() => handleRestock(product)}
                          >
                            Réappro WhatsApp
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 text-muted-foreground hover:text-white hover:bg-white/10 rounded-xl transition-all"
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
                          className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
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
        <DialogContent className="bg-card/90 border-white/10 rounded-[2rem] p-6 md:p-8 max-w-md max-h-[85vh] overflow-y-auto scrollbar-hide shadow-2xl backdrop-blur-2xl selection:bg-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">Modifier Référence</DialogTitle>
            <CardDescription className="text-muted-foreground font-medium">Mettez à jour les informations du stock.</CardDescription>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={handleUpdateProduct} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest ml-1">Désignation</Label>
                <Input 
                  value={selectedProduct.name}
                  onChange={e => setSelectedProduct({...selectedProduct, name: e.target.value})}
                  className="bg-white/5 border-white/5 h-12 rounded-xl px-4 text-white font-bold focus:ring-primary/20 transition-all font-bold" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest ml-1">Prix (F)</Label>
                  <Input 
                    type="number"
                    value={selectedProduct.price}
                    onChange={e => setSelectedProduct({...selectedProduct, price: e.target.value})}
                    className="bg-white/5 border-white/5 h-12 rounded-xl px-4 text-white font-black focus:ring-primary/20 transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest ml-1">Stock</Label>
                  <Input 
                    type="number"
                    value={selectedProduct.stock}
                    onChange={e => setSelectedProduct({...selectedProduct, stock: e.target.value})}
                    className="bg-white/5 border-white/5 h-12 rounded-xl px-4 text-white font-black focus:ring-primary/20 transition-all" 
                    required 
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full bg-primary text-primary-foreground font-black h-14 rounded-xl shadow-xl shadow-primary/20 uppercase tracking-tighter">Mettre à jour</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="bg-card/95 border-white/10 text-white max-w-2xl p-0 rounded-[2rem] max-h-[85vh] flex flex-col shadow-2xl backdrop-blur-3xl overflow-hidden">
          <div className="p-8 border-b border-white/5 shrink-0">
             <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Historique des Mouvements</DialogTitle>
             <CardDescription className="text-muted-foreground font-medium mt-1">Traçabilité complète des entrées/sorties en base de données.</CardDescription>
          </div>
          <div className="p-6 overflow-y-auto scrollbar-hide flex-1 space-y-4">
             {loadingHistory ? (
               <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
             ) : movements.length === 0 ? (
               <p className="text-center font-bold text-sm text-slate-500 uppercase py-10 tracking-widest">Aucun mouvement récent</p>
             ) : (
               movements.map(m => (
                 <div key={m.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div>
                      <div className="flex items-center gap-3">
                        <Badge className={cn("text-[9px] font-black uppercase tracking-widest", m.type === 'IN' ? 'bg-green-500' : 'bg-red-500')}>{m.type}</Badge>
                        <p className="font-bold text-sm text-white">{m.products?.name || 'Produit inconnu'}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">{m.reason || "Ajustement manuel"}</p>
                    </div>
                    <div className="text-right">
                       <p className={cn("text-xl font-black tracking-tighter", m.type === 'IN' ? 'text-green-500' : 'text-red-500')}>
                         {m.quantity > 0 ? '+' : ''}{m.quantity}
                       </p>
                       <p className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-widest mt-1">
                         Stock: {m.previous_stock} → <span className="text-white">{m.new_stock}</span>
                       </p>
                    </div>
                 </div>
               ))
             )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
