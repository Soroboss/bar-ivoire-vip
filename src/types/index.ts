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
  staffId?: string
  staff_id?: string
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
  whatsapp?: string
  status: 'Pending' | 'Active' | 'Suspended'
  trialEndsAt: string
  plan: 'Trial' | 'Business' | 'VIP' | 'Enterprise'
  createdAt: string
  userId?: string
}

export type Expense = {
  id: string
  establishment_id: string
  description: string
  amount: number
  category: string
  date: string
  status?: string
}

export type SaasTransaction = {
  id: string
  establishment_id: string
  amount: number
  plan: string
  status: string
  payment_method: string
  created_at: string
  establishments?: { name: string }
}

export type Table = {
  id: string
  name: string
  status: 'Libre' | 'Occupée'
  capacity: number
}

export type Profile = {
  id: string
  email: string
  full_name: string
  role: 'ADMIN' | 'CASHIER' | 'WAITER' | 'BARMAN' | 'SUPER_ADMIN'
  role_id?: string
  permissions?: Record<string, boolean>
  avatar_url?: string
  phone?: string
  establishment_id?: string
  created_at: string
}

export type Plan = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  billing_period: string
  trial_days: number
  features: string[]
  is_active: boolean
  display_order: number
  color_badge: string
}

export type UserSubscription = {
  id: string
  establishment_id: string
  plan_id: string
  plan: string // Keep for legacy
  active: boolean
  expires_at: string
  status: 'trial' | 'active' | 'expired' | 'suspended' | 'pending'
  discount_amount: number
  discount_percent: number
  discount_reason?: string
  trial_started_at: string
  created_at: string
  saas_plans?: Plan
  establishments?: Establishment
}
