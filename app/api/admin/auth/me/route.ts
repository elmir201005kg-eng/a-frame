import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'NOT_AUTHENTICATED' },
        { status: 401 }
      );
    }

    // Верифицировать токен
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Получить актуальные данные пользователя
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as number },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'NOT_ADMIN' },
        { status: 403 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'INVALID_TOKEN' },
      { status: 401 }
    );
  }
}
