import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'USER_ID_AND_CODE_REQUIRED' },
        { status: 400 }
      );
    }

    // Получить сохраненный код из БД
    const codeSetting = await prisma.settings.findUnique({
      where: { key: `ADMIN_2FA_${userId}` },
    });

    if (!codeSetting?.value) {
      return NextResponse.json(
        { error: 'CODE_NOT_FOUND' },
        { status: 400 }
      );
    }

    const { code: storedCode, expiresAt } = JSON.parse(codeSetting.value);

    // Проверить срок действия кода
    if (new Date() > new Date(expiresAt)) {
      // Удалить истекший код
      await prisma.settings.delete({
        where: { key: `ADMIN_2FA_${userId}` },
      });

      return NextResponse.json(
        { error: 'CODE_EXPIRED' },
        { status: 400 }
      );
    }

    // Проверить код
    if (code !== storedCode) {
      return NextResponse.json(
        { error: 'INVALID_CODE' },
        { status: 401 }
      );
    }

    // Удалить использованный код
    await prisma.settings.delete({
      where: { key: `ADMIN_2FA_${userId}` },
    });

    // Получить данные пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Создать JWT токен
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    // Создать response с cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Установить HTTP-only cookie с токеном
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
