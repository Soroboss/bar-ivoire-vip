import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is required for cleanup.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function cleanDatabase() {
  console.log('--- Database Cleanup Started ---')
  
  const tables = [
    'order_items',
    'orders',
    'stock_movements',
    'expenses',
    'saas_transactions',
    'clients',
    'clients_vip',
    'staff',
    'products',
    'categories',
    'tables',
    'subscriptions',
    'establishments'
  ]

  for (const table of tables) {
    console.log(`Cleaning table: ${table}...`)
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) {
      console.warn(`Could not clean ${table}:`, error.message)
    } else {
      console.log(`Table ${table} cleaned.`)
    }
  }

  console.log('--- Database Cleanup Finished ---')
}

const targetEmail = process.argv[2]

async function promoteAdmin(email: string) {
  console.log(`Promoting ${email} to SUPER_ADMIN...`)
  const { error } = await supabase
    .from('profiles')
    .update({ role: 'SUPER_ADMIN' })
    .eq('email', email)

  if (error) {
    console.error(`Failed to promote ${email}:`, error.message)
  } else {
    console.log(`${email} is now a SUPER_ADMIN!`)
  }
}

async function run() {
  await cleanDatabase()
  if (targetEmail) {
    await promoteAdmin(targetEmail)
  } else {
    console.log('No email provided for admin promotion. Skipping.')
  }
}

run()
