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
  LayoutDashboard,
  Wine
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
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(212,175,55,0.1)]">
             <ShoppingCart className="h-8 w-8 text-primary" />
           </div>
           <p className="text-sm font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Initialisation Terminal...</p>
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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] xl:h-screen immersive-dark overflow-hidden bg-background font-montserrat relative selection:bg-primary/20">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none opacity-50" />

      {/* Left Menu - Tables & Products */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10 pb-32 lg:pb-10 relative z-10 scrollbar-hide">
        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="h-3 w-3 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Terminal Actif — Mode VIP</p>
           </div>
           <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">Interface de <span className="text-primary">Service</span></h1>
        </div>

        {/* Table Selection */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 backdrop-blur-md">
               <TableIcon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-black text-white tracking-widest uppercase">Sélection Zone</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-4">
            {tables.length === 0 ? (
              <p className="col-span-full text-xs font-bold uppercase text-slate-500 tracking-widest">Aucun secteur configuré</p>
            ) : (
              tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table.id)}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-300 text-xs font-black uppercase tracking-[0.2em] relative overflow-hidden group",
                    selectedTable === table.id 
                      ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                      : table.status === 'Occupée'
                        ? 'bg-white/5 border-destructive/20 text-muted-foreground/30 cursor-not-allowed'
                        : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20 hover:bg-white/10'
                  )}
                  disabled={table.status === 'Occupée'}
                >
                  <span className="relative z-10">{table.name}</span>
                  {selectedTable === table.id && (
                    <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm z-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </section>

        {/* Product Grid */}
        <section className="space-y-6">
          <div className="relative max-w-xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Rechercher une référence..."
              className="pl-14 bg-white/5 border-white/10 h-14 rounded-2xl text-base font-bold text-white placeholder:text-muted-foreground/30 focus:bg-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all backdrop-blur-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 pb-10">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id}
                className={cn(
                  "cursor-pointer group rounded-2xl p-0 overflow-hidden relative border-white/5 bg-white/5 backdrop-blur-3xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 shadow-2xl",
                  product.stock <= 0 ? 'opacity-40 grayscale pointer-events-none' : 'hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)] hover:border-primary/30'
                )}
                onClick={() => addToCart(product)}
              >
                <div className="p-6 flex flex-col h-full gap-6">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500">
                       {product.image ? (
                         <img src={product.image} alt={product.name} className="h-8 w-8 object-contain drop-shadow-lg" />
                       ) : (
                         <Wine className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]" />
                       )}
                    </div>
                    <Badge className="text-[9px] bg-white/5 hover:bg-white/10 text-muted-foreground border-white/5 font-black uppercase tracking-widest px-3 py-1 backdrop-blur-md">
                      {product.category}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 flex-1">
                    <h3 className="font-black text-lg text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">{product.name}</h3>
                    <p className="text-[10px] text-primary/60 uppercase font-black tracking-widest">Dispo: {product.stock}</p>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/5 pt-4">
                    <p className="text-xl font-black text-white group-hover:text-primary transition-colors drop-shadow-md">{product.price.toLocaleString()} F</p>
                    <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                      <Plus className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Right Sidebar - Immerse Cart */}
      <div className="w-full lg:w-[420px] bg-card/60 backdrop-blur-3xl border-l border-white/10 flex flex-col z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] relative">
        <div className="p-8 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
               <Receipt className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-widest uppercase">Commande</h2>
              <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.3em] mt-1">Ticket en cours</p>
            </div>
          </div>
          {selectedTable && (
            <Badge className="bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-xl border-none shadow-[0_0_15px_rgba(212,175,55,0.3)] relative z-10">
              TB-{tables.find(t => t.id === selectedTable)?.name}
            </Badge>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-6 py-20">
                 <div className="h-24 w-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                   <Package className="h-10 w-10 text-white/20" />
                 </div>
                 <p className="font-bold text-xs uppercase tracking-[0.2em] text-slate-500">Ajouter des articles</p>
              </div>
            ) : (
              cart.map((item) => (
                <motion.div 
                  key={item.productId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  className="flex gap-4 justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-black text-white truncate uppercase tracking-tight">{item.name}</p>
                    <p className="text-xs font-black text-primary mt-1 tracking-tighter">{item.price.toLocaleString()} F</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/5">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all"><Minus className="h-4 w-4" /></button>
                    <span className="min-w-6 text-center text-white font-black text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-muted-foreground hover:text-white hover:bg-primary hover:text-primary-foreground transition-all"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 bg-black/60 backdrop-blur-xl border-t border-white/10 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
              <span>Sous-total</span>
              <span className="text-white normal-case tracking-normal text-sm">{subtotal.toLocaleString()} F</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
              <span>TVA ({establishment.taxRate}%)</span>
              <span className="text-white normal-case tracking-normal text-sm">{tax.toLocaleString()} F</span>
            </div>
            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Total</span>
              <span className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{total.toLocaleString()} <span className="text-xs font-black text-muted-foreground/40 ml-1">{establishment.currency}</span></span>
            </div>
          </div>
          
          <Button 
            className={cn(
              "w-full font-black h-16 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px]",
              cart.length > 0 
                ? "bg-primary text-primary-foreground shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]" 
                : "bg-white/5 text-muted-foreground/20 cursor-not-allowed border border-white/5"
            )}
            onClick={handleValidate}
            disabled={cart.length === 0}
          >
            <Zap className="h-4 w-4" />
            Vérifier & Encaisser
          </Button>
        </div>
      </div>

      {/* RECEIPT DIALOG - Nightlife adapted */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="bg-card/95 border-white/10 text-white max-w-[420px] p-0 rounded-[3rem] max-h-[85vh] overflow-y-auto scrollbar-hide shadow-2xl backdrop-blur-3xl lg:selection:bg-primary/20 flex flex-col">
          <div className="p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />
            
            <div className="text-center space-y-4 relative z-10 pt-4">
              {establishment.logo ? (
                <img src={establishment.logo} alt="Logo" className="h-20 mx-auto rounded-3xl shadow-xl border border-white/10" />
              ) : (
                <div className="h-20 w-20 rounded-[2rem] bg-white/5 flex items-center justify-center mx-auto border border-white/5 backdrop-blur-md shadow-xl">
                   <Building2 className="h-10 w-10 text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">{establishment.name}</h2>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2">{establishment.location}</p>
              </div>
            </div>

            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-center bg-white/5 rounded-2xl p-5 border border-white/5">
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Réf Transaction</p>
                   <p className="text-sm font-black text-white tracking-tighter">{lastOrder?.id.slice(-8)}</p>
                 </div>
                 <div className="space-y-1 text-right">
                   <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Zone</p>
                   <Badge className="bg-primary/20 text-primary border-none font-black text-[10px] uppercase tracking-widest px-3">TAB-{lastOrder?.tableId}</Badge>
                 </div>
              </div>
              
              <div className="divide-y divide-white/5 px-2">
                {lastOrder?.items.map((item: any, i: number) => (
                  <div key={i} className="py-4 flex justify-between items-center group">
                    <div>
                      <p className="text-sm font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight">{item.name}</p>
                      <p className="text-[10px] font-black text-muted-foreground/30 uppercase mt-1 tracking-[0.2em]">{item.quantity} x {item.price.toLocaleString()} F</p>
                    </div>
                    <span className="text-sm font-black text-white">{(item.price * item.quantity).toLocaleString()} F</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-6 rounded-[2rem] flex justify-between items-end relative z-10 transition-all hover:bg-primary/15">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Montant validé</span>
              <span className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {(lastOrder?.total || 0).toLocaleString()} <span className="text-xs font-black text-primary/60 ml-1">{establishment.currency}</span>
              </span>
            </div>

            <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] text-center leading-relaxed px-6 relative z-10">
              {establishment.invoiceNote}
            </p>
          </div>

          <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-4">
            <Button onClick={() => setShowReceipt(false)} className="flex-1 bg-white text-black hover:bg-white/90 font-black h-16 rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-xl">
              <Receipt className="mr-2 h-4 w-4" /> IMPRESSION
            </Button>
            <Button onClick={() => setShowReceipt(false)} className="h-16 w-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(212,175,55,0.4)] border-none">
               <CheckCircle2 className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
