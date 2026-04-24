/**
 * Client-side equipment picker.
 *
 * The original logic lived in `app/api/equipment/route.ts`, which needs a
 * server runtime. For the static export build (Cloudflare Pages) we load
 * the catalog directly from `/data/equipment-catalog.json` and run the same
 * filtering / bucket / brand selection in the browser.
 *
 * On SSR builds we still call `/api/equipment` so any future changes to the
 * server logic remain the single source of truth.
 */

import type { Equipment, EquipmentType } from '@/app/types';

const WEBHOOK_MODE = (process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '').length > 0;

export interface EquipmentPickResult {
  bucket: number;
  recomendados: Equipment[];
  otrasMarcas: Equipment[];
  all: Equipment[];
}

export interface EquipmentQuery {
  type: EquipmentType;
  frigorias: number;
  totalInteriorFrigorias?: number;
  unidadesInteriores?: number;
}

function getGiatsuLine(modelo: string): 'sakura' | 'aroma3' | 'aromaplus' | null {
  const m = (modelo || '').toUpperCase();
  if (m.includes('SAKU')) return 'sakura';
  if (m.includes('ARPLUS')) return 'aromaplus';
  if (m.includes('AR3')) return 'aroma3';
  return null;
}

function pickSizeBucket(target: number, sizes: number[]): number {
  const sorted = [...sizes].sort((a, b) => a - b);
  for (const s of sorted) if (s >= target) return s;
  return sorted[sorted.length - 1] ?? target;
}

function dedupeByModelo<T extends { modelo: string; precio: number }>(entries: T[]): T[] {
  const seen = new Map<string, T>();
  for (const e of entries) {
    const key = (e.modelo || '').toUpperCase();
    const prev = seen.get(key);
    if (!prev || e.precio < prev.precio) seen.set(key, e);
  }
  return Array.from(seen.values());
}

function pickCanvasCompatibles(modelsAtBucket: any[]): any[] {
  const deduped = dedupeByModelo(modelsAtBucket);
  const infinitonCandidates = deduped.filter(
    (e) => (e.marca || '').toLowerCase() === 'infiniton'
  );
  const htwCandidates = deduped.filter(
    (e) => (e.marca || '').toLowerCase() === 'htw'
  );

  const infinitonPreferred =
    infinitonCandidates.find((e) => /SPTSE/i.test(e.modelo || '')) ||
    infinitonCandidates.sort((a, b) => a.precio - b.precio)[0] ||
    null;

  const htwPreferred =
    htwCandidates.find((e) => /IX75/i.test(e.modelo || '')) ||
    htwCandidates.sort((a, b) => a.precio - b.precio)[0] ||
    null;

  const out: any[] = [];
  if (infinitonPreferred) out.push(infinitonPreferred);
  if (htwPreferred) out.push(htwPreferred);
  return out;
}

let cachedCatalog: any[] | null = null;

