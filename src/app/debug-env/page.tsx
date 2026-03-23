'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

export default function DebugEnvPage() {
  const [envStatus, setEnvStatus] = useState({
    url: 'Checking...',
    key: 'Checking...',
    supabaseInit: 'Checking...'
  })

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    setEnvStatus({
      url: url ? '✅ Configuré' : '❌ Manquant',
      key: key ? '✅ Configuré' : '❌ Manquant',
      supabaseInit: (url && key) ? '✅ Prêt' : '⚠ Incomplet'
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white p-8 flex items-center justify-center">
      <Card className="w-full max-w-md bg-[#1A1A2E] border-[#3A3A5A]">
        <CardHeader>
          <CardTitle className="text-[#D4AF37] flex items-center gap-2">
            Diagnostic Environnement VIP 🧪
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-[#0F0F1A] rounded-lg border border-[#3A3A5A]">
            <span className="text-[#A0A0B8]">SUPABASE_URL</span>
            <Badge variant={envStatus.url.includes('✅') ? 'outline' : 'destructive'} 
                   className={envStatus.url.includes('✅') ? 'border-green-500 text-green-500' : ''}>
              {envStatus.url}
            </Badge>
          </div>

          <div className="flex justify-between items-center p-4 bg-[#0F0F1A] rounded-lg border border-[#3A3A5A]">
            <span className="text-[#A0A0B8]">SUPABASE_ANON_KEY</span>
            <Badge variant={envStatus.key.includes('✅') ? 'outline' : 'destructive'}
                   className={envStatus.key.includes('✅') ? 'border-green-500 text-green-500' : ''}>
              {envStatus.key}
            </Badge>
          </div>

          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            envStatus.supabaseInit.includes('✅') ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
          }`}>
            {envStatus.supabaseInit.includes('✅') ? <CheckCircle2 /> : <AlertTriangle />}
            <span className="font-medium text-sm">
              {envStatus.supabaseInit.includes('✅') 
                ? "Le système peut communiquer avec Supabase." 
                : "Erreur : Les variables d'environnement ne sont pas détectées sur Vercel."}
            </span>
          </div>

          <div className="text-xs text-[#A0A0B8] border-t border-[#3A3A5A] pt-4 mt-4">
            <p className="font-bold mb-2 text-[#D4AF37]">Instructions :</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Allez sur votre tableau de bord **Vercel**.</li>
              <li>Settings → Environment Variables.</li>
              <li>Ajoutez les deux clés ci-dessus.</li>
              <li>**Redéployez** votre application pour appliquer les changements.</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
