'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugPage() {
    const [status, setStatus] = useState<any>({ loading: true })

    useEffect(() => {
        const check = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const { data: profile } = session ? await supabase.from('profiles').select('*').eq('id', session.user.id).single() : { data: null }
            const { data: establishments } = await supabase.from('establishments').select('*').limit(5)

            setStatus({
                loading: false,
                hasSession: !!session,
                user: session?.user,
                profile,
                establishmentsCount: establishments?.length || 0,
                establishmentsSample: establishments,
                origin: window.location.origin
            })
        }
        check()
    }, [])

    if (status.loading) return <div className="p-10 text-white">Loading Debug Info...</div>

    return (
        <div className="p-10 bg-black min-h-screen text-green-500 font-mono text-xs overflow-auto">
            <h1 className="text-2xl font-bold mb-4">DEBUG ENVIRONMENT</h1>
            <pre>{JSON.stringify(status, null, 2)}</pre>
            
            <div className="mt-10 p-4 border border-green-500">
                <h2 className="text-lg font-bold">RECOMMANDATIONS</h2>
                <ul className="list-disc ml-5 mt-2">
                    {!status.hasSession && <li>❌ AUCUNE SESSION - Connectez-vous d'abord.</li>}
                    {status.hasSession && !status.profile && <li>❌ PROFIL MANQUANT - Exécutez le script SQL Section 6.</li>}
                    {status.profile && status.profile.role !== 'SUPER_ADMIN' && <li>⚠️ ROLE INCORRECT - Actuellement: {status.profile.role}. Attendu: SUPER_ADMIN.</li>}
                </ul>
            </div>
        </div>
    )
}