async function loadCatalog(): Promise<any[]> {
  if (cachedCatalog) return cachedCatalog;
  const res = await fetch('/data/equipment-catalog.json', { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Failed to load equipment catalog: ${res.status}`);
  const data = await res.json();
  cachedCatalog = Array.isArray(data) ? data : [];
  return cachedCatalog;
}

function filterCatalog(catalog: any[], q: EquipmentQuery): EquipmentPickResult {
  const type = q.type;
  const targetFrigorias = q.frigorias || 2500;
  const totalInteriorFrigorias = q.totalInteriorFrigorias || 0;
  const unidadesInterioresParam = q.unidadesInteriores || 0;

  let filtered = [...catalog];
  if (type) filtered = filtered.filter((eq) => eq.tipo === type);

  const giatsuModels = filtered.filter(
    (eq) => (eq.marca || '').toLowerCase() === 'giatsu'
  );
  const giatsuSizes = Array.from(
    new Set(giatsuModels.map((eq) => eq.frigoriasMin as number))
  );

  const isMulti =
    !!type &&
    ['multisplit', 'twin', 'multi-conducto', 'multi-cassette'].includes(type);
  const lookupFrigorias =
    isMulti && totalInteriorFrigorias > 0 ? totalInteriorFrigorias : targetFrigorias;

  const bucket =
    giatsuSizes.length > 0 ? pickSizeBucket(lookupFrigorias, giatsuSizes) : lookupFrigorias;

  let matching = filtered.filter((eq) => eq.frigoriasMin === bucket);

  if (isMulti && unidadesInterioresParam > 0) {
    matching = matching.filter((eq) => {
      if (typeof eq.unidadesInteriores === 'number') {
        return eq.unidadesInteriores === unidadesInterioresParam;
      }
      const modelo = (eq.modelo || '').toUpperCase();
      const moMatch = modelo.match(/MO(\d)/);
      if (moMatch) return parseInt(moMatch[1], 10) === unidadesInterioresParam;
      if (type === 'twin') return 2 === unidadesInterioresParam;
      const dMatch = modelo.match(/-(\d)D/);
      if (dMatch) return parseInt(dMatch[1], 10) === unidadesInterioresParam;
      const cMatch = modelo.match(/-(\d)C/);
      if (cMatch) return parseInt(cMatch[1], 10) === unidadesInterioresParam;
      return false;
    });
  }

  const typeLower = (type || '').toLowerCase();
  const isSplit = typeLower === 'split';

  let recomendados: any[] = [];
  if (isSplit) {
    const giatsuAtBucket = matching.filter(
      (eq) => (eq.marca || '').toLowerCase() === 'giatsu'
    );
    const sakura = giatsuAtBucket.find((eq) => getGiatsuLine(eq.modelo) === 'sakura');
    const aroma3 = giatsuAtBucket.find((eq) => getGiatsuLine(eq.modelo) === 'aroma3');
    const aromaplus = giatsuAtBucket.find((eq) => getGiatsuLine(eq.modelo) === 'aromaplus');
    recomendados = [sakura, aroma3, aromaplus].filter(Boolean);
  } else {
    const giatsuAtBucket = matching.filter(
      (eq) => (eq.marca || '').toLowerCase() === 'giatsu'
    );
    const htwAtBucket = matching.filter((eq) => (eq.marca || '').toLowerCase() === 'htw');
    const sakura = giatsuAtBucket.find((eq) => getGiatsuLine(eq.modelo) === 'sakura');
    const aroma3 = giatsuAtBucket.find((eq) => getGiatsuLine(eq.modelo) === 'aroma3');
    const aromaplus = giatsuAtBucket.find((eq) => getGiatsuLine(eq.modelo) === 'aromaplus');
    const htwModel = htwAtBucket.sort((a, b) => a.precio - b.precio)[0] || null;
    recomendados = [sakura, aroma3, aromaplus, htwModel].filter(Boolean);
  }

  let otrasMarcas: any[] = [];
  if (isSplit) {
    otrasMarcas = pickCanvasCompatibles(matching);
  } else {
    const infinitonCandidates = matching.filter(
      (eq) => (eq.marca || '').toLowerCase() === 'infiniton'
    );
    const infinitonPreferred =
      infinitonCandidates.sort((a, b) => a.precio - b.precio)[0] || null;
    if (infinitonPreferred) otrasMarcas.push(infinitonPreferred);
  }

  return { bucket, recomendados, otrasMarcas, all: matching };
}

/**
 * Returns the same payload shape as `/api/equipment`.
 *  - In webhook/static mode (Cloudflare) the logic runs in the browser against
 *    the public JSON catalog.
 *  - In SSR mode it delegates to the API route.
 */
export async function fetchEquipment(q: EquipmentQuery): Promise<EquipmentPickResult> {
  if (WEBHOOK_MODE) {
    const catalog = await loadCatalog();
    return filterCatalog(catalog, q);
  }

  const totalInteriorParam =
    q.totalInteriorFrigorias && q.totalInteriorFrigorias > 0
      ? `&totalInteriorFrigorias=${q.totalInteriorFrigorias}`
      : '';
  const unidadesInterioresParam =
    q.unidadesInteriores && q.unidadesInteriores > 0
      ? `&unidadesInteriores=${q.unidadesInteriores}`
      : '';

  const res = await fetch(
    `/api/equipment?type=${q.type}&frigorias=${q.frigorias}${totalInteriorParam}${unidadesInterioresParam}`
  );
  if (!res.ok) return { bucket: 0, recomendados: [], otrasMarcas: [], all: [] };
  return res.json();
}
