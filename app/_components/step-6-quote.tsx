'use client';

import type { Language, Equipment } from '@/app/types';
import { t } from '@/app/utils/translations';
import { formatCurrency, isValidMaillorquinPostalCode } from '@/app/utils/calculations';
import { useState } from 'react';
import { CountdownTimer } from './countdown-timer';

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
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        {t('paso6.title', language)}
      </h2>

      <div className="space-y-6">
        {/* Resumen */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {t('paso6.resumen', language)}
          </h3>
          <p className="text-gray-600 mb-2">
            {t('paso6.suministro', language)}: {model.marca} {model.modelo}
          </p>
          <p className="text-sm text-gray-600 mb-4">{model.descripcion}</p>

          <div className="border-t-2 border-gray-200 pt-4 mt-4">
            <div className="flex justify-between py-2 text-gray-600">
              <span>{t('paso6.subtotal', language)}:</span>
              <span>{formatCurrency(precio.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 text-gray-600">
              <span>{t('paso6.iva', language)}:</span>
              <span>{formatCurrency(precio.iva)}</span>
            </div>
            {precio.descuentoMonto > 0 && (
              <div className="flex justify-between py-2 text-red-600">
                <span>{t('paso6.descuento', language)}:</span>
                <span>-{formatCurrency(precio.descuentoMonto)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 text-lg font-bold text-gray-900 border-t border-gray-200 mt-2">
              <span>{t('paso6.total', language)}:</span>
              <span className="text-blue-600">{formatCurrency(precio.totalFinal)}</span>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <CountdownTimer
          totalPrice={precio.subtotal + precio.iva}
          discountPercentage={precio.descuentoPorcentaje}
          discountedPrice={precio.totalFinal}
        />

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border-2 border-gray-200 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">{t('paso6.formulario', language)}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t('paso6.nombre', language)}
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="tel"
              placeholder={t('paso6.telefono', language)}
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder={t('paso6.codigoPostal', language)}
                value={formData.codigoPostal}
                onChange={handleCPChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  cpError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
              />
              {cpError && <p className="text-xs text-red-600 mt-1">{t('paso6.invalidoMallorca', language)}</p>}
            </div>
            <input
              type="text"
              placeholder={t('paso6.direccion', language)}
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <input
            type="email"
            placeholder={t('paso6.email', language)}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={!isFormValid || submitted}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                isFormValid && !submitted
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitted ? '✓ Enviado' : t('paso6.pagar', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}