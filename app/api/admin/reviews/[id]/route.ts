import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH — Изменить статус отзыва (модерация)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!['PENDING', 'PUBLISHED', 'HIDDEN'].includes(status)) {
      return NextResponse.json({ error: 'Неверный статус' }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id: params.id },
      data: { status },
    });

    // Если отзыв опубликован — пересчитать рейтинг домика
    if (status === 'PUBLISHED') {
      const cabin = await prisma.cabin.findUnique({
        where: { id: review.cabinId },
        include: {
          reviews: {
            where: { status: 'PUBLISHED' },
          },
        },
      });

      if (cabin) {
        const avgRating =
          cabin.reviews.reduce((sum, r) => sum + r.rating, 0) / cabin.reviews.length;

        await prisma.cabin.update({
          where: { id: cabin.id },
          data: {
            rating: Math.round(avgRating * 10) / 10,
            reviewsCount: cabin.reviews.length,
          },
        });
      }
    }

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
  }
}

// DELETE — Удалить отзыв
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.review.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Отзыв удалён' });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}
