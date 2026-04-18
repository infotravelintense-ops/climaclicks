'use client';

import type { Language } from '@/app/types';
import { t } from '@/app/utils/translations';
import { formatCurrency, isHighSeason, getUrgenciaPrice, calculateMetrosAdicionalesPrice } from '@/app/utils/calculations';
import { useState } from 'react';

interface Step5Props {
  language: Language;
  onUpdate: (data: {
    andamio: boolean;
    urgencia72h: boolean;
    metrosAdicionales: number;
  }) => void;
  initialData: {
    andamio: boolean;
    urgencia72h: boolean;
    metrosAdicionales: number;
  };
}

export function Step5Extras({ language, onUpdate, initialData }: Step5Props) {
  const [andamio, setAndamio] = useState(initialData.andamio);
  const [urgencia, setUrgencia] = useState(initialData.urgencia72h);
  const [metros, setMetros] = useState(initialData.metrosAdicionales);

  const urgenciaPrice = getUrgenciaPrice(isHighSeason(new Date()));
  const metrosPrice = calculateMetrosAdicionalesPrice(metros);

  const handleChange = () => {
    onUpdate({
      andamio,
      urgencia72h: urgencia,
      metrosAdicionales: metros,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        {t('paso5.title', language)}
      </h2>
      <p className="text-gray-600 text-center mb-12">
        {t('paso5.subtitle', language)}
      </p>

      <div className="space-y-6">
        {/* Metros adicionales */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            {t('paso5.metros', language)}: {metros} m
          </label>
          <p className="text-xs text-gray-500 mb-4">
            {t('paso5.metros.desc', language)} - {t('paso5.metros.precio', language)}
          </p>
          <input
            type="range"
            min="0"
            max="15"
            step="1"
            value={metros}
            onChange={(e) => setMetros(parseInt(e.target.value, 10))}
            onChangeCapture={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-sm font-semibold text-gray-900 mt-3">
            {formatCurrency(metrosPrice)}
          </p>
        </div>

        {/* Andamio */}
        <button
          onClick={() => {
            setAndamio(!andamio);
            handleChange();
          }}
          className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
            andamio
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900">{t('paso5.andamio', language)}</h3>
              <p className="text-sm text-gray-600 mt-1">{t('paso5.andamio.desc', language)}</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{t('paso5.andamio.precio', language)}</p>
          </div>
        </button>

        {/* Urgencia 72h */}
        <button
          onClick={() => {
            setUrgencia(!urgencia);
            handleChange();
          }}
          className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
            urgencia
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900">{t('paso5.urgencia', language)}</h3>
              <p className="text-sm text-gray-600 mt-1">{t('paso5.urgencia.desc', language)}</p>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {isHighSeason(new Date()) ? t('paso5.urgencia.alta', language) : t('paso5.urgencia.baja', language)}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}