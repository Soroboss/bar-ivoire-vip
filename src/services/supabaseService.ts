import { supabase } from '@/lib/supabase'
import { 
  Establishment, Product, Order, Client, Staff, 
  Expense, SaasTransaction, Table, Profile 
} from '@/types'

// Database row types (Snake Case)
interface EstablishmentRow {
  id: string
  name: string
  owner: string
  phone: string
  location: string
  type: string
  logo_url?: string
  currency: string
  tax_rate: number
  invoice_note: string
  status: 'Pending' | 'Active' | 'Suspended'
  trial_ends_at: string
  plan: 'Trial' | 'Business' | 'VIP' | 'Enterprise'
  created_at: string
  user_id: string
}

interface ProductRow {
  id: string
  establishment_id: string
  name: string
  category: string
  price: number
  stock: number
  unit: string
  image_url?: string
}

interface OrderRow {
  id: string
  establishment_id: string
  table_id: string
  total_amount: number
  status: string
  created_at: string
}

interface OrderItemRow {
  id: string
  order_id: string
  product_id: string
  name: string
  quantity: number
  unit_price: number
}

interface TableRow {
  id: string
  establishment_id: string
  name: string
  status: 'libre' | 'occupée'
  capacity: number
}

interface ExpenseRow {
  id: string
  establishment_id: string
  description: string
  amount: number
  category: string
  date: string
  status?: string
}

interface OrderInput {
  establishment_id: string
  tableId: string
  total: number
  status: string
  items: { productId: string; name: string; quantity: number; price: number }[]
}

const mapEstablishment = (est: any): Establishment => ({
  id: est.id,
  name: est.name || 'Sans nom',
  owner: est.owner || 'N/A',
  phone: est.phone || 'N/A',
  location: est.location || 'N/A',
  type: est.type || 'bar',
  logo: est.logo_url || '',
  currency: est.currency || 'XOF',
  taxRate: Number(est.tax_rate) || 0,
  invoiceNote: est.invoice_note || '',
  status: (est.status || 'Pending') as Establishment['status'],
  trialEndsAt: est.trial_ends_at || new Date().toISOString(),
  plan: (est.plan || 'Trial') as Establishment['plan'],
  createdAt: est.created_at || new Date().toISOString(),
  userId: est.user_id || ''
})

