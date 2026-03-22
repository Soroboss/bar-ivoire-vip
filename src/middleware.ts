import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Defensive check for environment variables to prevent 500 MIDDLEWARE_INVOCATION_FAILED
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rhrvhnnonaxonnxnhajq.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseAnonKey) {
    // If we're missing keys, we can't do auth checks, so we skip to let the app handle it (or show a better error)
    return response
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
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

    return response
  } catch (e) {
    // Fail gracefully if Supabase client fails
    console.error('Middleware Auth Error:', e)
    return response
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/onboarding'],
}
