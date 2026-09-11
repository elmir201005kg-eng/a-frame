import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Защита админ-роутов
  if (pathname.startsWith('/admin')) {
    // TODO: Добавить реальную проверку авторизации через NextAuth
    // const token = request.cookies.get('next-auth.session-token');
    // if (!token) {
    //   return NextResponse.redirect(new URL('/admin/login', request.url));
    // }

    // Временно разрешаем доступ для разработки
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
