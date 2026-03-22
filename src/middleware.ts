import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl
  const isAuthPage = pathname.startsWith('/login')
  const isDashboardPage = pathname.startsWith('/dashboard')
  const isAdminPage = pathname.startsWith('/admin')
  const isOnboardingPage = pathname.startsWith('/onboarding')

  // 1. Redirect unauthenticated users to login
  if (!session && (isDashboardPage || isAdminPage || isOnboardingPage)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Redirect authenticated users away from login
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 3. Logic for Establishment Status (Simplified)
  // In a real SaaS, you'd fetch the establishment state here or use a cookie
  // For now, we allow the request to proceed and handle the redirect in the layout/page components
  // to avoid complex async database calls in Middleware which can slow down Edge.

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/onboarding'],
}
