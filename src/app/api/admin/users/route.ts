import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js' // Fallback to raw supabase to use service_role safely

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, role, fullName, permissions } = await request.json()

    const serviceRoleKey = process.env.INSFORGE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Configuration manquante: Clé de service (Service Role Key) introuvable dans le backend." },
        { status: 500 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // 1. Inviter l'utilisateur (crée l'identité Auth et envoie l'email)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: fullName,
        phone,
      }
    })

    if (authError) {
      if (authError.message.includes('already been registered')) {
        return NextResponse.json({ error: "Cet email est déjà enregistré." }, { status: 400 })
      }
      throw authError
    }

    const userId = authData.user?.id
    if (!userId) throw new Error("ID utilisateur non généré.")

    // 2. Mettre à jour la table profiles avec le rôle et les permissions
    // Par défaut, Supabase insère une ligne dans public.profiles via un trigger sur auth.users (si configuré)
    // Nous faisons un upsert pour être sûrs que le rôle et les permissions y sont.
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        email,
        full_name: fullName,
        role: role,
        permissions: permissions,
        phone: phone,
        status: 'Invité', // Statut initial
        updated_at: new Date().toISOString(),
      })

    if (profileError) {
      console.error("Erreur mise à jour profil:", profileError)
      // Ne pas throw l'erreur totalement car l'invite est partie, mais on logge.
    }

    return NextResponse.json({ success: true, user: authData.user }, { status: 200 })
    
  } catch (error: any) {
    console.error("User Creation API Error:", error)
    return NextResponse.json(
      { error: error.message || "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
