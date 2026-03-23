import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rhrvhnnonaxonnxnhajq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJocnZobm5vbmF4b25ueG5oYWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTY5NTEsImV4cCI6MjA4OTc5Mjk1MX0.aQUOHzhM-JcV1D-lrj99X7-seWVROWeP9g6XSEZA1DQ'

export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing - using mock client")
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient()
