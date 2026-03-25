"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { insforgeService } from '@/services/insforgeService'
import { toast } from 'sonner'
import { insforge } from '@/lib/insforge'

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
  user: any | null
  isSignedIn: boolean
  userRole: string | null
  userFullName: string | null
  userPermissions: any | null
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
  login: (email: string, pass: string) => Promise<any>
  getAuthToken: () => string | null
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
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
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userFullName, setUserFullName] = useState<string | null>(null)
  const [userPermissions, setUserPermissions] = useState<any | null>(null)
  
  const isSignedIn = !!user

  useEffect(() => {
    let mounted = true;
    const authProvider = insforge.auth as any;

    // Get initial user state
    authProvider.getCurrentUser().then(({ data }: any) => {
      if (!mounted) return;
      const activeUser = data?.user || null;
      setUser(activeUser);
      if (activeUser) {
        loadUserData(activeUser);
      } else {
        setLoading(false);
        resetState();
      }
    }).catch((err: any) => {
      console.error('[AppContext] Initial auth check failed:', err);
      if (mounted) {
        setLoading(false);
        resetState();
      }
    });

    // Note: onAuthStateChange is not available in @insforge/sdk 1.2.0.
    // Auth state changes are handled manually through login/signOut functions.

    return () => {
      mounted = false;
    }
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

  async function loadUserData(user: any, retryCount = 0) {
    const userId = user.id
    console.log(`[AppContext] Starting data load (Attempt ${retryCount + 1}) for user:`, userId)
    
    try {
      setLoading(true)
      
      // Delay to allow SDK to sync token
      if (retryCount === 0) {
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      // 1. Parallelize initial profile and establishments fetch
      const [profileRes, estsRes, transactionsRes] = await Promise.all([
        insforge.database.from('profiles').select('role, full_name').eq('id', userId).maybeSingle(),
        insforgeService.getEstablishments().catch(err => {
          console.error('[AppContext] Establishments fetch error:', err)
          return [] as Establishment[]
        }),
        insforgeService.getSaaSTransactions().catch(() => [])
      ])
      
      // Map legacy SUPER_ADMIN to Admin for backwards compatibility
      let currentRole = profileRes.data?.role ? profileRes.data.role.toString() : null
      
      // Retry if profile/role is missing on first attempts (transient 403/sync issue)
      if (!currentRole && retryCount < 2) {
        console.warn('[AppContext] Empty profile/role detected, retrying...')
        setTimeout(() => loadUserData(user, retryCount + 1), 1000)
        return
      }

      if (currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN') currentRole = 'Admin'
      setUserRole(currentRole)
      setUserFullName(profileRes.data?.full_name || null)
      
      // Fetch permissions
      if (profileRes.data) {
        const { data: profileData } = await insforge.database
          .from('profiles')
          .select('permissions')
          .eq('id', userId)
          .maybeSingle()
        setUserPermissions(profileData?.permissions || null)
      }
      
      const ests = Array.isArray(estsRes) ? estsRes : []
      
      // Retry if Admin but 0 establishments found (RLS transient failure)
      if (currentRole === 'Admin' && ests.length === 0 && retryCount < 2) {
        console.warn('[AppContext] Admin detected but 0 establishments, retrying...')
        setTimeout(() => loadUserData(user, retryCount + 1), 1500)
        return
      }

      setAllEstablishments(ests)
      setSaaSTransactions(Array.isArray(transactionsRes) ? transactionsRes : [])

      // 2. Identify and Load User Establishment Data
      const userEst = ests.find(e => e.userId === userId) || (currentRole === 'Admin' ? ests[0] : null)
      
      if (userEst) {
        setEstablishment(userEst)
        console.log('[AppContext] Target Establishment active:', userEst.name)
        
        // --- CRITICAL PHASE END: Unblock the UI ---
        setLoading(false)

        // --- BACKGROUND PHASE: Load heavy data ---
        Promise.all([
          insforgeService.getProducts(userEst.id).catch(() => []),
          insforgeService.getStaff(userEst.id).catch(() => []),
          insforgeService.getClients(userEst.id).catch(() => []),
          insforgeService.getOrders(userEst.id).catch(() => []),
          insforgeService.getTables(userEst.id).catch(() => []),
          insforgeService.getExpenses(userEst.id).catch(() => [])
        ]).then(([prods, stff, clnts, ords, tbls, exps]) => {
          setProducts(prods)
          setStaff(stff)
          setClients(clnts)
          setOrders(ords)
          setTables(tbls as Table[])
          setExpenses(exps as Expense[])
          console.log('[AppContext] Heavy background data loaded.')
        })
      } else {
        console.log('[AppContext] No establishment found for user.')
        setLoading(false)
      }

      // 3. Load Additional Admin Data if needed
      if (currentRole === 'Admin') {
        insforgeService.getTeamMembers().catch(err => {
          console.error('[AppContext] Team fetch error:', err)
          return []
        })
      }

    } catch (error: any) {
      console.error('[AppContext] Unexpected global load error:', error)
      toast.error('Erreur lors de la synchronisation des données.')
      setLoading(false)
    } finally {
      console.log('[AppContext] Data load logic finished for attempt:', retryCount + 1)
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
    setUserFullName(null)
    setUserPermissions(null)
  }

  const signOut = async () => {
    await insforge.auth.signOut()
    setUser(null)
    resetState()
    toast.success('Déconnexion réussie')
  }

  const login = async (email: string, pass: string) => {
    try {
      setLoading(true)
      const { data, error } = await insforge.auth.signInWithPassword({ email, password: pass })
      if (error) throw error
      
      if (data?.user) {
        setUser(data.user)
        await loadUserData(data.user)
      }
      return { data, error }
    } catch (err: any) {
      setLoading(false)
      throw err
    }
  }

  const getAuthToken = () => {
    const auth = insforge.auth as any
    // Try multiple paths to find the most up-to-date token
    return (
      auth.tokenManager?.getAccessToken() || 
      auth.http?.userToken || 
      auth.session?.accessToken ||
      null
    )
  }

  const addProduct = async (p: Omit<Product, 'id'>) => {
    if (!establishment) return
    try {
      const newProd = await insforgeService.addProduct({ ...p, establishment_id: establishment.id })
      setProducts([...products, newProd])
      toast.success('Produit ajouté au catalogue Cloud')
    } catch (err) {
      toast.error('Erreur lors de l\'ajout')
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updated = await insforgeService.updateProduct(id, updates)
      setProducts(products.map(p => p.id === id ? updated : p))
      toast.success('Produit mis à jour')
    } catch (err) {
      toast.error('Erreur lors de la modification')
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await insforgeService.deleteProduct(id)
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
      await insforgeService.createOrder({ ...o, establishment_id: establishment.id })
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
      const newExp = await insforgeService.addExpense({ ...exp, establishment_id: establishment.id })
      setExpenses([newExp, ...expenses])
      toast.success('Dépense enregistrée Cloud')
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement de la dépense')
    }
  }

  const addClient = async (c: Omit<Client, 'id' | 'points' | 'tier'>) => {
    if (!establishment) return
    try {
      const newClient = await insforgeService.addClient({ ...c, establishment_id: establishment.id })
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
      await insforgeService.updateStaffStatus(id, newStatus)
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
      const newEst = await insforgeService.createEstablishment({ ...est, user_id: user.id })
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
      await insforgeService.updateEstablishmentStatus(id, status)
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
        insforgeService.getProducts(target.id),
        insforgeService.getClients(target.id),
        insforgeService.getStaff(target.id),
        insforgeService.getExpenses(target.id),
        insforgeService.getOrders(target.id),
        insforgeService.getTables(target.id)
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
      const newTable = await insforgeService.addTable({ 
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
      products, orders, clients, staff, expenses, saasTransactions, establishment, allEstablishments, tables, loading, user: user, 
      isSignedIn: isSignedIn, 
      userRole, userFullName, userPermissions,
      addProduct, updateProduct, deleteProduct, updateStock, createOrder, addExpense, addClient, toggleStaffStatus, updateEstablishment, registerEstablishment, validateEstablishment,
      switchEstablishment, addTable, signOut, login, getAuthToken
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
