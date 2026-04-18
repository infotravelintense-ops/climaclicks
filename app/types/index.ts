// Tipos TypeScript para la aplicación

export type Language = 'es' | 'en' | 'de' | 'it' | 'hu';

export type ServiceType = 'sustitución' | 'instalacion' | 'averia' | 'proyecto';

export type EquipmentType = 
  | 'split'
  | 'multisplit'
  | 'conducto'
  | 'casete'
  | 'suelo-techo'
  | 'twin'
  | 'multi-conducto'
  | 'multi-casete';

export interface Equipment {
  tipo: EquipmentType;
  modelo: string;
  marca: string;
  frigoriasMin: number;
  frigoriasMax: number;
  kW: number;
  precio: number;
  garantia: string;
  eficiencia: string;
  descripcion: string;
}

export interface QuoteData {
  // Paso 1
  language: Language;
  tipoServicio: ServiceType | null;
  
  // Paso 2
  tipoEquipo: EquipmentType | null;
  
  // Paso 3
  metrosCuadrados: number;
  altura: number;
  exposicionSolar: number;
  frigoriasCalculadas: number;
  
  // Paso 4
  modeloSeleccionado: Equipment | null;
  
  // Paso 5
  andamio: boolean;
  urgencia72h: boolean;
  metrosAdicionales: number;
  
  // Paso 6
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente: string;
  direccionCliente: string;
  codigoPostalCliente: string;
}

export interface PriceBreakdown {
  precioEquipo: number;
  precioInstalacion: number;
  precioAndamio: number;
  precioUrgencia: number;
  precioMetrosAdicionales: number;
  subtotal: number;
  iva: number;
  descuentoPorcentaje: number;
  descuentoMonto: number;
  totalFinal: number;
}