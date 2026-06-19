import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_API_PATHS = ['/api/admin/login', '/api/admin/logout'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin') && !PUBLIC_API_PATHS.includes(pathname);

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get('zollani_admin')?.value;
    const expected = process.env.ADMIN_PASSWORD ?? 'admin';
    if (token !== expected) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
