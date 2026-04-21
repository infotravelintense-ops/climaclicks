'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Clock } from 'lucide-react';
import type { Language } from '@/app/types';
import { t } from '@/app/utils/translations';
import { LanguageSelector } from '@/app/_components/language-selector';

export default function PagoReparacion() {
  const [language, setLanguage] = useState<Language>('es');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    codigoPostal: '',
    direccion: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Temporada alta: 15 mayo - 15 septiembre → 120€
  // Temporada baja: 16 septiembre - 14 mayo → 90€
  const [isTemporadaAlta, setIsTemporadaAlta] = useState(false);
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth(); // 0-indexed
    const day = now.getDate();
    // Mayo (4) desde día 15 hasta Septiembre (8) día 15
    const alta = (month === 4 && day >= 15) || (month > 4 && month < 8) || (month === 8 && day <= 15);
    setIsTemporadaAlta(alta);
  }, []);
  const total = isTemporadaAlta ? 120 : 90;
  const descuentoPct = 10;
  const descuento = total * descuentoPct / 100;
  const totalConDescuento = total - descuento;

  const isValidMallorkaPostalCode = (code: string) => {
    const postal = parseInt(code);
    return !isNaN(postal) && postal >= 1000 && postal <= 52999;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'Requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'Requerido';
    if (!formData.email.trim()) newErrors.email = 'Requerido';
    if (!formData.codigoPostal.trim()) newErrors.codigoPostal = 'Requerido';
    if (!isValidMallorkaPostalCode(formData.codigoPostal)) {
      newErrors.codigoPostal = 'Solo Mallorca';
    }
    if (!formData.direccion.trim()) newErrors.direccion = 'Requerido';

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Aquí iría la integración de pago
      alert('Redirigiendo a pago...');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">{t('btn.volverInicio', language)}</span>
          </Link>
          <LanguageSelector current={language} onChange={setLanguage} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('reparacion.title', language)}
          </h1>
          <p className="text-gray-600">{t('reparacion.subtitle', language)}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t('reparacion.nombre', language)} *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Juan García"
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t('reparacion.telefono', language)} *
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+34 600 000 000"
                  />
                  {errors.telefono && (
                    <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t('reparacion.codigoPostal', language)} *
                  </label>
                  <input
                    type="text"
                    value={formData.codigoPostal}
                    onChange={(e) =>
                      setFormData({ ...formData, codigoPostal: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.codigoPostal ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="07000"
                  />
                  {errors.codigoPostal && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.codigoPostal}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t('reparacion.email', language)} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('reparacion.direccion', language)} *
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.direccion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Calle Principal, 123"
                />
                {errors.direccion && (
                  <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
                )}
              </div>

              {/* Aviso Mallorca */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  {t('reparacion.aviso', language)}
                </p>
              </div>
            </form>
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-2xl shadow-card p-8 h-fit sticky top-24">
            {/* Empresa */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                {t('reparacion.empresa', language)}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">MCN</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Manteniments Costa Nord</p>
                  <p className="text-sm text-gray-600">Mallorca</p>
                </div>
              </div>
            </div>

            {/* Presupuesto */}
            <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-bold text-lg text-gray-900">
                Resumen del presupuesto
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Servicio de reparación{isTemporadaAlta ? ' (temp. alta)' : ' (temp. baja)'}:</span>
                  <span className="font-semibold text-gray-900">{total.toFixed(2).replace('.', ',')}€</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">{total.toFixed(2).replace('.', ',')}€</span>
                </div>
              </div>
            </div>

            {/* Descuento */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-green-900">{descuentoPct}%{' '}{t('reparacion.descuento', language)}</p>
                  <p className="text-sm text-green-800 mt-1">
                    {t('reparacion.contratar', language)}
                  </p>
                  <p className="text-2xl font-bold text-green-600 mt-3">{totalConDescuento.toFixed(2).replace('.', ',')}€</p>
                </div>
              </div>
            </div>

            {/* Botones de pago */}
            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                {t('reparacion.pagar', language)}
              </button>
              <button className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                {t('reparacion.paypal', language)}
              </button>
              <button className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                {t('reparacion.applepay', language)}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
