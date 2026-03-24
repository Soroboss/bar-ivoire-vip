import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js' // Fallback to raw supabase to use service_role safely

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, role, fullName, permissions } = await request.json()

    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!

    // Client anonyme pour l'inscription uniquement (ne pas contaminer la session)
    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Client Admin (hérite du token de l'utilisateur qui a fait la requête)
    const adminClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: authHeader } }
    })

    // 1. Inviter l'utilisateur (on génère un mot de passe sécurisé qu'il devra changer)
    // Comme InsForge ne fournit pas de service_role facilement, on passe par le signUp standard
    // Le système lui enverra directement le mail de confirmation habituel.
    const tempPassword = Math.random().toString(36).slice(-12) + "A!1a"
    const { data: authData, error: authError } = await anonClient.auth.signUp({
      email,
      password: tempPassword,
      options: {
        data: {
          full_name: fullName,
          phone,
        }
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json({ error: "Cet email est déjà enregistré." }, { status: 400 })
      }
      throw authError
    }

    const userId = authData.user?.id
    if (!userId) throw new Error("ID utilisateur non généré.")

    // 2. Mettre à jour la table profiles avec le rôle et les permissions
    // On utilise la fonction RPC 'admin_create_profile' configurée en SECURITY DEFINER
    const { error: profileError } = await adminClient.rpc('admin_create_profile', {
      p_id: userId,
      p_email: email,
      p_full_name: fullName,
      p_role: role,
      p_permissions: permissions,
      p_phone: phone || ''
    })

    if (profileError) {
      console.error("Erreur mise à jour profil (RPC):", profileError)
    }

    // Return the result with the temp password so the frontend can optionally show it
    return NextResponse.json({ 
      success: true, 
      user: authData.user, 
      tempPassword 
    }, { status: 200 })
    
  } catch (error: any) {
    console.error("User Creation API Error:", error)
    return NextResponse.json(
      { error: error.message || "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
