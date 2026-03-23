import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create an initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const { pathname } = request.nextUrl
  
  // Safely check for environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are missing, skip the auth logic to avoid 500 error
  if (!supabaseUrl || !supabaseAnonKey) {
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
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
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

    const isProtectedPage = (pathname.startsWith('/dashboard') || 
                            pathname.startsWith('/admin') || 
                            pathname.startsWith('/onboarding')) && 
                            !pathname.startsWith('/admin/login')
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/admin/login')

    if (!session && isProtectedPage) {
      // If trying to access admin without session, send to admin/login instead of /login ?
      // Actually, standardizing on /login is fine, but for admin let's send to /admin/login
      const redirectUrl = pathname.startsWith('/admin') ? '/admin/login' : '/login'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    if (session && isAuthPage) {
      // If admin, send to admin dashboard, else to user dashboard
      // Note: This is a simplification. Real logic should check user role.
      const redirectUrl = pathname.startsWith('/admin') ? '/admin/dashboard' : '/dashboard'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    return response
  } catch (e) {
    // If anything fails in the auth client, just let the request through
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
