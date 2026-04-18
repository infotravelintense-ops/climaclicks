export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

function getGiatsuLine(modelo: string): 'sakura' | 'aroma3' | 'aromaplus' | null {
  const m = modelo.toUpperCase();
  if (m.includes('SAKU')) return 'sakura';
  if (m.includes('ARPLUS')) return 'aromaplus';
  if (m.includes('AR3')) return 'aroma3';
  return null;
}

// Selecciona el tamaño de BTU adecuado para una cantidad de frigorías
// Devuelve el frigoriasMin (2230 / 3000 / 4500 / 6090) del menor tamaño >= necesarias
function pickSizeBucket(targetFrigorias: number, availableSizes: number[]): number {
  const sorted = [...availableSizes].sort((a, b) => a - b);
  for (const s of sorted) {
    if (s >= targetFrigorias) return s;
  }
  return sorted[sorted.length - 1];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const targetFrigorias = parseInt(searchParams.get('frigorias') || '2500', 10);

    const catalogPath = join(process.cwd(), 'public/data/equipment-catalog.json');
    const catalogData = readFileSync(catalogPath, 'utf-8');
    const equipmentCatalog = JSON.parse(catalogData);

    let filtered = [...equipmentCatalog];
    if (type) {
      filtered = filtered.filter((eq: any) => eq.tipo === type);
    }

    // Determinar el bucket de frigorías (tamaño adecuado) con lista de Giatsu
    const giatsuModels = filtered.filter((eq: any) => (eq.marca || '').toLowerCase() === 'giatsu');
    const giatsuSizes = Array.from(new Set(giatsuModels.map((eq: any) => eq.frigoriasMin as number)));
    const bucket = giatsuSizes.length > 0 ? pickSizeBucket(targetFrigorias, giatsuSizes) : targetFrigorias;

    // Modelos del mismo tamaño (bucket) para presentar al cliente
    const matching = filtered.filter((eq: any) => eq.frigoriasMin === bucket);

    // 1) Recomendados: las 3 líneas Giatsu (Sakura, Aroma 3, Aroma Plus)
    const giatsuAtBucket = matching.filter((eq: any) => (eq.marca || '').toLowerCase() === 'giatsu');
    const sakura = giatsuAtBucket.find((eq: any) => getGiatsuLine(eq.modelo) === 'sakura');
    const aroma3 = giatsuAtBucket.find((eq: any) => getGiatsuLine(eq.modelo) === 'aroma3');
    const aromaplus = giatsuAtBucket.find((eq: any) => getGiatsuLine(eq.modelo) === 'aromaplus');
    const recomendados = [sakura, aroma3, aromaplus].filter(Boolean);

    // 2) Otras marcas (Infinition, HTW) al mismo tamaño
    const otrasMarcas = matching.filter((eq: any) => {
      const marca = (eq.marca || '').toLowerCase();
      return marca === 'infinition' || marca === 'htw';
    });

    return NextResponse.json({
      bucket,
      recomendados,
      otrasMarcas,
      all: matching,
    });
  } catch (error) {
    console.error('Error loading equipment:', error);
    return NextResponse.json({ bucket: 0, recomendados: [], otrasMarcas: [], all: [] }, { status: 500 });
  }
}
