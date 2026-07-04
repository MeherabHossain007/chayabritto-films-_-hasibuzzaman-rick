import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, COOKIE_NAME } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that are excluded from authentication
  if (
    pathname === '/admin/login' ||
    pathname === '/api/admin/login'
  ) {
    return NextResponse.next();
  }

  // Check if target is admin pages or admin APIs
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    const authenticated = token ? await verifyToken(token) : false;

    if (!authenticated) {
      if (isAdminApi) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      } else {
        // Redirect to login page
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
