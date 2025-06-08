import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth'; // Assuming verifyToken is { userId: string } | null

const PUBLIC_PATHS = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/api/auth/me'];
const PROTECTED_API_PATHS = ['/api/properties', '/api/jobs']; // Add other API paths that need auth but aren't covered by withAuth

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Pathname: ${pathname}`);
  const token = request.cookies.get('bellbot-token')?.value;
  console.log(`[Middleware] Token from cookie: ${token ? 'Present' : 'MISSING or undefined'}`);

  // Allow access to public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Handle protected page routes (e.g., /dashboard)
  if (pathname.startsWith('/dashboard')) {
    console.log('[Middleware] Handling /dashboard route.');
    if (!token) {
      console.log('[Middleware] No token found for /dashboard, redirecting to /login.');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const payload = await verifyToken(token);
    console.log(`[Middleware] Payload from token for /dashboard: ${payload ? JSON.stringify(payload) : 'null (invalid token)'}`);
    if (!payload) {
      console.log('[Middleware] Invalid token for /dashboard, redirecting to /login and clearing cookie.');
      // Clear invalid token and redirect
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('bellbot-token');
      return response;
    }
    // Token is valid, allow access to dashboard page
    // Optionally add user ID to request headers for Server Components if needed
    console.log('[Middleware] Token for /dashboard is valid. Allowing access and setting x-user-id header.');
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Handle specific protected API routes that might not use withAuth HOF
  // (Note: withAuth HOF in lib/auth-middleware.ts is the primary way to protect API routes)
  if (PROTECTED_API_PATHS.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    // Token is valid, add userId to request headers for the API route handler
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // For any other routes not explicitly handled, default to allowing them
  // This might include static assets, _next, etc.
  // Or, if you want a deny-by-default policy, change this to redirect or return an error.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root path, if it's a public landing page)
     * - any other public static assets
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
