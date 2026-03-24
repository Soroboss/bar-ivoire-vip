import { NextResponse } from 'next/server'
import { createClient } from '@insforge/sdk'

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).slice(2, 10)
  console.log(`[API-Admin-Users][${requestId}] POST request received`)

  try {
    const body = await request.json()
    const { email, phone, role, fullName, permissions } = body
    console.log(`[API-Admin-Users][${requestId}] Payload:`, { email, role, fullName })

    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      console.error(`[API-Admin-Users][${requestId}] Missing Authorization header`)
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    if (!token || token === 'null') {
      console.error(`[API-Admin-Users][${requestId}] Invalid token: "${token}"`)
      return NextResponse.json({ error: "Session invalide. Veuillez vous reconnecter." }, { status: 401 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!

    if (!baseUrl || !anonKey) {
      console.error(`[API-Admin-Users][${requestId}] Missing environment variables`)
      throw new Error("Configuration serveur incomplète (URL/KEY manquantes).")
    }

    const anonClient = createClient({ baseUrl, anonKey })
    const adminClient = createClient({ baseUrl, anonKey })
    adminClient.getHttpClient().setAuthToken(token)

    console.log(`[API-Admin-Users][${requestId}] Calling signUp for: ${email}`)
    const tempPassword = Math.random().toString(36).slice(-12) + "A!1a"
    const { data: authData, error: authError } = await anonClient.auth.signUp({
      email,
      password: tempPassword,
      name: fullName
    })

    if (authError) {
      console.error(`[API-Admin-Users][${requestId}] Auth Error:`, authError)
      if (authError.message?.includes('already registered') || authError.message?.includes('already exists')) {
        return NextResponse.json({ error: "Cet email est déjà enregistré." }, { status: 400 })
      }
      return NextResponse.json({ error: authError.message || "Erreur lors de l'inscription" }, { status: 400 })
    }

    // Retrieve userId (may be null if verification required)
    const userId = authData?.user?.id || (authData as any)?.id || (authData as any)?.user_id || null
    
    // RACE CONDITION MITIGATION: If userId is null, we wait 1.5s for the auth.users record to propagate 
    // before calling the RPC which performs an email lookup.
    if (!userId) {
       console.log(`[API-Admin-Users][${requestId}] userId null (unverified), waiting for DB propagation...`)
       await new Promise(resolve => setTimeout(resolve, 1500))
    }

    console.log(`[API-Admin-Users][${requestId}] Executing admin_create_profile_v2 for ${email}`)

    const { error: profileError } = await adminClient.database.rpc('admin_create_profile_v2', {
      p_id: userId,
      p_email: email,
      p_full_name: fullName,
      p_role: role,
      p_permissions: permissions,
      p_phone: phone || ''
    })

    if (profileError) {
      console.error(`[API-Admin-Users][${requestId}] RPC Profile Error:`, profileError)
      return NextResponse.json({ error: `Erreur liaison profil: ${profileError.message}` }, { status: 500 })
    }

    console.log(`[API-Admin-Users][${requestId}] Success: Profile linked for ${email}`)

    return NextResponse.json({ 
      success: true, 
      user: (authData && authData.user) ? authData.user : { id: userId, email }, 
      tempPassword,
      requireEmailVerification: authData?.requireEmailVerification || false
    }, { status: 200 })
    
  } catch (error: any) {
    console.error(`[API-Admin-Users][${requestId}] Global Error:`, error)
    return NextResponse.json(
      { error: error.message || "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
