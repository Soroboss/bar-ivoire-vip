import { createClient } from '@insforge/sdk'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY

if (!baseUrl || !anonKey) {
  console.error("Missing config")
  process.exit(1)
}

const insforge = createClient({ baseUrl, anonKey })

async function run() {
  const { data: authData, error: authErr } = await insforge.auth.signInWithPassword({
    email: 'testpartner@ivoirebar.vip',
    password: 'TestPartner123!'
  })

  if (authErr) {
    console.error("Auth ERROR:", authErr.message || authErr)
    return
  }

  console.log("Logged in UID:", authData.user?.id)

  const { data: ests, error: estsErr } = await insforge.database
    .from('establishments')
    .select('*')
    .order('created_at', { ascending: false })

  console.log("Establishments:", ests)
  if (estsErr) console.error("Est Err:", estsErr)
}

run()
