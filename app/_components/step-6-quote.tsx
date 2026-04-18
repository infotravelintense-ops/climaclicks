'use client';

import Image from 'next/image';
import type { Language, Equipment, ServiceType } from '@/app/types';
import { formatCurrency, isValidSpanishPostalCode, isValidMaillorquinPostalCode, BASE_INSTALLATION_PRICE } from '@/app/utils/calculations';
import { useState } from 'react';
import { CountdownTimer } from './countdown-timer';
import { Check, Download, AlertTriangle, ExternalLink, CreditCard, Smartphone } from 'lucide-react';

interface Step6Props {
  language: Language;
  model: Equipment;
  serviceType: ServiceType | null;
  alternativeModels: Equipment[];
  precio: {
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
  };
  onSubmit: (data: any) => void;
  onSelectAlternative: (model: Equipment) => void;
}

// Items incluidos en la instalación según el tipo de servicio
function getIncludedItems(serviceType: ServiceType | null): string[] {
  const common = [
    'Suministro e instalación de aire acondicionado',
    'Limpieza con nitrógeno de alta presión',
    'Completamente montado e instalado',
    'Certificado con boletín de instalación',
  ];
  if (serviceType === 'sustitución') {
    return [
      'Recuperación de gas',
      'Desmontaje del equipo antiguo',
      'Descontaminación del equipo antiguo',
      'Limpieza con nitrógeno de alta presión',
      'Suministro e instalación de aire acondicionado',
      'Completamente montado e instalado',
      'Certificado con boletín de instalación',
    ];
  }
  return common;
}

