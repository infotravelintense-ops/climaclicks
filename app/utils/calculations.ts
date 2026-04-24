'use client';

import type { EquipmentType, ServiceType } from '@/app/types';

export function calculateFrigorias(
  metrosCuadrados: number,
  altura: number,
  exposicionSolar: number
): number {
  // Fórmula: m² × altura × 50 × factor_exposición
  const frigoriasBase = metrosCuadrados * altura * 50;
  const frigoriasFinal = Math.round(frigoriasBase * exposicionSolar);
  return frigoriasFinal;
}

export function getDiscountPercentage(total: number): number {
  if (total < 1200) return 10;
  if (total <= 2500) return 5;
  return 3;
}

export function isHighSeason(date: Date): boolean {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  
  // Temporada alta: 15 mayo (5/15) a 15 septiembre (9/15)
  if (month > 5 && month < 9) return true;
  if (month === 5 && day >= 15) return true;
  if (month === 9 && day <= 15) return true;
  return false;
}

export function getUrgenciaPrice(isHighSeason: boolean): number {
  return isHighSeason ? 250 : 150;
}

export function getAveriaPrice(isHighSeason: boolean): number {
  return isHighSeason ? 120 : 90;
}

export function isValidMaillorquinPostalCode(cp: string): boolean {
  // Mallorca: 07001-07999
  const regex = /^07\d{3}$/;
  if (!regex.test(cp)) return false;
  const code = parseInt(cp, 10);
  return code >= 7001 && code <= 7999;
}

/**
 * Validación de código postal español (5 dígitos, 01xxx - 52xxx).
 * Se usa para permitir pagos desde cualquier lugar de España.
 */
export function isValidSpanishPostalCode(cp: string): boolean {
  if (!/^\d{5}$/.test(cp)) return false;
  const province = parseInt(cp.slice(0, 2), 10);
  return province >= 1 && province <= 52;
}

