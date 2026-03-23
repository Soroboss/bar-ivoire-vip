import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rhrvhnnonaxonnxnhajq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing - using mock client")
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient()
