
import { supabaseService } from './src/services/supabaseService'
import { supabase } from './src/lib/supabase'

async function debug() {
  console.log('--- Debugging Sync ---')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.log('No user logged in')
    return
  }
  console.log('User ID:', user.id)

  try {
    const ests = await supabaseService.getEstablishments()
    console.log('Establishments found:', ests.length)
    if (ests.length > 0) {
      const estId = ests[0].id
      console.log('Testing with Est ID:', estId)

      console.log('Fetching Products...')
      await supabaseService.getProducts(estId)
      console.log('Products OK')

      console.log('Fetching Tables...')
      const tbls = await supabaseService.getTables(estId)
      console.log('Tables OK:', tbls.length)

      console.log('Fetching Orders...')
      const ords = await supabaseService.getOrders(estId)
      console.log('Orders OK:', ords.length)
    }
  } catch (e: any) {
    console.error('FAILED:', e.message || e)
    console.error('Details:', JSON.stringify(e, null, 2))
  }
}

debug()
