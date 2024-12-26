import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';

  // Protected routes
  const protectedPaths = ['/dashboard', '/manager', '/admin', '/skills', '/users'];
  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // If no token and trying to access protected routes
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If has token and trying to access login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/manager/:path*',
    '/admin/:path*',
    '/users/:path*',
    '/skills/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
