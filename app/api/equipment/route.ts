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
 * Canvas muestra exactamente 1 Infiniton y 1 HTW (ambas 3 años · A++).
 * - Infiniton: modelo SPTSExxxA2  (serie económica)
 * - HTW: modelo HTWSxxxIX75        (serie económica A++)
 */
function pickCanvasCompatibles(modelsAtBucket: any[]): any[] {
  const deduped = dedupeByModelo(modelsAtBucket);

  const infinitionCandidates = deduped.filter(
    (e) => (e.marca || '').toLowerCase() === 'infiniton'
  );
  const htwCandidates = deduped.filter((e) => (e.marca || '').toLowerCase() === 'htw');

  // Preferencia para Infiniton: serie SPTSE (económica, A++, 3 años) sobre SPTTF (premium).
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
    // Para equipos multi, suma total de frigorías de unidades interiores
    const totalInteriorFrigorias = parseInt(searchParams.get('totalInteriorFrigorias') || '0', 10);

    const catalogPath = join(process.cwd(), 'public/data/equipment-catalog.json');
    const catalogData = readFileSync(catalogPath, 'utf-8');
    const equipmentCatalog = JSON.parse(catalogData);

    let filtered = [...equipmentCatalog];
    if (type) {
      filtered = filtered.filter((eq: any) => eq.tipo === type);
    }

    // Determinar el bucket de frigorías (tamaño adecuado)
    const giatsuModels = filtered.filter(
      (eq: any) => (eq.marca || '').toLowerCase() === 'giatsu'
    );
    const giatsuSizes = Array.from(
      new Set(giatsuModels.map((eq: any) => eq.frigoriasMin as number))
    );

    // Para equipos multi (multisplit, twin, multi-conducto, multi-cassette):
    // la validación se basa en la suma total de frigorías de las unidades interiores
    const isMulti = type && ['multisplit', 'twin', 'multi-conducto', 'multi-cassette'].includes(type);
    const lookupFrigorias = (isMulti && totalInteriorFrigorias > 0) ? totalInteriorFrigorias : targetFrigorias;

    const bucket =
      giatsuSizes.length > 0 ? pickSizeBucket(lookupFrigorias, giatsuSizes) : lookupFrigorias;

    // Para equipos multi: filtrar también por número de unidades interiores
    // Extraído del campo Config del Excel (ej: 2x1 → 2, 3x1 → 3)
    const unidadesInterioresParam = parseInt(searchParams.get('unidadesInteriores') || '0', 10);

    // Modelos del mismo tamaño (bucket)
    let matching = filtered.filter((eq: any) => eq.frigoriasMin === bucket);

    // Filtrar multi por número de unidades interiores si se especifica
    if (isMulti && unidadesInterioresParam > 0) {
      matching = matching.filter((eq: any) => {
        // Si el modelo tiene unidadesInteriores explícito en el catálogo, usarlo
        if (typeof eq.unidadesInteriores === 'number') {
          return eq.unidadesInteriores === unidadesInterioresParam;
        }
        // Fallback: extraer del nombre del modelo
        const modelo = (eq.modelo || '').toUpperCase();
        // Multisplit: MO2, MO3, MO4, MO5
        const moMatch = modelo.match(/MO(\d)/);
        if (moMatch) return parseInt(moMatch[1], 10) === unidadesInterioresParam;
        // Twin siempre 2
        if (type === 'twin') return 2 === unidadesInterioresParam;
        // Multi-conducto: 2Dxxx
        const dMatch = modelo.match(/-(\d)D/);
        if (dMatch) return parseInt(dMatch[1], 10) === unidadesInterioresParam;
        // Multi-cassette: 2Cxxx
        const cMatch = modelo.match(/-(\d)C/);
        if (cMatch) return parseInt(cMatch[1], 10) === unidadesInterioresParam;
        return false;
      });
    }

    // 1) Recomendados
    // Split → solo Giatsu (Sakura, Aroma 3, Aroma Plus)
    // Resto (conducto, cassette, suelo-techo, multisplit, multi-conducto, multi-cassette, twin) → Giatsu y HTW
    const typeLower = (type || '').toLowerCase();
    const isSplit = typeLower === 'split';

    let recomendados: any[] = [];

    if (isSplit) {
      // Solo Giatsu para Split
      const giatsuAtBucket = matching.filter(
        (eq: any) => (eq.marca || '').toLowerCase() === 'giatsu'
      );
      const sakura = giatsuAtBucket.find((eq: any) => getGiatsuLine(eq.modelo) === 'sakura');
      const aroma3 = giatsuAtBucket.find((eq: any) => getGiatsuLine(eq.modelo) === 'aroma3');
      const aromaplus = giatsuAtBucket.find((eq: any) => getGiatsuLine(eq.modelo) === 'aromaplus');
      recomendados = [sakura, aroma3, aromaplus].filter(Boolean);
    } else {
      // Para resto de equipos: Giatsu y HTW
      const giatsuAtBucket = matching.filter(
        (eq: any) => (eq.marca || '').toLowerCase() === 'giatsu'
      );
      const htwAtBucket = matching.filter(
        (eq: any) => (eq.marca || '').toLowerCase() === 'htw'
      );
      // Giatsu: Sakura, Aroma 3, Aroma Plus (si existen)
      const sakura = giatsuAtBucket.find((eq: any) => getGiatsuLine(eq.modelo) === 'sakura');
      const aroma3 = giatsuAtBucket.find((eq: any) => getGiatsuLine(eq.modelo) === 'aroma3');
      const aromaplus = giatsuAtBucket.find((eq: any) => getGiatsuLine(eq.modelo) === 'aromaplus');
      // HTW: modelo más económico del bucket
      const htwModel = htwAtBucket.sort((a: any, b: any) => a.precio - b.precio)[0] || null;
      recomendados = [sakura, aroma3, aromaplus, htwModel].filter(Boolean);
    }

    // 2) Otras marcas (Infiniton + HTW para Split, Infiniton para resto)
    let otrasMarcas: any[] = [];
    if (isSplit) {
      otrasMarcas = pickCanvasCompatibles(matching);
    } else {
      // Para resto: Infiniton como alternativa económica
      const infinitonCandidates = matching.filter(
        (eq: any) => (eq.marca || '').toLowerCase() === 'infiniton'
      );
      const infinitonPreferred = infinitonCandidates.sort((a: any, b: any) => a.precio - b.precio)[0] || null;
      if (infinitonPreferred) otrasMarcas.push(infinitonPreferred);
    }

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