export function calculateMetrosAdicionalesPrice(metros: number): number {
  if (metros === 0) return 0;
  if (metros === 1) return 80;
  // 80 para el primer metro, 60 para los siguientes
  return 80 + (metros - 1) * 60;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Precio del andamio
export const ANDAMIO_PRICE = 120;

/**
 * Tarifas de instalación según Excel del cliente.
 * Cada tipo de equipo tiene su propia tabla con rangos de frigorías o configuración.
 * El precio depende de: tipo de equipo, frigorías calculadas, tipo de servicio (sustitución/nueva),
 * y para multis: nº de unidades interiores.
 */
const TARIFAS_SPLIT: { maxFg: number; sustitucion: number; nueva: number }[] = [
  { maxFg: 3000, sustitucion: 485, nueva: 320 },
  { maxFg: 4000, sustitucion: 540, nueva: 375 },
  { maxFg: 6000, sustitucion: 600, nueva: 435 },
];

const TARIFAS_CONDUCTO: { maxFg: number; precio: number }[] = [
  { maxFg: 3000, precio: 1800 },
  { maxFg: 4460, precio: 1800 },
  { maxFg: 6090, precio: 1900 },
  { maxFg: 7710, precio: 2100 },
  { maxFg: 9000, precio: 2300 },
  { maxFg: 10720, precio: 2600 },
  { maxFg: 12000, precio: 2600 },
  { maxFg: 999999, precio: 2600 },
];

const TARIFAS_CASSETTE: { maxFg: number; sustitucion: number; nueva: number }[] = [
  { maxFg: 6000, sustitucion: 1700, nueva: 1500 },
  { maxFg: 8000, sustitucion: 1900, nueva: 1700 },
  { maxFg: 12000, sustitucion: 2000, nueva: 1800 },
  { maxFg: 14000, sustitucion: 2100, nueva: 1900 },
];

const TARIFAS_SUELO_TECHO: { maxFg: number; sustitucion: number; nueva: number }[] = [
  { maxFg: 6000, sustitucion: 950, nueva: 750 },
  { maxFg: 8000, sustitucion: 1200, nueva: 1000 },
  { maxFg: 12000, sustitucion: 1700, nueva: 1500 },
  { maxFg: 14000, sustitucion: 2000, nueva: 1800 },
];

const TARIFAS_TWIN_SUELO_TECHO: { maxFg: number; sustitucion: number; nueva: number }[] = [
  { maxFg: 10000, sustitucion: 2200, nueva: 2000 },
  { maxFg: 14000, sustitucion: 2600, nueva: 2400 },
];

const TARIFAS_MULTI_SPLIT: Record<number, { sustitucion: number; nueva: number }> = {
  2: { sustitucion: 755, nueva: 590 },
  3: { sustitucion: 1075, nueva: 910 },
  4: { sustitucion: 1380, nueva: 1215 },
  5: { sustitucion: 1480, nueva: 1315 },
};

const TARIFAS_MULTI_CONDUCTO: Record<number, { sustitucion: number; nueva: number }> = {
  2: { sustitucion: 2600, nueva: 2300 },
  3: { sustitucion: 3000, nueva: 2600 },
  4: { sustitucion: 3200, nueva: 2800 },
};

const TARIFAS_MULTI_CASSETTE: Record<number, { sustitucion: number; nueva: number }> = {
  2: { sustitucion: 1900, nueva: 1700 },
  3: { sustitucion: 2000, nueva: 1800 },
  4: { sustitucion: 2100, nueva: 1900 },
};

export function getInstallationPrice(
  tipoEquipo: EquipmentType | null,
  frigorias: number,
  tipoServicio: ServiceType | null,
  unidadesInteriores: number = 0
): number {
  const isSustitucion = tipoServicio === 'sustitución';

  switch (tipoEquipo) {
    case 'split': {
      for (const r of TARIFAS_SPLIT) {
        if (frigorias <= r.maxFg) return isSustitucion ? r.sustitucion : r.nueva;
      }
      return isSustitucion ? 600 : 435;
    }

    case 'conducto': {
      for (const r of TARIFAS_CONDUCTO) {
        if (frigorias <= r.maxFg) return r.precio;
      }
      return 2600;
    }

    case 'cassette': {
      for (const r of TARIFAS_CASSETTE) {
        if (frigorias <= r.maxFg) return isSustitucion ? r.sustitucion : r.nueva;
      }
      return isSustitucion ? 2100 : 1900;
    }

    case 'suelo-techo': {
      for (const r of TARIFAS_SUELO_TECHO) {
        if (frigorias <= r.maxFg) return isSustitucion ? r.sustitucion : r.nueva;
      }
      return isSustitucion ? 2000 : 1800;
    }

    case 'twin': {
      for (const r of TARIFAS_TWIN_SUELO_TECHO) {
        if (frigorias <= r.maxFg) return isSustitucion ? r.sustitucion : r.nueva;
      }
      return isSustitucion ? 2600 : 2400;
    }

    case 'multisplit': {
      const cfg = TARIFAS_MULTI_SPLIT[unidadesInteriores] || TARIFAS_MULTI_SPLIT[2];
      return isSustitucion ? cfg.sustitucion : cfg.nueva;
    }

    case 'multi-conducto': {
      const cfg = TARIFAS_MULTI_CONDUCTO[unidadesInteriores] || TARIFAS_MULTI_CONDUCTO[2];
      return isSustitucion ? cfg.sustitucion : cfg.nueva;
    }

    case 'multi-cassette': {
      const cfg = TARIFAS_MULTI_CASSETTE[unidadesInteriores] || TARIFAS_MULTI_CASSETTE[2];
      return isSustitucion ? cfg.sustitucion : cfg.nueva;
    }

    default:
      return 315;
  }
}

/**
 * @deprecated Use getInstallationPrice() for real tariff-based pricing.
 * Kept for backward compatibility in components that reference it directly.
 */
export const BASE_INSTALLATION_PRICE = 315;

export function calculatePrice(
  precioEquipo: number,
  precioInstalacion: number,
  andamio: boolean,
  andamioPrice: number,
  urgencia72h: boolean,
  urgenciaPrice: number,
  metrosAdicionales: number,
  metrosAdicionalesPrice: number,
  conductoPrice: number = 0
): { subtotal: number; iva: number; descuentoPorcentaje: number; descuentoMonto: number; totalFinal: number } {
  const subtotal = precioEquipo + precioInstalacion + (andamio ? andamioPrice : 0) + (urgencia72h ? urgenciaPrice : 0) + metrosAdicionalesPrice + conductoPrice;
  const iva = subtotal * 0.21;
  const totalConIva = subtotal + iva;
  const descuentoPorcentaje = getDiscountPercentage(totalConIva);
  const descuentoMonto = (totalConIva * descuentoPorcentaje) / 100;
  const totalFinal = totalConIva - descuentoMonto;
  
  return {
    subtotal,
    iva,
    descuentoPorcentaje,
    descuentoMonto,
    totalFinal,
  };
}