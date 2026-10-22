import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const url = request.nextUrl.clone()
  const isAuthPage =
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/signup') ||
    url.pathname.startsWith('/forgot-password')
  const isDashboard = url.pathname.startsWith('/dashboard')
  const isAdmin = url.pathname.startsWith('/admin')

  // Check Eagle custom session cookies
  const eagleSession = request.cookies.get('eagle_session')?.value
  const eagleRole = request.cookies.get('eagle_role')?.value

  let hasSupabaseUser = false
  let isSupabaseAdmin = false

  // Try Supabase auth only if configured properly
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')
  ) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
              supabaseResponse = NextResponse.next({ request })
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              )
            },
          },
        }
      )

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        hasSupabaseUser = true
        if (isAdmin) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          if ((profile as any)?.role === 'admin') {
            isSupabaseAdmin = true
          }
        }
      }
    } catch (e) {
      // Supabase connection silent fallback
    }
  }

  const isAuthenticated = hasSupabaseUser || !!eagleSession
  const isUserAdmin = isSupabaseAdmin || eagleRole === 'admin'

  // 1. Unauthenticated users cannot access dashboard or admin
  if (!isAuthenticated && (isDashboard || isAdmin)) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Authenticated users visiting login/signup are redirected to dashboard
  if (isAuthenticated && isAuthPage) {
    url.pathname = isUserAdmin ? '/admin' : '/dashboard'
    return NextResponse.redirect(url)
  }

  // 3. Regular users cannot access admin pages
  if (isAdmin && !isUserAdmin) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
