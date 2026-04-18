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

/**
 * Dedupe por modelo: si hay varias entradas con el mismo modelo elige la
 * de menor precio (suele ser la "base").
 */
function dedupeByModelo<T extends { modelo: string; precio: number }>(entries: T[]): T[] {
  const seen = new Map<string, T>();
  for (const e of entries) {
    const key = (e.modelo || '').toUpperCase();
    const prev = seen.get(key);
    if (!prev || e.precio < prev.precio) seen.set(key, e);
  }
  return Array.from(seen.values());
}

/**
 * Para las "otras marcas" que aparecen en el carrusel del Paso 6,
 * Canvas muestra exactamente 1 INFINITION y 1 HTW (ambas 3 años · A++).
 * - INFINITION: modelo SPTSExxxA2  (serie económica)
 * - HTW: modelo HTWSxxxIX75        (serie económica A++)
 */
function pickCanvasCompatibles(modelsAtBucket: any[]): any[] {
  const deduped = dedupeByModelo(modelsAtBucket);

  const infinitionCandidates = deduped.filter(
    (e) => (e.marca || '').toLowerCase() === 'infinition'
  );
  const htwCandidates = deduped.filter((e) => (e.marca || '').toLowerCase() === 'htw');

  // Preferencia para INFINITION: serie SPTSE (económica, A++, 3 años) sobre SPTTF (premium).
  const infinitionPreferred =
    infinitionCandidates.find((e) => /SPTSE/i.test(e.modelo || '')) ||
    infinitionCandidates.sort((a, b) => a.precio - b.precio)[0] ||
    null;

  // Preferencia para HTW: serie IX75 (económica, A++, 3 años).
  const htwPreferred =
    htwCandidates.find((e) => /IX75/i.test(e.modelo || '')) ||
    htwCandidates.sort((a, b) => a.precio - b.precio)[0] ||
    null;

  const out: any[] = [];
  if (infinitionPreferred) out.push(infinitionPreferred);
  if (htwPreferred) out.push(htwPreferred);
  return out;
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
    const giatsuModels = filtered.filter(
      (eq: any) => (eq.marca || '').toLowerCase() === 'giatsu'
    );
    const giatsuSizes = Array.from(
      new Set(giatsuModels.map((eq: any) => eq.frigoriasMin as number))
    );
    const bucket =
      giatsuSizes.length > 0 ? pickSizeBucket(targetFrigorias, giatsuSizes) : targetFrigorias;

    // Modelos del mismo tamaño (bucket)
    const matching = filtered.filter((eq: any) => eq.frigoriasMin === bucket);

    // 1) Recomendados: las 3 líneas Giatsu (Sakura, Aroma 3, Aroma Plus)
    const giatsuAtBucket = matching.filter(
      (eq: any) => (eq.marca || '').toLowerCase() === 'giatsu'
    );
    const sakura = giatsuAtBucket.find((eq: any) => getGiatsuLine(eq.modelo) === 'sakura');
    const aroma3 = giatsuAtBucket.find((eq: any) => getGiatsuLine(eq.modelo) === 'aroma3');
    const aromaplus = giatsuAtBucket.find((eq: any) => getGiatsuLine(eq.modelo) === 'aromaplus');
    const recomendados = [sakura, aroma3, aromaplus].filter(Boolean);

    // 2) Otras marcas (Canvas canonical: 1 INFINITION + 1 HTW)
    const otrasMarcas = pickCanvasCompatibles(matching);

    return NextResponse.json({
      bucket,
      recomendados,
      otrasMarcas,
      all: matching,
    });
  } catch (error) {
    console.error('Error loading equipment:', error);
    return NextResponse.json(
      { bucket: 0, recomendados: [], otrasMarcas: [], all: [] },
      { status: 500 }
    );
  }
}
