import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is required.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function fixSchema() {
  console.log('--- Fixing Database Schema ---')
  
  try {
    const { error } = await supabase.rpc('exec_sql', { 
      query: 'ALTER TABLE establishments ADD COLUMN IF NOT EXISTS owner TEXT;' 
    })
    
    if (error) {
      console.warn('RPC exec_sql failed:', error.message)
      console.error('Please add "owner" (TEXT) column to "establishments" table manually in Supabase Dashboard.')
    } else {
      console.log('Column "owner" added or already exists.')
    }
  } catch (err: any) {
    console.error('Unexpected error:', err.message)
    console.error('Please add "owner" (TEXT) column to "establishments" table manually in Supabase Dashboard.')
  }
}

fixSchema()
