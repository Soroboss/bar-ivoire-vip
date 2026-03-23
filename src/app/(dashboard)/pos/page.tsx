'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ShoppingCart, 
  Users, 
  Search, 
  CreditCard, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Receipt, 
  Building2, 
  Loader2,
  Package,
  Table as TableIcon
} from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { toast } from 'sonner'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'

export default function POSPage() {
  const { products, createOrder, establishment, loading, tables } = useAppContext()
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [cart, setCart] = useState<{ productId: string, name: string, quantity: number, price: number }[]>([])
  const [search, setSearch] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastOrder, setLastOrder] = useState<any>(null)

  if (loading || !establishment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center text-foreground font-montserrat">
        <div className="space-y-6 animate-pulse">
          <div className="relative">
             <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
               <ShoppingCart className="h-8 w-8 text-primary" />
             </div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2">
               <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
             </div>
          </div>
          <p className="text-primary text-xs font-black uppercase tracking-[0.3em] italic">Initialisation du Terminal POS...</p>
        </div>
      </div>
    )
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  )

  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      toast.error('Stock insuffisant')
      return
    }
    const existing = cart.find(item => item.productId === product.id)
    if (existing) {
      setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart([...cart, { productId: product.id, name: product.name, quantity: 1, price: product.price }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const tax = subtotal * (establishment.taxRate / 100)
  const total = subtotal + tax

  const handleValidate = async () => {
    if (!selectedTable) {
      toast.error('Veuillez sélectionner une table')
      return
    }
    if (cart.length === 0) return

    const orderData = {
      tableId: selectedTable,
      items: cart,
      total,
      status: 'completed' as const
    }
    
    try {
      await createOrder(orderData)
      setLastOrder({ ...orderData, id: `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, createdAt: new Date().toISOString() })
      setCart([])
      setSelectedTable(null)
      setShowReceipt(true)
    } catch (e) {}
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-background text-foreground overflow-hidden font-montserrat"
    >
      {/* Left Menu - Tables & Products */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide">
        {/* Table Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
               <TableIcon className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Affectation <span className="gold-gradient-text">Table</span></h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {tables.length === 0 ? (
              <p className="col-span-full text-xs text-muted-foreground font-semibold italic uppercase tracking-widest opacity-40">Aucune unité détectée</p>
            ) : (
              tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table.id)}
                  className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    selectedTable === table.id 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                      : table.status === 'Occupée'
                        ? 'bg-red-500/10 border-red-500/20 text-red-500'
                        : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/30'
                  }`}
                >
                  {table.name}
                </button>
              ))
            )}
          </div>
        </section>

        {/* Product Grid */}
        <section className="space-y-6">
          <div className="relative group max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Intercepter une référence (Nom ou Catégorie)..."
              className="pl-12 bg-card border-border text-foreground h-14 rounded-2xl text-sm focus:border-primary/30 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 lg:pb-0">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card 
                  className={`bg-card border-border hover:border-primary/40 cursor-pointer transition-all duration-500 rounded-[2rem] overflow-hidden group shadow-sm ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`}
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="text-[8px] border-primary/20 bg-primary/5 text-primary font-black uppercase px-2 py-0">
                        {product.category}
                      </Badge>
                      <span className={`text-[8px] font-black uppercase ${product.stock <= 5 ? 'text-red-500 animate-pulse' : 'text-muted-foreground opacity-40'}`}>
                        S: {product.stock}
                      </span>
                    </div>
                    <h3 className="text-sm md:text-base font-black text-foreground group-hover:text-primary transition-colors uppercase italic tracking-tighter leading-none">{product.name}</h3>
                    <div className="h-px bg-border/50" />
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-black text-primary italic tracking-tight">{product.price.toLocaleString()} F</p>
                      <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform">
                        <Plus className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Sidebar - Cart */}
      <div className="w-full lg:w-[450px] border-l border-border bg-muted/20 flex flex-col shadow-2xl z-10">
        <div className="p-8 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
               <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Commande <span className="gold-gradient-text">Active</span></h2>
          </div>
          {selectedTable && (
            <Badge className="bg-primary text-white font-black uppercase italic text-[10px] px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
              {tables.find(t => t.id === selectedTable)?.name}
            </Badge>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground opacity-20 py-20">
                 <ShoppingCart className="h-16 w-16" />
                 <p className="font-black uppercase tracking-widest italic text-xs">Panier Vide</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <motion.div 
                  key={item.productId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex gap-4 justify-between items-center bg-card p-4 rounded-2xl border border-border group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-foreground uppercase italic tracking-tighter text-sm truncate">{item.name}</p>
                    <p className="text-xs text-primary font-black italic">{item.price.toLocaleString()} F</p>
                  </div>
                  <div className="flex items-center gap-3 bg-muted px-3 py-1.5 rounded-xl border border-border shadow-sm">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="text-muted-foreground hover:text-primary transition-colors"><Minus className="h-3 w-3" /></button>
                    <span className="w-6 text-center text-foreground font-black text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="text-muted-foreground hover:text-primary transition-colors"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-muted-foreground/30 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 bg-card border-t border-border space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sous-total</span>
              <span className="font-bold text-foreground">{subtotal.toLocaleString()} F</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Taxe ({establishment.taxRate}%)</span>
              <span className="font-bold text-foreground">{tax.toLocaleString()} F</span>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Total Final</span>
              <span className="text-4xl font-black text-primary italic tracking-tighter">{total.toLocaleString()} <span className="text-sm not-italic opacity-60 ml-1">{establishment.currency}</span></span>
            </div>
          </div>
          
          <Button 
            className="w-full bg-primary text-white font-black uppercase italic text-xs h-16 rounded-[1.5rem] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            onClick={handleValidate}
            disabled={cart.length === 0}
          >
            <CreditCard className="mr-3 h-5 w-5" /> VALIDER LA COMMANDE
          </Button>
        </div>
      </div>

      {/* RECEIPT DIALOG (SIMULATED TICKET) */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="bg-white text-black max-w-[400px] p-0 font-mono rounded-[2rem] overflow-hidden border-none shadow-[0_0_50px_rgba(0,0,0,0.1)]">
          <div className="p-10 space-y-8">
            <div className="text-center space-y-4">
              {establishment.logo ? (
                <img src={establishment.logo} alt="Logo" className="h-20 mx-auto grayscale" />
              ) : (
                <Building2 className="h-12 w-12 mx-auto text-zinc-300" />
              )}
              <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter">{establishment.name}</h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{establishment.location}</p>
                <p className="text-[10px] font-bold text-zinc-400">Tél: {establishment.phone}</p>
              </div>
              <div className="border-b border-dashed border-zinc-200" />
            </div>

            <div className="space-y-2 text-[10px] font-bold text-zinc-500">
              <div className="flex justify-between uppercase">
                <span>Réf Ticket:</span>
                <span>{lastOrder?.id}</span>
              </div>
              <div className="flex justify-between uppercase">
                <span>Horodatage:</span>
                <span>{lastOrder && new Date(lastOrder.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between uppercase">
                <span>Unité Table:</span>
                <span>{lastOrder?.tableId}</span>
              </div>
            </div>

            <div className="border-b border-dashed border-zinc-200" />

            <div className="space-y-4">
              {lastOrder?.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-xs items-center">
                  <div className="space-y-0.5">
                    <p className="font-black uppercase tracking-tighter">{item.name}</p>
                    <p className="text-[10px] font-bold text-zinc-400">{item.quantity} x {item.price.toLocaleString()} F</p>
                  </div>
                  <span className="font-black">{(item.price * item.quantity).toLocaleString()} F</span>
                </div>
              ))}
            </div>

            <div className="border-b-4 border-double border-zinc-200" />

            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total à Payer</span>
              <span className="text-3xl font-black tracking-tighter">{(lastOrder?.total || 0).toLocaleString()} <span className="text-sm font-black opacity-30 ml-1">{establishment.currency}</span></span>
            </div>

            <div className="text-center space-y-4 pt-4">
              <p className="text-[10px] font-bold italic text-zinc-400">"{establishment.invoiceNote}"</p>
              <div className="border-b border-dashed border-zinc-200" />
              <div className="flex items-center justify-center gap-2 grayscale opacity-30">
                 <div className="h-6 w-6 rounded-lg bg-zinc-200 flex items-center justify-center">
                   <Building2 className="h-3.5 w-3.5" />
                 </div>
                 <p className="text-[9px] font-black uppercase tracking-[0.3em]">Ivoire Bar VIP v2.0</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-zinc-50 print:hidden flex gap-4">
            <Button onClick={() => setShowReceipt(false)} className="flex-1 bg-black text-white hover:bg-zinc-800 font-black uppercase italic text-[10px] h-14 rounded-2xl shadow-xl shadow-black/20">
              <Receipt className="mr-2 h-4 w-4" /> Imprimer Reçu
            </Button>
            <Button onClick={() => setShowReceipt(false)} variant="outline" className="h-14 w-14 rounded-2xl border-zinc-200 hover:bg-white text-zinc-400">
               <CheckCircle2 className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