function getGiatsuBadge(modelo: string): { label: string; color: string } | null {
  const m = modelo.toUpperCase();
  if (m.includes('SAKU')) return { label: 'Relación calidad precio', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  if (m.includes('ARPLUS')) return { label: 'La mejor opción', color: 'bg-purple-100 text-purple-800 border-purple-300' };
  if (m.includes('AR3')) return { label: 'Con más garantía', color: 'bg-orange-100 text-orange-800 border-orange-300' };
  return null;
}

function getAlternativeBadge(model: Equipment): { label: string; color: string } {
  const marca = (model.marca || '').toLowerCase();
  const giatsu = getGiatsuBadge(model.modelo);
  if (giatsu) return giatsu;
  if (marca === 'infinition') return { label: 'La opción más económica', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  if (marca === 'htw') return { label: 'Opción alternativa', color: 'bg-blue-100 text-blue-800 border-blue-300' };
  return { label: 'Opción alternativa', color: 'bg-gray-100 text-gray-800 border-gray-300' };
}

/**
 * Nombre a mostrar en el carrusel.
 * Para Giatsu cada línea tiene un nombre comercial: Sakura / Aroma 3 / Aroma Plus.
 * Para otras marcas se usa la marca con capitalización adecuada.
 */
function getDisplayBrand(model: Equipment): string {
  const m = (model.modelo || '').toUpperCase();
  if (m.includes('SAKU')) return 'Sakura';
  if (m.includes('ARPLUS')) return 'Aroma Plus';
  if (m.includes('AR3')) return 'Aroma 3';
  const marca = (model.marca || '').trim();
  if (marca.toLowerCase() === 'infinition') return 'Infinition';
  if (marca.toLowerCase() === 'htw') return 'HTW';
  return marca;
}

// Calcula el precio pre-descuento (con IVA) para mostrar en el carrusel
function calcPreviewTotal(equipo: number): number {
  const subtotal = equipo + BASE_INSTALLATION_PRICE;
  return subtotal * 1.21;
}

export function Step6Quote({ language, model, serviceType, alternativeModels, precio, onSubmit, onSelectAlternative }: Step6Props) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    codigoPostal: '',
  });
  const [cpError, setCpError] = useState(false);
  const [cpOutsideMallorca, setCpOutsideMallorca] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const includedItems = getIncludedItems(serviceType);

  const handleCPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cp = e.target.value.replace(/\D/g, '').slice(0, 5);
    setFormData({ ...formData, codigoPostal: cp });
    if (cp.length === 5) {
      const valid = isValidSpanishPostalCode(cp);
      setCpError(!valid);
      setCpOutsideMallorca(valid && !isValidMaillorquinPostalCode(cp));
    } else {
      setCpError(false);
      setCpOutsideMallorca(false);
    }
  };

  // Pagos siempre activos para cualquier CP español de 5 dígitos.
  // Si el cliente está fuera de Mallorca (ej: Madrid) pero compra para casa de Mallorca, lo permitimos.
  const isFormValid =
    formData.nombre.length >= 3 &&
    formData.email.includes('@') &&
    formData.telefono.length >= 9 &&
    formData.direccion.length >= 5 &&
    isValidSpanishPostalCode(formData.codigoPostal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSubmit({
      ...formData,
      modeloSeleccionado: model.modelo,
      totalFinal: precio.totalFinal,
    });
    setSubmitted(true);
  };

  // Generar PDF de la ficha técnica (simple print-to-PDF via window.print con CSS)
  const handleDescargarFicha = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Ficha Técnica - ${model.modelo}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
        h1 { color: #0f766e; border-bottom: 3px solid #0f766e; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; }
        .specs { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .specs tr:nth-child(even) { background: #f9fafb; }
        .specs td { padding: 10px; border: 1px solid #e5e7eb; }
        .specs td:first-child { font-weight: bold; width: 40%; color: #555; }
        .desc { background: #ecfdf5; padding: 15px; border-left: 4px solid #059669; margin: 20px 0; }
        img { max-width: 300px; margin: 20px 0; }
      </style></head><body>
        <h1>Ficha Técnica - ${model.marca}</h1>
        <p style="color:#666;font-size:14px">Modelo: <strong>${model.modelo}</strong></p>
        ${model.imagen ? `<img src="${model.imagen}" alt="${model.modelo}" />` : ''}
        <h2>Especificaciones</h2>
        <table class="specs">
          <tr><td>Marca</td><td>${model.marca}</td></tr>
          <tr><td>Modelo</td><td>${model.modelo}</td></tr>
          <tr><td>Frigorías</td><td>${model.frigoriasMin.toLocaleString('es-ES')} fg</td></tr>
          <tr><td>Potencia</td><td>${model.kW} kW</td></tr>
          <tr><td>Eficiencia energética</td><td>${model.eficiencia}</td></tr>
          <tr><td>Garantía</td><td>${model.garantia}</td></tr>
          <tr><td>Tipo</td><td>${model.tipo}</td></tr>
        </table>
        <h2>Descripción</h2>
        <div class="desc">${model.descripcion}</div>
        <p style="margin-top:40px;color:#666;font-size:12px;text-align:center">
          Manteniments Costa Nord S.L. &middot; Av. Golf 23, Bajo Izquierda, Can Picafort, 07458<br>
          657 12 94 74 &middot; contabilidad@grupocostanord.com &middot; www.mantenimentscostanord.com
        </p>
        <script>setTimeout(() => window.print(), 500);</script>
      </body></html>
    `);
    w.document.close();
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeInUp space-y-6">
      {/* Botón Descargar Ficha Técnica */}
      <div className="text-center">
        <button
          onClick={handleDescargarFicha}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold shadow-card transition-all"
        >
          <Download className="w-4 h-4" strokeWidth={2} />
          Descargar ficha técnica
        </button>
      </div>

      {/* Resumen del presupuesto */}
      <div className="bg-white rounded-2xl shadow-card p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Resumen del presupuesto</h2>

        <div className="mb-6">
          <p className="text-base text-gray-900">
            <span className="font-bold">Suministro e instalación de:</span> {model.modelo}
          </p>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{model.descripcion}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">* Incluye instalación:</p>
          <ul className="space-y-1 pl-4">
            {includedItems.map((item, i) => (
              <li key={i} className="text-sm text-blue-700">{item}</li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700">Subtotal (sin IVA)</span>
            <span className="font-semibold text-gray-900">{formatCurrency(precio.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700">IVA (21%)</span>
            <span className="font-semibold text-gray-900">{formatCurrency(precio.iva)}</span>
          </div>
          {precio.precioAndamio > 0 && (
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Andamio incluido</span>
              <span>{formatCurrency(precio.precioAndamio)}</span>
            </div>
          )}
          {precio.precioUrgencia > 0 && (
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Urgencia incluida</span>
              <span>{formatCurrency(precio.precioUrgencia)}</span>
            </div>
          )}
          {precio.precioMetrosAdicionales > 0 && (
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Metros adicionales incluidos</span>
              <span>{formatCurrency(precio.precioMetrosAdicionales)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-2xl font-black text-gray-900">{formatCurrency(precio.subtotal + precio.iva)}</span>
          </div>
        </div>
      </div>

      {/* Manteniments Costa Nord */}
      <div className="bg-white rounded-2xl shadow-card p-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
          <span className="text-white font-black text-xl">MC</span>
        </div>
        <p className="text-lg font-bold text-gray-900 mb-1">
          Su instalaci&oacute;n la va a llevar a cabo Manteniments Costa Nord S.L.
        </p>
        <p className="text-sm text-gray-600 mb-3">
          Empresa instaladora autorizada para la ejecuci&oacute;n del servicio contratado.
        </p>
        <a
          href="https://www.mantenimentscostanord.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          www.mantenimentscostanord.com
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Cuenta atrás 10% descuento */}
      <CountdownTimer
        totalPrice={precio.subtotal + precio.iva}
        discountPercentage={precio.descuentoPorcentaje}
        discountedPrice={precio.totalFinal}
      />

      {/* Otras opciones compatibles (carrusel horizontal) */}
      {alternativeModels.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="text-lg font-bold text-gray-900 text-center mb-4">Otras opciones compatibles</h3>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 min-w-min">
              {alternativeModels.map((alt) => {
                const badge = getAlternativeBadge(alt);
                const preDisc = calcPreviewTotal(alt.precio);
                return (
                  <button
                    key={alt.modelo}
                    onClick={() => onSelectAlternative(alt)}
                    className="flex-shrink-0 w-56 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-blue-500 rounded-xl p-4 text-center transition-all card-hover"
                  >
                    <div className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold border ${badge.color} mb-2`}>
                      {badge.label}
                    </div>
                    <p className="text-xl font-black text-slate-900">{getDisplayBrand(alt)}</p>
                    <p className="text-[11px] text-gray-500 mb-2">{alt.modelo}</p>
                    <p className="text-sm text-gray-700"><span className="font-semibold">Garantía:</span> {alt.garantia}</p>
                    <p className="text-sm text-gray-700 mb-2"><span className="font-semibold">Eficiencia:</span> {alt.eficiencia}</p>
                    <p className="text-xl font-black text-gray-900">{formatCurrency(preDisc)}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Formulario de contacto */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
            required
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Código postal"
              value={formData.codigoPostal}
              onChange={handleCPChange}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${
                cpError ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-400'
              } focus:ring-2`}
              required
            />
            {cpError && <p className="text-xs text-red-600 mt-1">Código postal no válido. Debe tener 5 dígitos.</p>}
          </div>
          <input
            type="text"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
            required
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
          required
        />

        {/* Aviso opcional si el CP está fuera de Mallorca — NO bloquea el pago */}
        {cpOutsideMallorca && (
          <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Tu código postal no es de Mallorca. Solo instalamos en Mallorca, pero puedes comprar desde cualquier lugar
              de España si la vivienda donde se instalará está en la isla. Te llamaremos para coordinar la entrega.
            </span>
          </div>
        )}

        {/* Botones de pago */}
        <button
          type="submit"
          disabled={!isFormValid || submitted}
          className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            isFormValid && !submitted
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-elevated'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {submitted ? (
            <>
              <Check className="w-5 h-5" strokeWidth={3} /> Presupuesto enviado
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" strokeWidth={2} /> Pagar con tarjeta
            </>
          )}
        </button>

        <button
          type="button"
          disabled={!isFormValid || submitted}
          onClick={handleSubmit}
          className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            isFormValid && !submitted
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Pagar con PayPal
        </button>

        <button
          type="button"
          disabled={!isFormValid || submitted}
          onClick={handleSubmit}
          className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            isFormValid && !submitted
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Smartphone className="w-5 h-5" strokeWidth={2} /> Pagar con Apple Pay
        </button>

        <p className="text-xs text-gray-500 text-center pt-2">
          Nos pondremos en contacto en las pr&oacute;ximas 24 horas para confirmar tu solicitud.
        </p>
      </form>
    </div>
  );
}
