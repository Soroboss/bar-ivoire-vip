import { insforge } from '@/lib/insforge'
import { 
  Establishment, Product, Order, Client, Staff, 
  Expense, SaasTransaction, Table, Profile 
} from '@/types'

// Mappers
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
  whatsapp: est.whatsapp || '',
  status: (est.status || 'Pending') as Establishment['status'],
  trialEndsAt: est.trial_ends_at || new Date().toISOString(),
  plan: (est.plan || 'Trial') as Establishment['plan'],
  createdAt: est.created_at || new Date().toISOString(),
  userId: est.user_id || ''
})

const mapProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  category: p.category || 'Général',
  price: Number(p.selling_price) || 0,
  stock: p.stock_quantity || 0,
  unit: p.unit || 'bouteille',
  image: p.image_url || ''
})

export const insforgeService = {
  // Establishments
  async getEstablishments(): Promise<Establishment[]> {
    const { data, error } = await insforge.database
      .from('establishments')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    
    return (data || []).map(mapEstablishment)
  },

  async createEstablishment(est: Partial<Establishment> & { user_id: string }): Promise<Establishment> {
    const { data, error } = await insforge.database
      .from('establishments')
      .insert([{
        name: est.name,
        location: est.location,
        type: est.type,
        currency: est.currency || 'XOF',
        tax_rate: est.taxRate || 18,
        invoice_note: est.invoiceNote || 'Merci de votre visite !',
        user_id: est.user_id,
        status: 'Pending',
        plan: est.plan || 'Trial',
        whatsapp: est.whatsapp,
        owner: est.owner
      }])
      .select()
      .single()
    if (error) throw error
    return mapEstablishment(data)
  },

  async updateEstablishmentStatus(id: string, status: string) {
    const { error, data } = await insforge.database
      .from('establishments')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
  },

  async updateEstablishmentPlan(id: string, plan: string) {
    const { error } = await insforge.database
      .from('establishments')
      .update({ plan })
      .eq('id', id)
    if (error) throw error
  },

  async renewEstablishment(id: string, months: number, plan: string, amount: number) {
    const trialEndsAt = new Date()
    trialEndsAt.setMonth(trialEndsAt.getMonth() + months)
    
    const { error: updateError } = await insforge.database
      .from('establishments')
      .update({ 
        plan,
        trial_ends_at: trialEndsAt.toISOString(),
        status: 'Active'
      })
      .eq('id', id)
    
    if (updateError) throw updateError

    // Log transaction
    await insforge.database
      .from('saas_transactions')
      .insert([{
        establishment_id: id,
        amount,
        plan,
        status: 'Completed'
      }])
  },

  // Products
  async getProducts(establishmentId: string): Promise<Product[]> {
    const { data, error } = await insforge.database
      .from('products')
      .select('*')
      .eq('establishment_id', establishmentId)
    if (error) throw error
    
    return (data || []).map(mapProduct)
  },

  async addProduct(product: Omit<Product, 'id'> & { establishment_id: string }): Promise<Product> {
    const { data, error } = await insforge.database
      .from('products')
      .insert([{
        establishment_id: product.establishment_id,
        name: product.name,
        category: product.category,
        selling_price: product.price,
        stock_quantity: product.stock,
        unit: product.unit,
        image_url: product.image
      }])
      .select()
      .single()
    if (error) throw error
    
    return mapProduct(data)
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await insforge.database
      .from('products')
      .update({
        name: updates.name,
        category: updates.category,
        selling_price: updates.price,
        stock_quantity: updates.stock,
        unit: updates.unit,
        image_url: updates.image
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    
    return mapProduct(data)
  },

  async deleteProduct(id: string) {
    const { error } = await insforge.database
      .from('products')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Orders
  async createOrder(order: any) {
    const { data: orderData, error: orderError } = await insforge.database
      .from('orders')
      .insert([{
        establishment_id: order.establishment_id,
        table_id: order.tableId,
        staff_id: order.staffId,
        total_amount: order.total,
        status: order.status
      }])
      .select()
      .single()

    if (orderError) throw orderError

    const items = order.items.map((item: any) => ({
      order_id: (orderData as any).id,
      product_id: item.productId,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.price
    }))

    const { error: itemsError } = await insforge.database
      .from('order_items')
      .insert(items)

    if (itemsError) throw itemsError
    return orderData
  },

  async getOrders(establishmentId: string): Promise<Order[]> {
    const { data, error } = await insforge.database
      .from('orders')
      .select('*, order_items(*)')
      .eq('establishment_id', establishmentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return ((data as any[]) || []).map((o) => ({
      id: o.id,
      tableId: o.table_id,
      total: Number(o.total_amount),
      status: (o.status === 'en cours' ? 'pending' : o.status === 'payée' ? 'completed' : 'cancelled') as Order['status'],
      createdAt: o.created_at,
      items: (o.order_items || []).map((i: any) => ({
        productId: i.product_id,
        name: i.name || 'Produit',
        quantity: i.quantity,
        price: Number(i.unit_price)
      }))
    }))
  },

  // Tables
  async getTables(establishmentId: string) {
    const { data, error } = await insforge.database
      .from('tables')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('name', { ascending: true })
    
    if (error) throw error
    return ((data as any[]) || []).map((t) => ({
      id: t.id,
      name: t.name,
      status: (t.status === 'libre' ? 'Libre' : 'Occupée') as 'Libre' | 'Occupée',
      capacity: t.capacity
    }))
  },

  async addTable(table: any) {
    const { data, error } = await insforge.database
      .from('tables')
      .insert([table])
      .select()
      .single()
    if (error) throw error
    const t = data as any
    return {
      id: t.id,
      name: t.name,
      status: (t.status === 'libre' ? 'Libre' : 'Occupée') as 'Libre' | 'Occupée',
      capacity: t.capacity
    }
  },

  // Clients
  async getClients(establishmentId: string): Promise<Client[]> {
    const { data, error } = await insforge.database
      .from('clients_vip')
      .select('*')
      .eq('establishment_id', establishmentId)
    if (error) throw error
    return (data || []) as Client[]
  },

  async addClient(client: Omit<Client, 'id' | 'points' | 'tier'> & { establishment_id: string }): Promise<Client> {
    const { data, error } = await insforge.database
      .from('clients_vip')
      .insert([client])
      .select()
      .single()
    if (error) throw error
    return data as Client
  },

  // Staff
  async getStaff(establishmentId: string): Promise<Staff[]> {
    const { data, error } = await insforge.database
      .from('profiles')
      .select('*')
      .eq('establishment_id', establishmentId)
    if (error) throw error
    return (data || []).map((s: any) => ({
      id: s.id,
      name: s.full_name,
      role: s.role,
      status: 'Present'
    })) as Staff[]
  },

  async updateStaffStatus(id: string, status: string) {
    const { error } = await insforge.database
      .from('profiles')
      .update({ status })
      .eq('id', id)
    if (error) throw error
  },

  // Expenses
  async getExpenses(establishmentId: string): Promise<Expense[]> {
    const { data, error } = await insforge.database
      .from('expenses')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('date', { ascending: false })
    if (error) throw error
    return (data || []) as Expense[]
  },

  async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const { data, error } = await insforge.database
      .from('expenses')
      .insert([expense])
      .select()
      .single()
    if (error) throw error
    return data as Expense
  },

  // Team & Role Management
  async getTeamMembers(): Promise<Profile[]> {
    const { data, error } = await insforge.database
      .from('profiles')
      .select('*, roles(name)')
      .in('role', ['SUPER_ADMIN', 'ADMIN', 'CASHIER', 'WAITER', 'BARMAN'])
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as any[] || []).map(p => ({
      ...p,
      role_name: p.roles?.name
    })) as Profile[]
  },

  async getProfileByUserId(userId: string): Promise<Profile | null> {
    const { data, error } = await insforge.database
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) return null
    return data as Profile
  },

  async assignRoleByEmail(email: string, role: string): Promise<boolean> {
    const { data: profile, error: findError } = await insforge.database
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()
    
    if (findError) throw new Error("Utilisateur non trouvé dans les profils.")

    const { error: updateError } = await insforge.database
      .from('profiles')
      .update({ role: role })
      .eq('id', profile.id)
      .select()
      .single()
    
    if (updateError) throw updateError
    return true
  },

  async updateUserRole(id: string, role: string): Promise<boolean> {
    const { error: updateError } = await insforge.database
      .from('profiles')
      .update({ 
        role: role
      })
      .eq('id', id)
      .select()
      .single()
    
    if (updateError) throw updateError
    return true
  },

  async revokeAccess(userId: string) {
    const { error } = await insforge.database
      .from('profiles')
      .update({ 
        role: null,
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return true
  },

  // RBAC
  async getRoles() {
    const { data, error } = await insforge.database
      .from('roles')
      .select('*, role_permissions(*, permissions(*))')
    if (error) throw error
    return data
  },

  async getPermissions() {
    const { data, error } = await insforge.database
      .from('permissions')
      .select('*')
    if (error) throw error
    return data
  },

  async createRole(name: string, description?: string) {
    const { data, error } = await insforge.database
      .from('roles')
      .insert([{ name, description }])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    // Delete existing
    const { error: delError } = await insforge.database
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId)
    if (delError) throw delError

    // Insert new
    if (permissionIds.length > 0) {
      const toInsert = permissionIds.map(pid => ({
        role_id: roleId,
        permission_id: pid
      }))
      const { error: insError } = await insforge.database
        .from('role_permissions')
        .insert(toInsert)
      if (insError) throw insError
    }
  },

  // Transactions
  async getSaaSTransactions(): Promise<SaasTransaction[]> {
    const { data, error } = await insforge.database
      .from('saas_transactions')
      .select('*, establishments(name)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as SaasTransaction[]
  },

  async updateUserPermissions(userId: string, permissions: any) {
    const { error } = await insforge.database
      .from('profiles')
      .update({ permissions })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
  },

  async deleteUser(userId: string) {
    const { error } = await insforge.database.rpc('admin_delete_user', { p_user_id: userId })
    if (error) throw error
    return true
  },

  async updateUser(userId: string, updates: any) {
    const { error } = await insforge.database
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return true
  },

  async sendResetPasswordEmail(email: string) {
    const { data, error } = await insforge.auth.sendResetPasswordEmail({ email })
    if (error) throw error
    return data
  }
}
