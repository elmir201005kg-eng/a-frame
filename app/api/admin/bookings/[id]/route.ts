import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET — Получить детали бронирования
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        cabin: {
          select: {
            id: true,
            title: true,
            owner: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        payments: true,
        review: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Бронирование не найдено' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PATCH — Обновить статус бронирования
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, cancellationReason } = body;

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status,
        ...(cancellationReason && { cancellationReason }),
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
  }
}