export const supabaseService = {
  // Establishments
  async getEstablishments(): Promise<Establishment[]> {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    
    return (data as EstablishmentRow[] || []).map(mapEstablishment)
  },

  async createEstablishment(est: Partial<Establishment> & { user_id: string }): Promise<Establishment> {
    const { data, error } = await supabase
      .from('establishments')
      .insert([{
        name: est.name,
        owner: est.owner,
        phone: est.phone,
        location: est.location,
        type: est.type,
        currency: est.currency || 'XOF',
        tax_rate: est.taxRate || 18,
        invoice_note: est.invoiceNote || 'Merci de votre visite !',
        user_id: est.user_id,
        status: 'Pending',
        plan: est.plan || 'Trial'
      }])
      .select()
      .single()
    if (error) throw error
    return mapEstablishment(data as EstablishmentRow)
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
  async getProducts(establishmentId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('establishment_id', establishmentId)
    if (error) throw error
    
    return (data as ProductRow[] || []).map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      unit: p.unit,
      image: p.image_url
    }))
  },

  async addProduct(product: Omit<Product, 'id'> & { establishment_id: string }): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        establishment_id: product.establishment_id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        unit: product.unit,
        image_url: product.image
      }])
      .select()
      .single()
    if (error) throw error
    
    const p = data as ProductRow
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      unit: p.unit,
      image: p.image_url
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updates.name,
        category: updates.category,
        price: updates.price,
        stock: updates.stock,
        unit: updates.unit,
        image_url: updates.image
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    
    const p = data as ProductRow
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      unit: p.unit,
      image: p.image_url
    }
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Orders
  async createOrder(order: OrderInput) {
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

    const items = order.items.map((item) => ({
      order_id: (orderData as OrderRow).id,
      product_id: item.productId,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(items)

    if (itemsError) throw itemsError
    return orderData as OrderRow
  },

  async getOrders(establishmentId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('establishment_id', establishmentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return ((data as (OrderRow & { order_items: OrderItemRow[] })[]) || []).map((o) => ({
      id: o.id,
      tableId: o.table_id,
      total: Number(o.total_amount),
      status: (o.status === 'en cours' ? 'pending' : o.status === 'payée' ? 'completed' : 'cancelled') as Order['status'],
      createdAt: o.created_at,
      items: (o.order_items || []).map((i) => ({
        productId: i.product_id,
        name: i.name || 'Produit',
        quantity: i.quantity,
        price: Number(i.unit_price)
      }))
    }))
  },

  // Tables
  async getTables(establishmentId: string) {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('name', { ascending: true })
    
    if (error) throw error
    return ((data as TableRow[]) || []).map((t) => ({
      id: t.id,
      name: t.name,
      status: (t.status === 'libre' ? 'Libre' : 'Occupée') as 'Libre' | 'Occupée',
      capacity: t.capacity
    }))
  },

  async addTable(table: Omit<TableRow, 'id'>) {
    const { data, error } = await supabase
      .from('tables')
      .insert([table])
      .select()
      .single()
    if (error) throw error
    const t = data as TableRow
    return {
      id: t.id,
      name: t.name,
      status: (t.status === 'libre' ? 'Libre' : 'Occupée') as 'Libre' | 'Occupée',
      capacity: t.capacity
    }
  },

  // Clients
  async getClients(establishmentId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('establishment_id', establishmentId)
    if (error) throw error
    return (data || []) as Client[]
  },

  async addClient(client: Omit<Client, 'id' | 'points' | 'tier'> & { establishment_id: string }): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single()
    if (error) throw error
    return data as Client
  },

  // Staff
  async getStaff(establishmentId: string): Promise<Staff[]> {
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
  async getSaaSTransactions(): Promise<SaasTransaction[]> {
    const { data, error } = await supabase
      .from('saas_transactions')
      .select('*, establishments(name)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as SaasTransaction[]) || []
  },

  // Expenses (Establishment Level)
  async getExpenses(establishmentId: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('date', { ascending: false })
    if (error) throw error
    return (data as ExpenseRow[] || []).map(e => ({
      id: e.id,
      establishment_id: e.establishment_id,
      description: e.description,
      amount: e.amount,
      category: e.category,
      date: e.date,
      status: e.status
    }))
  },

  async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        establishment_id: expense.establishment_id,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        status: expense.status
      }])
      .select()
      .single()
    if (error) throw error
    const e = data as ExpenseRow
    return {
      id: e.id,
      establishment_id: e.establishment_id,
      description: e.description,
      amount: e.amount,
      category: e.category,
      date: e.date,
      status: e.status
    }
  },

  async renewEstablishment(id: string, months: number, plan: string, amount: number) {
    const { data: est, error: getError } = await supabase
      .from('establishments')
      .select('trial_ends_at')
      .eq('id', id)
      .single()
    
    if (getError) throw getError

    const currentExpiry = (est as EstablishmentRow).trial_ends_at ? new Date((est as EstablishmentRow).trial_ends_at) : new Date()
    const baseDate = currentExpiry > new Date() ? currentExpiry : new Date()
    const newExpiry = new Date(baseDate.setMonth(baseDate.getMonth() + months))

    const { error: updateError } = await supabase
      .from('establishments')
      .update({ 
        trial_ends_at: newExpiry.toISOString(),
        plan: plan,
        status: 'Active'
      })
      .eq('id', id)
    
    if (updateError) throw updateError

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
  async getAdminUsers(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, roles(name)')
      .in('role', ['SUPER_ADMIN', 'ADMIN'])
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as any[] || []).map(p => ({
      ...p,
      role_name: p.roles?.name
    })) as Profile[]
  },

  async promoteUserToAdmin(email: string): Promise<boolean> {
    const { data: role } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'super_admin')
      .single()

    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()
    
    if (findError) throw new Error("Utilisateur non trouvé dans les profils.")

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        role: 'SUPER_ADMIN',
        role_id: role?.id 
      })
      .eq('id', profile.id)
    
    if (updateError) throw updateError
    return true
  },

  async revokeAdminAccess(userId: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        role: 'USER',
        role_id: null 
      })
      .eq('id', userId)
    
    if (error) throw error
    return true
  },

  // RBAC Management
  async getRoles() {
    const { data, error } = await supabase
      .from('roles')
      .select('*, role_permissions(permissions(*))')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getPermissions() {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('name', { ascending: true })
    if (error) throw error
    return data || []
  },

  async createRole(name: string, description: string) {
    const { data, error } = await supabase
      .from('roles')
      .insert([{ name, description }])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    // First, delete existing
    await supabase.from('role_permissions').delete().eq('role_id', roleId)
    
    // Then insert new
    if (permissionIds.length > 0) {
      const inserts = permissionIds.map(pid => ({ role_id: roleId, permission_id: pid }))
      const { error } = await supabase.from('role_permissions').insert(inserts)
      if (error) throw error
    }
  }
}
