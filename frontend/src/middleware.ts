import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/forgot-password', '/verify-email', '/reset-password'];
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth token in cookies or headers
  const token = request.cookies.get('accessToken')?.value;

  const isPublic = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith('/api'));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  const isDashboard = pathname.startsWith('/dashboard');

  // If trying to access dashboard without token, redirect to login
  if (isDashboard && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to access auth pages, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
