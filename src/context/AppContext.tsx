"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabaseService } from '@/services/supabaseService'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

import { 
  Product, Order, Client, Staff, Establishment, Expense, SaasTransaction, Table 
} from '@/types'


type AppContextType = {
  products: Product[]
  orders: Order[]
  clients: Client[]
  staff: Staff[]
  expenses: Expense[]
  saasTransactions: SaasTransaction[]
  establishment: Establishment | null
  allEstablishments: Establishment[]
  tables: Table[]
  loading: boolean
  user: User | null
  session: Session | null
  userRole: string | null
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  updateStock: (productId: string, quantity: number) => void
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>
  addExpense: (expense: Omit<Expense, 'id' | 'establishment_id'>) => Promise<void>
  addClient: (client: Omit<Client, 'id' | 'points' | 'tier'>) => Promise<void>
  toggleStaffStatus: (staffId: string) => Promise<void>
  updateEstablishment: (est: Partial<Establishment>) => void
  registerEstablishment: (est: Omit<Establishment, 'id' | 'status' | 'trialEndsAt' | 'plan' | 'createdAt'>) => Promise<void>
  validateEstablishment: (id: string, status: Establishment['status']) => Promise<void>
  switchEstablishment: (id: string) => Promise<void>
  addTable: (name: string, capacity: number) => Promise<void>
  signOut: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [saasTransactions, setSaaSTransactions] = useState<SaasTransaction[]>([])
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  const [allEstablishments, setAllEstablishments] = useState<Establishment[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[AppContext] Auth state changed:', _event)
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

  // Safety timer to prevent stuck loading screen
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn('[AppContext] Loading safety timeout reached (10s). Forcing loading off.')
        setLoading(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [loading])

  async function loadUserData(userId: string) {
    console.log('[AppContext] Starting data load for user:', userId)
    
    try {
      setLoading(true)
      
      // 1. Parallelize initial profile and establishments fetch
      const [profileRes, estsRes] = await Promise.all([
        supabase.from('profiles').select('role').eq('id', userId).single(),
        supabaseService.getEstablishments().catch(err => {
          console.error('[AppContext] Establishments fetch error:', err)
          return [] as Establishment[]
        })
      ])

      const currentRole = profileRes.data?.role || null
      setUserRole(currentRole)
      console.log('[AppContext] Role detected:', currentRole)
      
      const ests = Array.isArray(estsRes) ? estsRes : []
      setAllEstablishments(ests)
      console.log('[AppContext] Establishments loaded:', ests.length)

      // 2. Identify and Load User Establishment Data
      const userEst = ests.find(e => e.userId === userId) || (currentRole === 'SUPER_ADMIN' ? ests[0] : null)
      
      if (userEst) {
        setEstablishment(userEst)
        console.log('[AppContext] Target Establishment active:', userEst.name)
        
        const [prods, stff, clnts, ords, tbls, exps] = await Promise.all([
          supabaseService.getProducts(userEst.id).catch(() => []),
          supabaseService.getStaff(userEst.id).catch(() => []),
          supabaseService.getClients(userEst.id).catch(() => []),
          supabaseService.getOrders(userEst.id).catch(() => []),
          supabaseService.getTables(userEst.id).catch(() => []),
          supabaseService.getExpenses(userEst.id).catch(() => [])
        ])
        
        setProducts(prods)
        setStaff(stff)
        setClients(clnts)
        setOrders(ords)
        setTables(tbls as Table[])
        setExpenses(exps as Expense[])
      } else {
        console.log('[AppContext] No establishment found for user.')
      }

      // 3. Load SaaS Transactions if Admin
      if (currentRole === 'SUPER_ADMIN') {
        const saasData = await supabaseService.getSaaSTransactions().catch(err => {
          console.error('[AppContext] SaaS Transactions error:', err)
          return []
        })
        setSaaSTransactions(saasData)
      }

    } catch (error: any) {
      console.error('[AppContext] Unexpected global load error:', error)
      toast.error('Erreur lors de la synchronisation des données.')
    } finally {
      setLoading(false)
      console.log('[AppContext] Data load finished.')
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
    setTables([])
    setUserRole(null)
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
    } catch (err) {
      toast.error('Erreur lors de l\'ajout')
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updated = await supabaseService.updateProduct(id, updates)
      setProducts(products.map(p => p.id === id ? updated : p))
      toast.success('Produit mis à jour')
    } catch (err) {
      toast.error('Erreur lors de la modification')
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await supabaseService.deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
      toast.success('Produit supprimé')
    } catch (err) {
      toast.error('Erreur lors de la suppression')
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
    } catch (err) {
      toast.error('Erreur de synchronisation Cloud')
    }
  }

  const addExpense = async (exp: Omit<Expense, 'id' | 'establishment_id'>) => {
    if (!establishment) return
    try {
      const newExp = await supabaseService.addExpense({ ...exp, establishment_id: establishment.id })
      setExpenses([newExp, ...expenses])
      toast.success('Dépense enregistrée Cloud')
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement de la dépense')
    }
  }

  const addClient = async (c: Omit<Client, 'id' | 'points' | 'tier'>) => {
    if (!establishment) return
    try {
      const newClient = await supabaseService.addClient({ ...c, establishment_id: establishment.id })
      setClients([...clients, newClient])
      toast.success('Nouveau client enregistré')
    } catch (err) {
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
    } catch (err) {
      toast.error('Erreur staff')
    }
  }

  const updateEstablishment = (est: Partial<Establishment>) => {
    setEstablishment(prev => prev ? { ...prev, ...est } : null)
  }

  const registerEstablishment = async (est: Omit<Establishment, 'id' | 'status' | 'trialEndsAt' | 'plan' | 'createdAt'>) => {
    if (!user) {
      toast.error('Vous devez être connecté')
      return
    }
    try {
      const newEst = await supabaseService.createEstablishment({ ...est, user_id: user.id })
      setAllEstablishments(prev => [...prev, newEst])
      setEstablishment(newEst)
      toast.success('Établissement enregistré avec succès')
      // Reset dependent data as it's a new establishment
      setProducts([])
      setStaff([])
      setClients([])
      setOrders([])
      setTables([])
      setExpenses([])
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement de l\'établissement')
    }
  }

  const validateEstablishment = async (id: string, status: Establishment['status']) => {
    try {
      await supabaseService.updateEstablishmentStatus(id, status)
      setAllEstablishments(prev => prev.map(e => e.id === id ? { ...e, status } : e))
      if (establishment?.id === id) {
        setEstablishment({ ...establishment, status })
      }
      toast.success('Statut de l\'établissement mis à jour')
    } catch (err) {
      toast.error('Erreur de validation')
    }
  }

  const switchEstablishment = async (id: string) => {
    const target = allEstablishments.find(e => e.id === id)
    if (!target) return
    
    setLoading(true)
    try {
      setEstablishment(target)
      const [prods, cls, stf, exps, ords, tbls] = await Promise.all([
        supabaseService.getProducts(target.id),
        supabaseService.getClients(target.id),
        supabaseService.getStaff(target.id),
        supabaseService.getExpenses(target.id),
        supabaseService.getOrders(target.id),
        supabaseService.getTables(target.id)
      ])
      setProducts(prods)
      setClients(cls)
      setStaff(stf)
      setExpenses(exps as Expense[])
      setOrders(ords)
      setTables(tbls as Table[])
      toast.success(`Passage à l'établissement : ${target.name}`)
    } catch (err) {
      toast.error('Erreur lors du changement d\'établissement')
    } finally {
      setLoading(false)
    }
  }

  const addTable = async (name: string, capacity: number) => {
    if (!establishment) return
    try {
      const newTable = await supabaseService.addTable({ 
        establishment_id: establishment.id, 
        name, 
        capacity,
        status: 'libre'
      })
      setTables([...tables, newTable as Table])
      toast.success('Table ajoutée')
    } catch (err) {
      toast.error('Erreur lors de l\'ajout de la table')
    }
  }

  return (
    <AppContext.Provider value={{ 
      products, orders, clients, staff, expenses, saasTransactions, establishment, allEstablishments, tables, loading, user, session, userRole,
      addProduct, updateProduct, deleteProduct, updateStock, createOrder, addExpense, addClient, toggleStaffStatus, updateEstablishment, registerEstablishment, validateEstablishment,
      switchEstablishment, addTable, signOut
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
