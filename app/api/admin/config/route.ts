import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { isAdminAuthenticated } from '@/app/lib/admin-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_CONFIG = {
  temporadaAltaInicio: '15/05',
  temporadaAltaFin: '15/09',
  precioUrgenciaAlta: 250,
  precioUrgenciaBaja: 150,
  precioAveriaAlta: 120,
  precioAveriaBaja: 90,
};

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    let config = await prisma.seasonConfig.findFirst();
    if (!config) {
      config = await prisma.seasonConfig.create({ data: DEFAULT_CONFIG });
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error getting config:', error);
    return NextResponse.json({ error: 'Error obteniendo configuración' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const existing = await prisma.seasonConfig.findFirst();
    if (existing) {
      const updated = await prisma.seasonConfig.update({
        where: { id: existing.id },
        data: {
          temporadaAltaInicio: body.temporadaAltaInicio,
          temporadaAltaFin: body.temporadaAltaFin,
          precioUrgenciaAlta: parseFloat(body.precioUrgenciaAlta),
          precioUrgenciaBaja: parseFloat(body.precioUrgenciaBaja),
          precioAveriaAlta: parseFloat(body.precioAveriaAlta),
          precioAveriaBaja: parseFloat(body.precioAveriaBaja),
        },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.seasonConfig.create({
        data: {
          temporadaAltaInicio: body.temporadaAltaInicio,
          temporadaAltaFin: body.temporadaAltaFin,
          precioUrgenciaAlta: parseFloat(body.precioUrgenciaAlta),
          precioUrgenciaBaja: parseFloat(body.precioUrgenciaBaja),
          precioAveriaAlta: parseFloat(body.precioAveriaAlta),
          precioAveriaBaja: parseFloat(body.precioAveriaBaja),
        },
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json({ error: 'Error guardando configuración' }, { status: 500 });
  }
}
