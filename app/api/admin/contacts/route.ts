import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { isAdminAuthenticated } from '@/app/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { timestamp: 'desc' },
      take: 200,
    });
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: 'Error obteniendo contactos' }, { status: 500 });
  }
}
