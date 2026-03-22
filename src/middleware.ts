import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage = req.nextUrl.pathname.startsWith('/login')
  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard')
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

  // 1. Redirect unauthenticated users to login
  if (!session && (isDashboardPage || isAdminPage)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 2. Redirect authenticated users away from login
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
}
