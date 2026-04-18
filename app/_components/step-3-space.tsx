'use client';

import type { Language } from '@/app/types';
import { t } from '@/app/utils/translations';
import { calculateFrigorias } from '@/app/utils/calculations';
import { useState } from 'react';

interface Step3Props {
  language: Language;
  onUpdate: (data: {
    metrosCuadrados: number;
    altura: number;
    exposicionSolar: number;
    frigoriasCalculadas: number;
  }) => void;
}

export function Step3Space({ language, onUpdate }: Step3Props) {
  const [metrosCuadrados, setMetrosCuadrados] = useState(50);
  const [altura, setAltura] = useState(3);
  const [exposicionSolar, setExposicionSolar] = useState(1);

  const frigoriasCalculadas = calculateFrigorias(metrosCuadrados, altura, exposicionSolar);

  const handleMetrosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setMetrosCuadrados(value);
    onUpdate({
      metrosCuadrados: value,
      altura,
      exposicionSolar,
      frigoriasCalculadas: calculateFrigorias(value, altura, exposicionSolar),
    });
  };

  const handleAlturaChange = (alt: number) => {
    setAltura(alt);
    onUpdate({
      metrosCuadrados,
      altura: alt,
      exposicionSolar,
      frigoriasCalculadas: calculateFrigorias(metrosCuadrados, alt, exposicionSolar),
    });
  };

  const handleExposicionChange = (exp: number) => {
    setExposicionSolar(exp);
    onUpdate({
      metrosCuadrados,
      altura,
      exposicionSolar: exp,
      frigoriasCalculadas: calculateFrigorias(metrosCuadrados, altura, exp),
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeInUp">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {t('paso3.title', language)}
        </h2>
        <p className="text-gray-600 text-lg">
          {t('paso3.subtitle', language)}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-8 space-y-8">
        {/* Métros Cuadrados */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-lg font-bold text-gray-900">
              {t('paso3.metros', language)}
            </label>
            <span className="text-3xl font-bold text-blue-600">{Math.round(metrosCuadrados)} m²</span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            value={metrosCuadrados}
            onChange={handleMetrosChange}
            className="w-full"
            style={{ '--value': `${((metrosCuadrados - 5) / (150 - 5)) * 100}%` } as React.CSSProperties}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>5 m²</span>
            <span>150 m²</span>
          </div>
        </div>

        {/* Altura */}
        <div className="space-y-4">
          <label className="text-lg font-bold text-gray-900 block">
            {t('paso3.altura', language)}
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 2.5, label: '2.5m' },
              { value: 3, label: '3m' },
              { value: 4, label: '4m' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleAlturaChange(option.value)}
                className={`p-4 rounded-xl font-bold transition-all duration-300 ${
                  altura === option.value
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-elevated'
                    : 'bg-gray-100 text-gray-900 card-hover'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exposición Solar */}
        <div className="space-y-4">
          <label className="text-lg font-bold text-gray-900 block">
            {t('paso3.exposicion', language)}
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 1, label: 'Normal (100%)' },
              { value: 1.2, label: 'Muy soleado (120%)' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleExposicionChange(option.value)}
                className={`p-4 rounded-xl font-bold transition-all duration-300 ${
                  exposicionSolar === option.value
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-elevated'
                    : 'bg-gray-100 text-gray-900 card-hover'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
          <p className="text-gray-600 font-semibold mb-2">Frigorias calculadas</p>
          <p className="text-4xl font-bold text-green-600">
            {Math.round(frigoriasCalculadas).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">Capacidad recomendada para tu espacio</p>
        </div>
      </div>
    </div>
  );
}
