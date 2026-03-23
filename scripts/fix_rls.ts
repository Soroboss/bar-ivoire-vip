import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is required.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function fixRLS() {
  console.log('--- Fixing RLS for Establishments ---')
  
  const sql = `
    -- 1. Activer RLS
    ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;

    -- 2. Nettoyer les anciennes politiques pour éviter les conflits
    DROP POLICY IF EXISTS "Users can view their establishment" ON public.establishments;
    DROP POLICY IF EXISTS "Users can insert their establishment" ON public.establishments;
    DROP POLICY IF EXISTS "Users can update their establishment" ON public.establishments;
    DROP POLICY IF EXISTS "SuperAdmins look establishments" ON public.establishments;

    -- 3. Créer de nouvelles politiques robustes
    CREATE POLICY "Establishment Select Policy" ON public.establishments
        FOR SELECT USING (user_id = auth.uid() OR is_super_admin());

    CREATE POLICY "Establishment Insert Policy" ON public.establishments
        FOR INSERT WITH CHECK (user_id = auth.uid() OR is_super_admin());

    CREATE POLICY "Establishment Update Policy" ON public.establishments
        FOR UPDATE USING (user_id = auth.uid() OR is_super_admin());
        
    -- S'assurer que la colonne owner existe aussi tant qu'on y est
    ALTER TABLE public.establishments ADD COLUMN IF NOT EXISTS owner TEXT;
  `

  try {
    const { error } = await supabase.rpc('exec_sql', { query: sql })
    if (error) {
      console.warn('RPC exec_sql failed:', error.message)
      console.log('MANUAL ACTION REQUIRED: Please run the following SQL in your Supabase SQL Editor:')
      console.log(sql)
    } else {
      console.log('RLS and Policies fixed successfully.')
    }
  } catch (err: any) {
    console.error('Unexpected error:', err.message)
    console.log('MANUAL ACTION REQUIRED: Please run the following SQL in your Supabase SQL Editor:')
    console.log(sql)
  }
}

fixRLS()
