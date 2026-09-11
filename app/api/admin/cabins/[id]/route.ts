import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH — Обновить статус домика
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    const cabin = await prisma.cabin.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(cabin);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
  }
}

// DELETE — Удалить домик
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.cabin.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Домик удалён' });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}
