'use client';

import Image from 'next/image';
import type { Language, Equipment } from '@/app/types';
import { t } from '@/app/utils/translations';
import { formatCurrency, isValidMaillorquinPostalCode } from '@/app/utils/calculations';
import { useState } from 'react';
import { CountdownTimer } from './countdown-timer';
import { Check, Send, ShieldCheck, Award, Snowflake, Zap, Leaf } from 'lucide-react';

interface Step6Props {
  language: Language;
  model: Equipment;
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
}

export function Step6Quote({ language, model, precio, onSubmit }: Step6Props) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    codigoPostal: '',
  });

  const [cpError, setCpError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cp = e.target.value;
    setFormData({ ...formData, codigoPostal: cp });

    if (cp) {
      setCpError(!isValidMaillorquinPostalCode(cp));
    } else {
      setCpError(false);
    }
  };

  const isFormValid =
    formData.nombre.length >= 3 &&
    formData.email.includes('@') &&
    formData.telefono.length >= 9 &&
    formData.direccion.length >= 10 &&
    isValidMaillorquinPostalCode(formData.codigoPostal) &&
    !cpError;

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

  return (
    <div className="w-full max-w-6xl mx-auto animate-fadeInUp">
      <div className="mb-12 text-center">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          {t('paso6.title', language)}
        </h2>
        <p className="text-gray-600 text-lg">Revisa tu presupuesto y completa tu solicitud</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda - Resumen del modelo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden sticky top-8">
            {/* Imagen del modelo */}
            <div className="relative w-full h-72 bg-gradient-to-b from-white to-gray-50 flex items-center justify-center overflow-hidden">
              {model.imagen && (
                <Image
                  src={model.imagen}
                  alt={model.modelo}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 1200px) 100vw, 33vw"
                />
              )}
            </div>

            {/* Info del modelo */}
            <div className="p-6 space-y-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Marca</p>
                <p className="text-xl font-bold text-gray-900">{model.marca}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Modelo</p>
                <p className="text-sm text-gray-700 font-medium">{model.modelo}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Snowflake className="w-3 h-3 text-blue-600" />
                    <p className="text-xs text-gray-600">Frigorias</p>
                  </div>
                  <p className="font-bold text-blue-600 text-sm">{model.frigoriasMin.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="w-3 h-3 text-purple-600" />
                    <p className="text-xs text-gray-600">Potencia</p>
                  </div>
                  <p className="font-bold text-purple-600 text-sm">{model.kW} kW</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Leaf className="w-3 h-3 text-green-600" />
                    <p className="text-xs text-gray-600">Eficiencia</p>
                  </div>
                  <p className="font-bold text-green-600 text-sm">{model.eficiencia}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    <p className="text-xs text-gray-600">Garantia</p>
                  </div>
                  <p className="font-bold text-amber-600 text-sm">{model.garantia}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed pt-4 border-t border-gray-100">
                {model.descripcion}
              </p>
            </div>
          </div>
        </div>

        {/* Columna derecha - Presupuesto y formulario */}
        <div className="lg:col-span-2 space-y-6">
          {/* Desglose de precios */}
          <div className="bg-white rounded-2xl shadow-card p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Desglose del presupuesto</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-700">Equipo</span>
                <span className="font-semibold text-gray-900">{formatCurrency(precio.precioEquipo)}</span>
              </div>

              {precio.precioInstalacion > 0 && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Instalacion</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(precio.precioInstalacion)}</span>
                </div>
              )}

              {precio.precioAndamio > 0 && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Andamio</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(precio.precioAndamio)}</span>
                </div>
              )}

              {precio.precioUrgencia > 0 && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Urgencia 72h</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(precio.precioUrgencia)}</span>
                </div>
              )}

              {precio.precioMetrosAdicionales > 0 && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Metros adicionales</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(precio.precioMetrosAdicionales)}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-3 bg-blue-50 px-4 rounded-lg">
                <span className="text-gray-700 font-semibold">Subtotal</span>
                <span className="font-bold text-blue-600 text-lg">{formatCurrency(precio.subtotal)}</span>
              </div>

              <div className="flex justify-between items-center py-3 bg-purple-50 px-4 rounded-lg">
                <span className="text-gray-700 font-semibold">IVA (21%)</span>
                <span className="font-bold text-purple-600 text-lg">{formatCurrency(precio.iva)}</span>
              </div>

              {precio.descuentoMonto > 0 && (
                <div className="flex justify-between items-center py-3 bg-green-50 px-4 rounded-lg border-2 border-green-300">
                  <span className="text-green-700 font-semibold">Descuento ({precio.descuentoPorcentaje}%)</span>
                  <span className="font-bold text-green-600 text-lg">-{formatCurrency(precio.descuentoMonto)}</span>
                </div>
              )}
            </div>

            {/* Total final */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <p className="text-sm font-semibold opacity-90 mb-2">TOTAL A PAGAR</p>
              <p className="text-4xl font-bold">{formatCurrency(precio.totalFinal)}</p>
            </div>
          </div>

          {/* Countdown */}
          <CountdownTimer
            totalPrice={precio.subtotal + precio.iva}
            discountPercentage={precio.descuentoPorcentaje}
            discountedPrice={precio.totalFinal}
          />

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Datos de contacto</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
                required
              />
              <input
                type="tel"
                placeholder="Telefono"
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
                  placeholder="Codigo Postal Mallorca"
                  value={formData.codigoPostal}
                  onChange={handleCPChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${
                    cpError ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-400'
                  } focus:ring-2`}
                  required
                />
                {cpError && <p className="text-xs text-red-600 mt-2 font-semibold">Codigo Postal invalido. Usa 07001-07999</p>}
              </div>
              <input
                type="text"
                placeholder="Direccion"
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

            <button
              type="submit"
              disabled={!isFormValid || submitted}
              className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all duration-300 mt-6 flex items-center justify-center gap-2 ${
                isFormValid && !submitted
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-elevated transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitted ? (
                <>
                  <Check className="w-5 h-5" strokeWidth={3} /> Presupuesto enviado
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" strokeWidth={2} /> Solicitar presupuesto
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center pt-4">
              Nos pondremos en contacto en las proximas 24 horas para confirmar tu solicitud.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
