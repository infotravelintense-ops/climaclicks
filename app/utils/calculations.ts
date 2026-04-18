'use client';

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

// Precio base de instalación (Sustitución / Nueva instalación)
export const BASE_INSTALLATION_PRICE = 315;
// Precio del andamio
export const ANDAMIO_PRICE = 120;

export function calculatePrice(
  precioEquipo: number,
  precioInstalacion: number,
  andamio: boolean,
  andamioPrice: number,
  urgencia72h: boolean,
  urgenciaPrice: number,
  metrosAdicionales: number,
  metrosAdicionalesPrice: number
): { subtotal: number; iva: number; descuentoPorcentaje: number; descuentoMonto: number; totalFinal: number } {
  const subtotal = precioEquipo + precioInstalacion + (andamio ? andamioPrice : 0) + (urgencia72h ? urgenciaPrice : 0) + metrosAdicionalesPrice;
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