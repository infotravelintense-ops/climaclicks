export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const contact = await prisma.contact.create({
      data: {
        tipoServicio: body.tipoServicio,
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono,
        descripcion: body.descripcion,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Error creating contact' },
      { status: 500 }
    );
  }
}