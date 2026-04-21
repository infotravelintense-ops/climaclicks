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
        tipoServicio: body.tipoServicio,
        tipoEquipo: body.tipoEquipo,
        metrosCuadrados: body.metrosCuadrados,
        alturaTecho: body.altura || body.alturaTecho || 2.5,
        exposicionSolar: body.exposicionSolar,
        frigoriasCalculadas: body.frigoriasCalculadas,
        modeloSeleccionado: body.modeloSeleccionado,
        marcaSeleccionada: body.marcaSeleccionada,
        precioEquipo: body.precioEquipo,
        precioInstalacion: body.precioInstalacion || 0,
        andamio: body.andamio || false,
        urgente: body.urgente || body.urgencia72h || false,
        metrosExtra: body.metrosExtra || body.metrosAdicionales || 0,
        descuento: body.descuento || body.descuentoPorcentaje || 0,
        totalSinIva: body.totalSinIva || body.subtotal || 0,
        iva: body.iva,
        totalFinal: body.totalFinal,
        nombreCliente: body.nombreCliente,
        telefonoCliente: body.telefonoCliente,
        cpCliente: body.cpCliente || body.codigoPostalCliente,
        direccionCliente: body.direccionCliente,
        emailCliente: body.emailCliente,
        estancia: body.estancia,
        conductoUnidadesInteriores: body.conductoUnidadesInteriores,
        precioConducto: body.precioConducto,
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
