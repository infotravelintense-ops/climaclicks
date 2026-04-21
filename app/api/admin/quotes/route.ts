import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { isAdminAuthenticatedFromRequest } from '@/app/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!isAdminAuthenticatedFromRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { timestamp: 'desc' },
      take: 200,
    });
    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({ error: 'Error obteniendo presupuestos' }, { status: 500 });
  }
}
