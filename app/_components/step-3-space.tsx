'use client';

import type { Language } from '@/app/types';
import { t } from '@/app/utils/translations';
import { calculateFrigorias } from '@/app/utils/calculations';
import { useState } from 'react';

interface Step3Props {
  language: Language;
  onUpdate: (data: { metrosCuadrados: number; altura: number; exposicionSolar: number; frigoriasCalculadas: number }) => void;
  initialData: { metrosCuadrados: number; altura: number; exposicionSolar: number };
}

export function Step3Space({ language, onUpdate, initialData }: Step3Props) {
  const [metros, setMetros] = useState(initialData.metrosCuadrados);
  const [altura, setAltura] = useState(initialData.altura);
  const [exposicion, setExposicion] = useState(initialData.exposicionSolar);

  const frigorias = calculateFrigorias(metros, altura, exposicion);

  const handleChange = () => {
    onUpdate({
      metrosCuadrados: metros,
      altura,
      exposicionSolar: exposicion,
      frigoriasCalculadas: frigorias,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        {t('paso3.title', language)}
      </h2>
      <p className="text-gray-600 text-center mb-12">
        {t('paso3.subtitle', language)}
      </p>

      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-8">
        {/* Metros cuadrados */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            {t('paso3.metros', language)}: {metros} m²
          </label>
          <input
            type="range"
            min="5"
            max="150"
            step="5"
            value={metros}
            onChange={(e) => setMetros(parseInt(e.target.value, 10))}
            onChangeCapture={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>5 m²</span>
            <span>150 m²</span>
          </div>
        </div>

        {/* Altura */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            {t('paso3.altura', language)}
          </label>
          <div className="flex gap-4">
            {[
              { value: 2.5, label: 'paso3.altura.baja' },
              { value: 3, label: 'paso3.altura.media' },
              { value: 4, label: 'paso3.altura.alta' },
            ].map((h) => (
              <button
                key={h.value}
                onClick={() => {
                  setAltura(h.value);
                  onUpdate({
                    metrosCuadrados: metros,
                    altura: h.value,
                    exposicionSolar: exposicion,
                    frigoriasCalculadas: calculateFrigorias(metros, h.value, exposicion),
                  });
                }}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  altura === h.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                {t(h.label as any, language)}
              </button>
            ))}
          </div>
        </div>

        {/* Exposición solar */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            {t('paso3.exposicion', language)}
          </label>
          <div className="flex gap-4">
            {[
              { value: 1.0, label: 'paso3.exposicion.normal' },
              { value: 1.2, label: 'paso3.exposicion.soleado' },
            ].map((e) => (
              <button
                key={e.value}
                onClick={() => {
                  setExposicion(e.value);
                  onUpdate({
                    metrosCuadrados: metros,
                    altura,
                    exposicionSolar: e.value,
                    frigoriasCalculadas: calculateFrigorias(metros, altura, e.value),
                  });
                }}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  exposicion === e.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                {t(e.label as any, language)}
              </button>
            ))}
          </div>
        </div>

        {/* Cálculo de frigorías */}
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-gray-600 mb-1">
            {t('paso3.frigoriasCalculadas', language)}
          </p>
          <p className="text-3xl font-bold text-blue-600">
            {frigorias.toLocaleString()} fg
          </p>
        </div>
      </div>
    </div>
  );
}