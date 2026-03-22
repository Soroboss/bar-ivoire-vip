'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Users, Search, CreditCard, Trash2, Plus, Minus, CheckCircle2, Receipt, Building2 } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { toast } from 'sonner'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from '@/components/ui/dialog'

const TABLES = [
  { id: 'T1', name: 'Table 1', status: 'Libre' },
  { id: 'T2', name: 'Table 2', status: 'Occupée' },
  { id: 'T3', name: 'Table 3', status: 'Libre' },
  { id: 'T4', name: 'Salon VIP 1', status: 'Occupée' },
  { id: 'T5', name: 'Terasse 1', status: 'Libre' },
  { id: 'T6', name: 'Comptoir', status: 'Libre' },
]

export default function POSPage() {
  const { products, createOrder, establishment, loading } = useAppContext()
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [cart, setCart] = useState<{ productId: string, name: string, quantity: number, price: number }[]>([])
  const [search, setSearch] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastOrder, setLastOrder] = useState<any>(null)

  if (loading || !establishment) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1A1A2E] text-[#D4AF37]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="font-bold tracking-widest text-sm">SYNCHRONISATION CLOUD...</p>
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
    } catch (e) {
      // toast handled in context
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-[#1A1A2E] text-[#F4E4BC] overflow-hidden font-sans">
      {/* Left Menu - Tables & Products */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Table Selection */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-[#D4AF37]" />
            <h2 className="text-xl font-bold">Tables</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {TABLES.map(table => (
              <button
                key={table.id}
                onClick={() => setSelectedTable(table.id)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  selectedTable === table.id 
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-[#1A1A2E]' 
                    : table.status === 'Occupée'
                      ? 'bg-red-500/10 border-red-500/20 text-red-500'
                      : 'bg-[#252545] border-[#3A3A5A] text-[#A0A0B8] hover:border-[#D4AF37]'
                }`}
              >
                {table.name}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0B8]" />
            <Input 
              placeholder="Rechercher un produit..."
              className="pl-10 border-[#3A3A5A] bg-[#252545] text-[#F4E4BC]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20 lg:pb-0">
            {filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className={`bg-[#252545] border-[#3A3A5A] hover:border-[#D4AF37] cursor-pointer transition-all group ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`}
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-[10px] border-[#3A3A5A] text-[#A0A0B8]">
                      {product.category}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-white group-hover:text-[#D4AF37] truncate">{product.name}</h3>
                  <div className="flex justify-between items-end">
                    <p className="text-[#D4AF37] font-bold">{product.price.toLocaleString()} F</p>
                    <p className="text-[10px] text-[#A0A0B8]">S: {product.stock}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Right Sidebar - Cart */}
      <div className="w-full lg:w-[400px] border-l border-[#3A3A5A] bg-[#151525] flex flex-col">
        <div className="p-4 border-b border-[#3A3A5A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-[#D4AF37]" />
            <h2 className="text-xl font-bold">Commande</h2>
          </div>
          {selectedTable && (
            <Badge className="bg-[#D4AF37] text-[#1A1A2E]">
              {TABLES.find(t => t.id === selectedTable)?.name}
            </Badge>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#A0A0B8]">
              <p>Panier vide</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex gap-3 justify-between items-center group">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{item.name}</p>
                  <p className="text-sm text-[#A0A0B8]">{item.price.toLocaleString()} F</p>
                </div>
                <div className="flex items-center gap-2 bg-[#252545] rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.productId, -1)} className="h-6 w-6">-</button>
                  <span className="w-6 text-center text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, 1)} className="h-6 w-6">+</button>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-[#252545] border-t border-[#3A3A5A] space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[#A0A0B8] text-sm">
              <span>Sous-total</span>
              <span>{subtotal.toLocaleString()} F</span>
            </div>
            <div className="flex justify-between text-[#A0A0B8] text-sm">
              <span>Taxe ({establishment.taxRate}%)</span>
              <span>{tax.toLocaleString()} F</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-[#D4AF37]">
              <span>TOTAL</span>
              <span>{total.toLocaleString()} {establishment.currency}</span>
            </div>
          </div>
          
          <Button 
            className="w-full bg-[#D4AF37] text-[#1A1A2E] hover:bg-[#A68226] font-bold h-12"
            onClick={handleValidate}
            disabled={cart.length === 0}
          >
            <CreditCard className="mr-2 h-5 w-5" /> VALIDER LA COMMANDE
          </Button>
        </div>
      </div>

      {/* RECEIPT DIALOG (SIMULATED TICKET) */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="bg-white text-black max-w-[350px] p-8 font-mono">
          <div className="text-center space-y-2">
            {establishment.logo ? (
              <img src={establishment.logo} alt="Logo" className="h-16 mx-auto" />
            ) : (
              <Building2 className="h-10 w-10 mx-auto" />
            )}
            <h2 className="text-xl font-bold uppercase">{establishment.name}</h2>
            <p className="text-xs">{establishment.location}</p>
            <p className="text-xs">Tél: {establishment.phone}</p>
            <div className="border-b border-dashed border-black my-4" />
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Ticket: {lastOrder?.id}</span>
              <span>{lastOrder && new Date(lastOrder.createdAt).toLocaleTimeString()}</span>
            </div>
            <p>Table: {lastOrder?.tableId}</p>
          </div>

          <div className="border-b border-dashed border-black my-4" />

          <div className="space-y-2 text-sm">
            {lastOrder?.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between">
                <span>{item.quantity} x {item.name}</span>
                <span>{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-b border-dashed border-black my-4" />

          <div className="space-y-1 text-sm font-bold">
            <div className="flex justify-between">
              <span>TOTAL</span>
              <span>{lastOrder?.total.toLocaleString()} {establishment.currency}</span>
            </div>
          </div>

          <div className="text-center mt-8 space-y-2">
            <p className="text-xs italic">{establishment.invoiceNote}</p>
            <div className="border-b border-dashed border-black my-4" />
            <p className="text-[10px]">Logiciel Ivoire Bar VIP v1.0</p>
          </div>

          <DialogFooter className="mt-6 print:hidden">
            <Button onClick={() => setShowReceipt(false)} className="w-full bg-black text-white hover:bg-zinc-800">
              <Receipt className="mr-2 h-4 w-4" /> Imprimer Reçu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
