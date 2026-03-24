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
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
        <div className="space-y-4 animate-pulse">
           <div className="h-16 w-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(37,99,235,0.3)]">
             <ShoppingCart className="h-8 w-8 text-blue-500" />
           </div>
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Initialisation Terminal...</p>
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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] xl:h-screen immersive-dark overflow-hidden bg-[#020617] font-montserrat relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Left Menu - Tables & Products */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10 pb-32 lg:pb-10 relative z-10 scrollbar-hide">
        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
             <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Terminal Actif</p>
           </div>
           <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">Interface de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Service</span></h1>
        </div>

        {/* Table Selection */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md">
               <TableIcon className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Sélection Zone</h2>
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
                    "p-4 rounded-xl border transition-all duration-300 text-sm font-bold uppercase tracking-wider relative overflow-hidden group",
                    selectedTable === table.id 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                      : table.status === 'Occupée'
                        ? 'bg-white/5 border-red-500/20 text-slate-500 cursor-not-allowed'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/10'
                  )}
                  disabled={table.status === 'Occupée'}
                >
                  <span className="relative z-10">{table.name}</span>
                  {selectedTable === table.id && (
                    <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm z-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </section>

        {/* Product Grid */}
        <section className="space-y-6">
          <div className="relative max-w-xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
            <Input 
              placeholder="Rechercher une référence..."
              className="pl-14 bg-white/5 border-white/10 h-14 rounded-2xl text-base font-medium text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all backdrop-blur-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 pb-10">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id}
                className={cn(
                  "cursor-pointer group rounded-2xl p-0 overflow-hidden relative border-white/10 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-500 hover:-translate-y-1",
                  product.stock <= 0 ? 'opacity-40 grayscale pointer-events-none' : 'hover:shadow-[0_8px_30px_rgba(37,99,235,0.15)] hover:border-blue-500/30'
                )}
                onClick={() => addToCart(product)}
              >
                <div className="p-6 flex flex-col h-full gap-6">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500">
                       {product.image ? (
                         <img src={product.image} alt={product.name} className="h-8 w-8 object-contain drop-shadow-lg" />
                       ) : (
                         <Wine className="h-6 w-6 text-slate-300 group-hover:text-blue-400 transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                       )}
                    </div>
                    <Badge className="text-[9px] bg-white/10 hover:bg-white/20 text-slate-300 border-none font-bold uppercase tracking-widest px-3 py-1 backdrop-blur-md">
                      {product.category}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 flex-1">
                    <h3 className="font-bold text-lg text-white line-clamp-2 leading-tight group-hover:text-blue-100 transition-colors">{product.name}</h3>
                    <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">Dispo: {product.stock}</p>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/5 pt-4">
                    <p className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors drop-shadow-md">{product.price.toLocaleString()} F</p>
                    <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
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
      <div className="w-full lg:w-[420px] bg-black/40 backdrop-blur-3xl border-l border-white/10 flex flex-col z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] relative">
        <div className="p-8 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-50" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="h-12 w-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
               <Receipt className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Commande</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ticket en cours</p>
            </div>
          </div>
          {selectedTable && (
            <Badge className="bg-blue-600 text-white font-bold text-xs px-4 py-1.5 rounded-full border-none shadow-[0_0_15px_rgba(37,99,235,0.4)] relative z-10">
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
                    <p className="text-sm font-bold text-white truncate">{item.name}</p>
                    <p className="text-xs font-bold text-blue-400 mt-1">{item.price.toLocaleString()} F</p>
                  </div>
                  <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-xl border border-white/5">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-300 hover:text-white hover:bg-white/20 transition-all"><Minus className="h-4 w-4" /></button>
                    <span className="min-w-6 text-center text-white font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-300 hover:text-white hover:bg-blue-600 transition-all"><Plus className="h-4 w-4" /></button>
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
            <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span>Sous-total</span>
              <span className="text-white normal-case tracking-normal">{subtotal.toLocaleString()} F</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span>TVA ({establishment.taxRate}%)</span>
              <span className="text-white normal-case tracking-normal">{tax.toLocaleString()} F</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Total</span>
              <span className="text-4xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{total.toLocaleString()} <span className="text-sm font-bold text-slate-500 ml-1">{establishment.currency}</span></span>
            </div>
          </div>
          
          <Button 
            className={cn(
              "w-full font-bold h-16 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest text-xs",
              cart.length > 0 
                ? "bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.6)]" 
                : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
            )}
            onClick={handleValidate}
            disabled={cart.length === 0}
          >
            <Zap className="h-5 w-5" />
            Vérifier & Encaisser
          </Button>
        </div>
      </div>

      {/* RECEIPT DIALOG - Nightlife adapted */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="bg-[#0f172a] border-slate-800 text-white max-w-[420px] p-0 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />
            
            <div className="text-center space-y-4 relative z-10">
              {establishment.logo ? (
                <img src={establishment.logo} alt="Logo" className="h-20 mx-auto rounded-2xl shadow-xl border border-white/10" />
              ) : (
                <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto border border-white/10 backdrop-blur-md shadow-xl">
                   <Building2 className="h-10 w-10 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{establishment.name}</h2>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mt-2">{establishment.location}</p>
              </div>
            </div>

            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/5">
                 <div className="space-y-1">
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Réf Transaction</p>
                   <p className="text-sm font-bold text-white">{lastOrder?.id.slice(-8)}</p>
                 </div>
                 <div className="space-y-1 text-right">
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Zone</p>
                   <Badge className="bg-blue-600/20 text-blue-400 border-none font-bold text-xs">TAB-{lastOrder?.tableId}</Badge>
                 </div>
              </div>
              
              <div className="divide-y divide-white/5 px-2">
                {lastOrder?.items.map((item: any, i: number) => (
                  <div key={i} className="py-4 flex justify-between items-center group">
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{item.name}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">{item.quantity} x {item.price.toLocaleString()} F</p>
                    </div>
                    <span className="text-sm font-bold text-white">{(item.price * item.quantity).toLocaleString()} F</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-2xl flex justify-between items-end relative z-10">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.15em] mb-1">Montant validé</span>
              <span className="text-4xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                {(lastOrder?.total || 0).toLocaleString()} <span className="text-sm font-bold text-blue-400 ml-1">{establishment.currency}</span>
              </span>
            </div>

            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center leading-relaxed px-4 relative z-10">
              {establishment.invoiceNote}
            </p>
          </div>

          <div className="p-6 bg-slate-900 border-t border-white/5 flex gap-4">
            <Button onClick={() => setShowReceipt(false)} className="flex-1 bg-white text-black hover:bg-slate-200 font-bold h-14 rounded-xl uppercase tracking-widest text-xs">
              <Receipt className="mr-2 h-4 w-4" /> IMPRESSION
            </Button>
            <Button onClick={() => setShowReceipt(false)} className="h-14 w-14 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border-none">
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
