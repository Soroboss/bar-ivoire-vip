import { supabase } from '@/lib/supabase'
import { Establishment, Product, Order, Client, Staff } from '@/context/AppContext'

// Modèles de données pour Supabase (Snake Case)
export const supabaseService = {
  // Establishments
  async getEstablishments() {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    
    // Mapping Snake to Camel
    return data.map((est: any) => ({
      ...est,
      logo: est.logo_url,
      taxRate: est.tax_rate,
      invoiceNote: est.invoice_note,
      trialEndsAt: est.trial_ends_at,
      createdAt: est.created_at,
      userId: est.user_id
    })) as Establishment[]
  },

  async createEstablishment(est: any) {
    const { data, error } = await supabase
      .from('establishments')
      .insert([{
        name: est.name,
        owner: est.owner,
        phone: est.phone,
        location: est.location,
        type: est.type,
        currency: est.currency || 'XOF',
        tax_rate: est.taxRate || est.tax_rate || 18,
        invoice_note: est.invoiceNote || est.invoice_note || 'Merci de votre visite !',
        user_id: est.user_id,
        status: 'Pending',
        plan: est.plan || 'Trial'
      }])
      .select()
      .single()
    if (error) throw error
    return {
      ...data,
      taxRate: data.tax_rate,
      invoiceNote: data.invoice_note,
      trialEndsAt: data.trial_ends_at,
      createdAt: data.created_at,
      userId: data.user_id
    } as Establishment
  },

  async updateEstablishmentStatus(id: string, status: string) {
    const { error } = await supabase
      .from('establishments')
      .update({ status })
      .eq('id', id)
    if (error) throw error
  },

  async updateEstablishmentPlan(id: string, plan: string) {
    const { error } = await supabase
      .from('establishments')
      .update({ plan })
      .eq('id', id)
    if (error) throw error
  },

  // Products
  async getProducts(establishmentId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('establishment_id', establishmentId)
    if (error) throw error
    return data || []
  },

  async addProduct(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    if (error) throw error
    return data as Product
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Product
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Orders
  async createOrder(order: any) {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        establishment_id: order.establishment_id,
        table_id: order.tableId,
        total_amount: order.total,
        status: order.status
      }])
      .select()
      .single()

    if (orderError) throw orderError

    const items = order.items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.productId,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(items)

    if (itemsError) throw itemsError
    return orderData
  },

  async getOrders(establishmentId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('establishment_id', establishmentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return (data || []).map((o: any) => ({
      id: o.id,
      tableId: o.table_id,
      total: Number(o.total_amount),
      status: o.status === 'en cours' ? 'pending' : o.status === 'payée' ? 'completed' : 'cancelled',
      createdAt: o.created_at,
      items: (o.order_items || []).map((i: any) => ({
        productId: i.product_id,
        name: i.name || 'Produit',
        quantity: i.quantity,
        price: Number(i.unit_price)
      }))
    })) as Order[]
  },

  // Tables
  async getTables(establishmentId: string) {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('name', { ascending: true })
    
    if (error) throw error
    return (data || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      status: t.status === 'libre' ? 'Libre' : 'Occupée',
      capacity: t.capacity
    }))
  },

  async addTable(table: any) {
    const { data, error } = await supabase
      .from('tables')
      .insert([table])
      .select()
      .single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      status: data.status === 'libre' ? 'Libre' : 'Occupée',
      capacity: data.capacity
    }
  },

  // Clients
  async getClients(establishmentId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('establishment_id', establishmentId)
    if (error) throw error
    return (data || []) as Client[]
  },

  async addClient(client: any) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single()
    if (error) throw error
    return data as Client
  },

  // Staff
  async getStaff(establishmentId: string) {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('establishment_id', establishmentId)
    if (error) throw error
    return (data || []) as Staff[]
  },

  async updateStaffStatus(id: string, status: string) {
    const { error } = await supabase
      .from('staff')
      .update({ status })
      .eq('id', id)
    if (error) throw error
  },

  // SaaS Transactions (Global)
  async getSaaSTransactions() {
    const { data, error } = await supabase
      .from('saas_transactions')
      .select('*, establishments(name)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  // Expenses (Establishment Level)
  async getExpenses(establishmentId: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('date', { ascending: false })
    if (error) throw error
    return data
  },

  async addExpense(expense: any) {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async renewEstablishment(id: string, months: number, plan: string, amount: number) {
    // Calculates the new expiry date based on the current one or NOW
    const { data: est, error: getError } = await supabase
      .from('establishments')
      .select('trial_ends_at')
      .eq('id', id)
      .single()
    
    if (getError) throw getError

    const currentExpiry = est.trial_ends_at ? new Date(est.trial_ends_at) : new Date()
    const baseDate = currentExpiry > new Date() ? currentExpiry : new Date()
    const newExpiry = new Date(baseDate.setMonth(baseDate.getMonth() + months))

    // 1. Update establishment
    const { error: updateError } = await supabase
      .from('establishments')
      .update({ 
        trial_ends_at: newExpiry.toISOString(),
        plan: plan,
        status: 'Active'
      })
      .eq('id', id)
    
    if (updateError) throw updateError

    // 2. Record transaction
    const { error: txError } = await supabase
      .from('saas_transactions')
      .insert([{
        establishment_id: id,
        amount: amount,
        plan: plan,
        status: 'success',
        payment_method: 'admin_manual'
      }])
    
    if (txError) throw txError

    return newExpiry
  },

  // Admin Management
  async getAdminUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['SUPER_ADMIN', 'ADMIN'])
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async promoteUserToAdmin(email: string) {
    // 1. Find user by email in auth.users (can only follow profiles if they exist)
    // Actually, we can just upsert into profiles if we have the ID.
    // But we need the ID from the email.
    
    // We'll use a RPC or a specific query if the user has already a profile.
    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()
    
    if (findError) throw new Error("Utilisateur non trouvé dans les profils. Il doit d'abord se connecter une fois.")

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'SUPER_ADMIN' })
      .eq('id', profile.id)
    
    if (updateError) throw updateError
    return true
  }
}
