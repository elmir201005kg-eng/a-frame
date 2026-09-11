import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET — Получить пользователя
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        ownerProfile: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
            favorites: true,
            cabins: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PATCH — Обновить пользователя
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, role, isVerified } = body;

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(role && { role }),
        ...(isVerified !== undefined && { isVerified }),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
  }
}

// DELETE — Удалить пользователя
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Пользователь удалён' });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}
