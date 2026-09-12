import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем наличие cookie с языком
  const locale = request.cookies.get('NEXT_LOCALE');
  
  // Если cookie не установлен, устанавливаем язык по умолчанию (ru)
  if (!locale) {
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', 'ru', {
      path: '/',
      maxAge: 31536000, // 1 год
      sameSite: 'lax',
    });
    return response;
  }

  // Защита админ-роутов
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;

    // Если токена нет, перенаправляем на страницу входа
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Верифицировать токен
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // Проверить роль администратора
      if (payload.role !== 'ADMIN') {
        // Удалить невалидный токен и перенаправить
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('admin_token');
        return response;
      }

      // Токен валиден, пропускаем дальше
      return NextResponse.next();
    } catch (error) {
      // Токен невалиден, перенаправляем на логин
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // Если админ залогинен и пытается попасть на страницу логина, перенаправляем в админку
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch {
        // Токен невалиден, оставляем на странице логина
        const response = NextResponse.next();
        response.cookies.delete('admin_token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/api/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
