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
    return data as Product[]
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

  // Orders
  async createOrder(order: any) {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        establishment_id: order.establishment_id,
        table_id: order.tableId,
        total: order.total,
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
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(items)

    if (itemsError) throw itemsError
    return orderData
  },

  // Clients
  async getClients(establishmentId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('establishment_id', establishmentId)
    if (error) throw error
    return data as Client[]
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
    return data as Staff[]
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
    return data
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
  }
}
