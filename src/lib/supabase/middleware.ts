import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // If Supabase is not configured yet, skip auth middleware so local demo mode works seamlessly
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
    return supabaseResponse
  }

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

    const { data: { user } } = await supabase.auth.getUser()

    const url = request.nextUrl.clone()
    const isAuthPage = url.pathname.startsWith('/login') ||
      url.pathname.startsWith('/signup') ||
      url.pathname.startsWith('/forgot-password')
    const isDashboard = url.pathname.startsWith('/dashboard')
    const isAdmin = url.pathname.startsWith('/admin')

    if (!user && (isDashboard || isAdmin)) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (user && isAuthPage) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Admin route check
    if (user && isAdmin) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if ((profile as any)?.role !== 'admin') {
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  } catch (err) {
    // Graceful fallback
  }

  return supabaseResponse
}
