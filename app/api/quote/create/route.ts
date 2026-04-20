export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headersList = await headers();
    const clientIp =
      headersList.get('x-forwarded-for')?.split(',')[0] ||
      headersList.get('x-real-ip') ||
      'unknown';

    const quote = await prisma.quote.create({
      data: {
        clientIp,
        language: body.language || 'es',
        tipoServicio: body.tipoServicio,
        tipoEquipo: body.tipoEquipo,
        metrosCuadrados: body.metrosCuadrados,
        altura: body.altura,
        exposicionSolar: body.exposicionSolar,
        frigoriasCalculadas: body.frigoriasCalculadas,
        modeloSeleccionado: body.modeloSeleccionado,
        marcaSeleccionada: body.marcaSeleccionada,
        precioEquipo: body.precioEquipo,
        andamio: body.andamio || false,
        andamioPrice: body.andamioPrice || 0,
        urgencia72h: body.urgencia72h || false,
        urgenciaPrice: body.urgenciaPrice || 0,
        metrosAdicionales: body.metrosAdicionales || 0,
        metrosAdicionalesPrice: body.metrosAdicionalesPrice || 0,
        subtotal: body.subtotal,
        iva: body.iva,
        descuentoPorcentaje: body.descuentoPorcentaje,
        descuentoMonto: body.descuentoMonto,
        totalFinal: body.totalFinal,
        nombreCliente: body.nombreCliente,
        emailCliente: body.emailCliente,
        telefonoCliente: body.telefonoCliente,
        direccionCliente: body.direccionCliente,
        codigoPostalCliente: body.codigoPostalCliente,
        completado: true,
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Error creating quote' },
      { status: 500 }
    );
  }
}
