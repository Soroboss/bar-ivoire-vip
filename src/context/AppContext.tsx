"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabaseService } from '@/services/supabaseService'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  unit: string
  image?: string
}

export type Order = {
  id: string
  tableId: string
  items: { productId: string; name: string; quantity: number; price: number }[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
}

export type Client = {
  id: string
  name: string
  phone: string
  points: number
  tier: 'Regular' | 'Silver' | 'Gold' | 'VIP'
}

export type Staff = {
  id: string
  name: string
  role: string
  status: 'Present' | 'Absent'
  checkIn?: string
}

export type Establishment = {
  id: string
  name: string
  owner: string
  phone: string
  location: string
  type: string
  logo?: string
  currency: string
  taxRate: number
  invoiceNote: string
  status: 'Pending' | 'Active' | 'Suspended'
  trialEndsAt: string
  plan: 'Trial' | 'Business' | 'VIP' | 'Enterprise'
  createdAt: string
  userId?: string
}

type AppContextType = {
  products: Product[]
  orders: Order[]
  clients: Client[]
  staff: Staff[]
  expenses: any[]
  saasTransactions: any[]
  establishment: Establishment | null
  allEstablishments: Establishment[]
  loading: boolean
  user: User | null
  session: Session | null
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateStock: (productId: string, quantity: number) => void
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>
  addExpense: (expense: any) => Promise<void>
  addClient: (client: Omit<Client, 'id' | 'points' | 'tier'>) => Promise<void>
  toggleStaffStatus: (staffId: string) => Promise<void>
  updateEstablishment: (est: Partial<Establishment>) => void
  registerEstablishment: (est: Omit<Establishment, 'id' | 'status' | 'trialEndsAt' | 'plan' | 'createdAt'>) => Promise<void>
  validateEstablishment: (id: string, status: Establishment['status']) => Promise<void>
  switchEstablishment: (id: string) => Promise<void>
  signOut: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [saasTransactions, setSaaSTransactions] = useState<any[]>([])
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  const [allEstablishments, setAllEstablishments] = useState<Establishment[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session) {
        loadUserData(session.user.id)
      } else {
        setLoading(false)
        resetState()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserData(userId: string) {
    try {
      setLoading(true)
      const ests = await supabaseService.getEstablishments()
      setAllEstablishments(ests)
      
      const userEst = ests.find(e => e.userId === userId) || ests[0]
      if (userEst) {
        setEstablishment(userEst)
        const [prods, cls, stf, exps] = await Promise.all([
          supabaseService.getProducts(userEst.id),
          supabaseService.getClients(userEst.id),
          supabaseService.getStaff(userEst.id),
          supabaseService.getExpenses(userEst.id)
        ])
        setProducts(prods)
        setClients(cls)
        setStaff(stf)
        setExpenses(exps)
      }

      // If Super Admin, load global stats
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single()
      if (profile?.role === 'SUPER_ADMIN') {
        const adminData = await supabaseService.getSaaSTransactions()
        setSaaSTransactions(adminData)
      }

    } catch (error) {
      console.error('Error loading Supabase data:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetState = () => {
    setProducts([])
    setOrders([])
    setClients([])
    setStaff([])
    setExpenses([])
    setSaaSTransactions([])
    setEstablishment(null)
    setAllEstablishments([])
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    toast.success('Déconnexion réussie')
  }

  const addProduct = async (p: Omit<Product, 'id'>) => {
    if (!establishment) return
    try {
      const newProd = await supabaseService.addProduct({ ...p, establishment_id: establishment.id })
      setProducts([...products, newProd])
      toast.success('Produit ajouté au catalogue Cloud')
    } catch (e) {
      toast.error('Erreur lors de l\'ajout')
    }
  }

  const updateStock = (id: string, qty: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: p.stock + qty } : p))
  }

  const createOrder = async (o: Omit<Order, 'id' | 'createdAt'>) => {
    if (!establishment) return
    try {
      await supabaseService.createOrder({ ...o, establishment_id: establishment.id })
      const newOrder: Order = {
        ...o,
        id: `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        createdAt: new Date().toISOString()
      }
      setOrders([newOrder, ...orders])
      o.items.forEach(item => updateStock(item.productId, -item.quantity))
      toast.success('Commande enregistrée en ligne')
    } catch (e) {
      toast.error('Erreur de synchronisation Cloud')
    }
  }

  const addExpense = async (exp: any) => {
    if (!establishment) return
    try {
      const newExp = await supabaseService.addExpense({ ...exp, establishment_id: establishment.id })
      setExpenses([newExp, ...expenses])
      toast.success('Dépense enregistrée Cloud')
    } catch (e) {
      toast.error('Erreur dépenses')
    }
  }

  const addClient = async (c: Omit<Client, 'id' | 'points' | 'tier'>) => {
    if (!establishment) return
    try {
      const newClient = await supabaseService.addClient({ ...c, establishment_id: establishment.id })
      setClients([...clients, newClient])
      toast.success('Nouveau client enregistré')
    } catch (e) {
      toast.error('Erreur client')
    }
  }

  const toggleStaffStatus = async (id: string) => {
    const member = staff.find(s => s.id === id)
    if (!member) return
    const newStatus = member.status === 'Present' ? 'Absent' : 'Present'
    try {
      await supabaseService.updateStaffStatus(id, newStatus)
      setStaff(staff.map(s => s.id === id ? { ...s, status: newStatus as any } : s))
      toast.info(`Statut mis à jour pour ${member.name}`)
    } catch (e) {
      toast.error('Erreur staff')
    }
  }

  const updateEstablishment = (est: Partial<Establishment>) => {
    setEstablishment(prev => prev ? { ...prev, ...est } : null)
  }

  const registerEstablishment = async (est: Omit<Establishment, 'id' | 'status' | 'trialEndsAt' | 'plan' | 'createdAt'>) => {
    try {
      const newEst = await supabaseService.createEstablishment({ ...est, user_id: user?.id })
      setAllEstablishments(prev => [...prev, newEst])
      setEstablishment(newEst)
      toast.success('Établissement enregistré sur Supabase')
    } catch (e) {
      toast.error('Erreur d\'inscription cloud')
    }
  }

  const validateEstablishment = async (id: string, status: Establishment['status']) => {
    try {
      await supabaseService.updateEstablishmentStatus(id, status)
      setAllEstablishments(prev => prev.map(e => e.id === id ? { ...e, status } : e))
      toast.success('Statut mis à jour sur le serveur')
    } catch (e) {
      toast.error('Erreur de validation')
    }
  }

  const switchEstablishment = async (id: string) => {
    const target = allEstablishments.find(e => e.id === id)
    if (!target) return
    
    setLoading(true)
    try {
      setEstablishment(target)
      const [prods, cls, stf, exps] = await Promise.all([
        supabaseService.getProducts(target.id),
        supabaseService.getClients(target.id),
        supabaseService.getStaff(target.id),
        supabaseService.getExpenses(target.id)
      ])
      setProducts(prods)
      setClients(cls)
      setStaff(stf)
      setExpenses(exps)
      toast.success(`Passage à l'établissement : ${target.name}`)
    } catch (e) {
      toast.error('Erreur lors du changement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppContext.Provider value={{ 
      products, orders, clients, staff, expenses, saasTransactions, establishment, allEstablishments, loading, user, session,
      addProduct, updateStock, createOrder, addExpense, addClient, toggleStaffStatus, updateEstablishment, registerEstablishment, validateEstablishment,
      switchEstablishment, signOut
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within an AppProvider')
  return context
}
