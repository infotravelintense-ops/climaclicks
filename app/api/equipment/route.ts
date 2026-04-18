export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const minFrigorias = searchParams.get('minFrigorias');
    const maxFrigorias = searchParams.get('maxFrigorias');

    // Leer catálogo de equipos
    const catalogPath = join(process.cwd(), 'public/data/equipment-catalog.json');
    const catalogData = readFileSync(catalogPath, 'utf-8');
    const equipmentCatalog = JSON.parse(catalogData);

    let filtered = [...equipmentCatalog];

    if (type) {
      filtered = filtered.filter((eq: any) => eq.tipo === type);
    }

    if (minFrigorias && maxFrigorias) {
      const min = parseInt(minFrigorias, 10);
      const max = parseInt(maxFrigorias, 10);
      // Equipos que "encajen" en el rango de frigorías calculadas
      filtered = filtered.filter(
        (eq: any) => eq.frigoriasMax >= min && eq.frigoriasMin <= max
      );
    }

    // Ordenar por precio (ascendente) y limitar a 5 resultados
    filtered = filtered
      .sort((a: any, b: any) => a.precio - b.precio)
      .slice(0, 5);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error loading equipment:', error);
    return NextResponse.json([], { status: 500 });
  }
}
