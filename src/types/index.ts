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
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  avatar_url?: string
  created_at: string
}
