export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const clientIp =
      headersList.get('x-forwarded-for')?.split(',')[0] ||
      headersList.get('x-real-ip') ||
      'unknown';

    const discount = await prisma.discountByIP.findUnique({
      where: { clientIp },
    });

    // Si existe descuento y fue usado en los últimos 5 minutos, no mostrar nuevo
    if (discount && discount.ultimoDescuentoUsado) {
      const now = new Date();
      const diffMinutes =
        (now.getTime() - discount.ultimoDescuentoUsado.getTime()) / 1000 / 60;
      if (diffMinutes < 5) {
        return NextResponse.json({ canShowDiscount: false });
      }
    }

    return NextResponse.json({ canShowDiscount: true });
  } catch (error) {
    console.error('Error checking discount:', error);
    return NextResponse.json({ canShowDiscount: true });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const clientIp =
      headersList.get('x-forwarded-for')?.split(',')[0] ||
      headersList.get('x-real-ip') ||
      'unknown';

    await prisma.discountByIP.upsert({
      where: { clientIp },
      update: { ultimoDescuentoUsado: new Date() },
      create: { clientIp, ultimoDescuentoUsado: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating discount:', error);
    return NextResponse.json(
      { error: 'Error updating discount' },
      { status: 500 }
    );
  }
}