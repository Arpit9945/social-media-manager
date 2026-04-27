import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const protectedPaths = ['/dashboard', '/analyzer', '/generator', '/settings', '/onboarding'];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  // Not logged in + accessing protected path → redirect to login
  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Logged in + on login page → redirect to dashboard (or onboarding)
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Logged in + on dashboard/settings → check onboarding status
  if (user && (pathname.startsWith('/dashboard') || pathname.startsWith('/analyzer') || pathname.startsWith('/generator'))) {
    try {
      const { data: profile } = await supabase
        .from('brand_profiles')
        .select('is_onboarded')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile || !profile.is_onboarded) {
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding';
        return NextResponse.redirect(url);
      }
    } catch (e) {
      // If table doesn't exist or query fails, allow through
    }
  }

  // Logged in + already onboarded + on /onboarding → redirect to dashboard
  if (user && pathname.startsWith('/onboarding')) {
    try {
      const { data: profile } = await supabase
        .from('brand_profiles')
        .select('is_onboarded')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile && profile.is_onboarded) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    } catch (e) {
      // ignore
    }
  }

  return supabaseResponse;
}
