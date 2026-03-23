'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  Table as TableIcon,
  Zap,
  LayoutDashboard
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="space-y-6 animate-pulse">
           <div className="h-20 w-20 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto shadow-sm">
             <ShoppingCart className="h-10 w-10 text-primary" />
           </div>
           <p className="subheading">Initialisation du Terminal POS Orbitale...</p>
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
      className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-background overflow-hidden"
    >
      {/* Left Menu - Tables & Products */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 scrollbar-hide pb-32 lg:pb-10">
        <div className="flex flex-col gap-3">
           <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <LayoutDashboard className="h-4 w-4 text-emerald-600" />
             </div>
             <p className="subheading">Terminal de Vente Haute Performance</p>
           </div>
           <h1 className="heading-xl">Session <span className="gold-gradient-text">POS VIP</span></h1>
        </div>

        {/* Table Selection */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                 <TableIcon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="heading-lg text-lg">Affectation <span className="text-foreground">Unité</span></h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {tables.length === 0 ? (
              <p className="col-span-full subheading opacity-30">Aucune unité détectée</p>
            ) : (
              tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table.id)}
                  className={cn(
                    "p-4 rounded-3xl border transition-all duration-500 text-[10px] font-black uppercase tracking-widest italic group",
                    selectedTable === table.id 
                      ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30 scale-105' 
                      : table.status === 'Occupée'
                        ? 'bg-red-50 border-red-100 text-red-500 opacity-60'
                        : 'bg-white border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
                  )}
                >
                  <span className={cn("block mb-1 opacity-40 group-hover:opacity-100 transition-opacity", selectedTable === table.id && "opacity-100")}>Table</span>
                  <span className="text-sm tracking-tighter transition-transform group-hover:scale-110 block">{table.name}</span>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Product Grid */}
        <section className="space-y-8">
          <div className="relative group max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-all" />
            <Input 
              placeholder="Intercepter une référence (Nom ou Catégorie)..."
              className="pl-16 bg-white border-none ring-1 ring-border text-foreground h-16 rounded-[2rem] text-sm focus:ring-primary/20 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card 
                  className={cn(
                    "premium-card border-none ring-1 ring-border cursor-pointer group rounded-[2.5rem] overflow-hidden shadow-sm",
                    product.stock <= 0 ? 'opacity-40 pointer-events-none' : ''
                  )}
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-6 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                         <Wine className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary" />
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-[8px] border-primary/20 bg-primary/5 text-primary font-black uppercase px-2 py-0.5 tracking-widest block mb-1">
                          {product.category}
                        </Badge>
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-widest italic leading-none",
                          product.stock <= 5 ? "text-red-500 animate-pulse" : "text-muted-foreground/40"
                        )}>Stock: {product.stock}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors uppercase italic tracking-tighter leading-none mb-1">{product.name}</h3>
                      <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] italic opacity-50">Référence Arcturus-{product.id.slice(0,4).toUpperCase()}</p>
                    </div>
                    <div className="flex justify-between items-center group-hover:translate-y-[-2px] transition-transform">
                      <p className="text-2xl font-black text-primary italic tracking-tight leading-none">{product.price.toLocaleString()} F</p>
                      <div className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                        <Plus className="h-5 w-5" />
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
      <div className="w-full lg:w-[480px] border-l border-border bg-muted/5 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.02)] z-10 backdrop-blur-xl">
        <div className="p-10 border-b border-border bg-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
               <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="heading-lg">Capture <span className="gold-gradient-text">Vente</span></h2>
              <p className="subheading mt-1">Flux Transactionnel Actif</p>
            </div>
          </div>
          {selectedTable && (
            <Badge className="bg-primary text-white font-black uppercase italic text-[10px] px-5 py-2 rounded-2xl shadow-xl shadow-primary/20 animate-pulse-slow">
              Table {tables.find(t => t.id === selectedTable)?.name}
            </Badge>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-6 text-muted-foreground opacity-10 py-32">
                 <ShoppingCart className="h-24 w-24" />
                 <p className="font-black uppercase tracking-[0.5em] italic text-[10px]">Session Vide</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <motion.div 
                  key={item.productId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex gap-6 justify-between items-center bg-white p-6 rounded-[2rem] border border-border group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest italic leading-none mb-2">Article</p>
                    <p className="font-black text-foreground uppercase italic tracking-tighter text-md leading-none mb-2 truncate">{item.name}</p>
                    <p className="text-xl font-black text-foreground/40 italic tracking-tight">{item.price.toLocaleString()} F</p>
                  </div>
                  <div className="flex items-center gap-4 bg-muted/40 p-2 rounded-[1.25rem] border border-border/50">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white text-muted-foreground hover:text-primary hover:shadow-md transition-all"><Minus className="h-4 w-4" /></button>
                    <span className="min-w-8 text-center text-foreground font-black text-lg italic tracking-tighter leading-none">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white text-muted-foreground hover:text-primary hover:shadow-md transition-all"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="h-12 w-12 flex items-center justify-center rounded-xl text-muted-foreground/20 hover:text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="p-10 bg-white border-t border-border space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="subheading">Sous-Somme</span>
              <span className="font-black text-foreground italic tracking-tight">{subtotal.toLocaleString()} F</span>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="subheading">Gravité Fiscale ({establishment.taxRate}%)</span>
              <span className="font-black text-foreground italic tracking-tight">{tax.toLocaleString()} F</span>
            </div>
            <div className="h-px bg-border/40" />
            <div className="flex justify-between items-end px-2 py-2">
              <span className="subheading text-primary bg-primary/5 px-4 py-2 rounded-full ring-1 ring-primary/20">Total à Percevoir</span>
              <span className="text-5xl font-black text-primary italic tracking-tight leading-none">{total.toLocaleString()} <span className="text-base not-italic opacity-30 ml-2">{establishment.currency}</span></span>
            </div>
          </div>
          
          <Button 
            className="w-full bg-primary text-white font-black uppercase italic text-sm h-20 rounded-[2rem] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
            onClick={handleValidate}
            disabled={cart.length === 0}
          >
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
               <Zap className="h-4 w-4" />
            </div>
            EXPÉDIER LA TRANSACTION
          </Button>
        </div>
      </div>

      {/* RECEIPT DIALOG (SIMULATED TICKET) */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="bg-white text-slate-800 max-w-[450px] p-0 font-montserrat rounded-[3rem] overflow-hidden border-none shadow-[0_50px_100px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
          <div className="p-12 space-y-10">
            <div className="text-center space-y-6">
              {establishment.logo ? (
                <img src={establishment.logo} alt="Logo" className="h-20 mx-auto rounded-2xl" />
              ) : (
                <div className="h-24 w-24 rounded-[2rem] bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto">
                   <Building2 className="h-10 w-10 text-primary" />
                </div>
              )}
              <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter gold-gradient-text leading-none">{establishment.name}</h2>
                <div className="flex flex-col gap-1 opacity-60">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">{establishment.location}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">Tél: {establishment.phone}</p>
                </div>
              </div>
              <div className="h-px bg-slate-100 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-white border border-slate-100 rounded-full flex items-center justify-center">
                    <div className="h-1 w-1 bg-primary rounded-full" />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                 <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Référence</p>
                 <p className="text-xs font-black uppercase italic tracking-tighter">{lastOrder?.id}</p>
               </div>
               <div className="space-y-1 text-right">
                 <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Table</p>
                 <p className="text-xs font-black uppercase italic tracking-tighter">Unité {lastOrder?.tableId}</p>
               </div>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center">Inventaire de Session</p>
              <div className="space-y-6">
                {lastOrder?.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div className="space-y-1">
                      <p className="text-sm font-black uppercase italic tracking-tighter">{item.name}</p>
                      <Badge variant="outline" className="text-[7px] border-slate-100 text-slate-400 font-black uppercase tracking-widest">{item.quantity} x {item.price.toLocaleString()} F</Badge>
                    </div>
                    <span className="text-lg font-black italic tracking-tighter">{(item.price * item.quantity).toLocaleString()} F</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Total Consolidé</span>
                <span className="text-4xl font-black tracking-tighter italic text-primary">{(lastOrder?.total || 0).toLocaleString()} <span className="text-sm not-italic opacity-30 ml-2">{establishment.currency}</span></span>
              </div>
            </div>

            <div className="text-center space-y-6">
              <p className="text-[10px] font-black italic text-slate-400 leading-relaxed px-6 opacity-60">"{establishment.invoiceNote}"</p>
              <div className="flex items-center justify-center gap-3">
                 <div className="h-px flex-1 bg-slate-100" />
                 <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-300">Orbitale v2.0</p>
                 <div className="h-px flex-1 bg-slate-100" />
              </div>
            </div>
          </div>

          <div className="p-10 bg-slate-50 flex gap-6">
            <Button onClick={() => setShowReceipt(false)} className="flex-1 bg-primary text-white hover:scale-[1.02] active:scale-[0.98] transition-all font-black uppercase italic text-xs h-16 rounded-3xl shadow-2xl shadow-primary/20">
              <Receipt className="mr-3 h-5 w-5" /> IMPRIMER LE TICKET
            </Button>
            <Button onClick={() => setShowReceipt(false)} variant="outline" className="h-16 w-16 rounded-3xl border-slate-200 bg-white hover:bg-white hover:shadow-lg transition-all text-slate-300 hover:text-emerald-500">
               <CheckCircle2 className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
