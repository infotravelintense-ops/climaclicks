'use client';

import type { Language } from '@/app/types';
import { t } from '@/app/utils/translations';
import {
  formatCurrency,
  isHighSeason,
  getUrgenciaPrice,
  calculateMetrosAdicionalesPrice,
} from '@/app/utils/calculations';
import { useState } from 'react';
import { Ruler, Construction, Zap, Check, Circle } from 'lucide-react';

interface Step5Props {
  language: Language;
  onUpdate: (data: {
    andamio: boolean;
    urgencia: boolean;
    metrosAdicionalesCount: number;
  }) => void;
}

export function Step5Extras({ language, onUpdate }: Step5Props) {
  const [andamio, setAndamio] = useState(false);
  const [urgencia, setUrgencia] = useState(false);
  const [metrosAdicionalesCount, setMetrosAdicionalesCount] = useState(0);

  const isHighSeas = isHighSeason(new Date());
  const urgenciaPrice = getUrgenciaPrice(isHighSeas);
  const metrosPrice = calculateMetrosAdicionalesPrice(metrosAdicionalesCount);

  const handleAndamioChange = (value: boolean) => {
    setAndamio(value);
    onUpdate({ andamio: value, urgencia, metrosAdicionalesCount });
  };

  const handleUrgenciaChange = (value: boolean) => {
    setUrgencia(value);
    onUpdate({ andamio, urgencia: value, metrosAdicionalesCount });
  };

  const handleMetrosChange = (value: number) => {
    setMetrosAdicionalesCount(value);
    onUpdate({ andamio, urgencia, metrosAdicionalesCount: value });
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeInUp">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
          {t('paso5.title', language)}
        </h2>
        <p className="text-gray-600 text-lg">
          {t('paso5.subtitle', language)}
        </p>
      </div>

      <div className="space-y-6">
        {/* Metros Adicionales */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Ruler className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                Metros adicionales de línea frigorífica
              </h3>
              <p className="text-sm text-gray-500">Instalación estándar hasta 3 metros incluida</p>
            </div>
            <span className="text-2xl font-bold text-blue-600 whitespace-nowrap">{metrosAdicionalesCount} m</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={metrosAdicionalesCount}
            onChange={(e) => handleMetrosChange(parseInt(e.target.value))}
            className="w-full mb-4"
            style={{ '--value': `${metrosAdicionalesCount}%` } as React.CSSProperties}
          />
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-gray-600 font-medium">Precio adicional:</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(metrosPrice)}</span>
          </div>
        </div>

        {/* Andamio */}
        <button
          onClick={() => handleAndamioChange(!andamio)}
          className={`w-full rounded-2xl p-8 transition-all duration-300 shadow-card card-hover text-left ${
            andamio
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500'
              : 'bg-white border-2 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
              andamio ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
            }`}>
              <Construction className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Andamio profesional</h3>
              <p className="text-gray-600 text-sm">Instalación segura en fachadas o trabajos en altura</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              andamio ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {andamio ? <Check className="w-5 h-5" strokeWidth={3} /> : <Circle className="w-5 h-5" strokeWidth={1.5} />}
            </div>
          </div>
        </button>

        {/* Urgencia */}
        <button
          onClick={() => handleUrgenciaChange(!urgencia)}
          className={`w-full rounded-2xl p-8 transition-all duration-300 shadow-card card-hover text-left ${
            urgencia
              ? 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-500'
              : 'bg-white border-2 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
              urgencia ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
            }`}>
              <Zap className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Servicio urgente 72h
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                {isHighSeas ? 'Temporada alta' : 'Temporada baja'}: {formatCurrency(urgenciaPrice)}
              </p>
              <p className="text-xs text-gray-500">Instalación prioritaria en máximo 72 horas</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              urgencia ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {urgencia ? <Check className="w-5 h-5" strokeWidth={3} /> : <Circle className="w-5 h-5" strokeWidth={1.5} />}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
