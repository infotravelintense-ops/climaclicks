'use client';

import type { Language, EquipmentType } from '@/app/types';
import {
  formatCurrency,
  isHighSeason,
  getUrgenciaPrice,
  calculateMetrosAdicionalesPrice,
  ANDAMIO_PRICE,
} from '@/app/utils/calculations';
import { useState } from 'react';
import { Ruler, Construction, Zap, Check, Circle, Info, Pickaxe } from 'lucide-react';

interface Step5Props {
  language: Language;
  tipoEquipo: EquipmentType | null;
  onUpdate: (data: {
    andamio: boolean;
    urgencia: boolean;
    metrosAdicionalesCount: number;
    conductoUnidadesInteriores?: number;
  }) => void;
}

export function Step5Extras({ language, tipoEquipo, onUpdate }: Step5Props) {
  const [andamio, setAndamio] = useState(false);
  const [urgencia, setUrgencia] = useState(false);
  const [metrosAdicionalesCount, setMetrosAdicionalesCount] = useState(0);
  const [conductoUnidadesInteriores, setConducutoUnidadesInteriores] = useState(0);

  const isHighSeas = isHighSeason(new Date());
  const urgenciaPrice = getUrgenciaPrice(isHighSeas);
  const metrosPrice = calculateMetrosAdicionalesPrice(metrosAdicionalesCount);

  // Precios para conductos: 1x1=600€, 2x1=1000€, 3x1=1400€, 4x1=1800€
  const conductoPrecios: Record<number, number> = {
    0: 0,
    1: 600,
    2: 1000,
    3: 1400,
    4: 1800,
  };
  const conductoPrice = conductoPrecios[conductoUnidadesInteriores] || 0;
  const isConducto = tipoEquipo === 'conducto';

  const handleAndamioChange = (value: boolean) => {
    setAndamio(value);
    onUpdate({ 
      andamio: value, 
      urgencia, 
      metrosAdicionalesCount,
      conductoUnidadesInteriores: isConducto ? conductoUnidadesInteriores : undefined,
    });
  };

  const handleUrgenciaChange = (value: boolean) => {
    setUrgencia(value);
    onUpdate({ 
      andamio, 
      urgencia: value, 
      metrosAdicionalesCount,
      conductoUnidadesInteriores: isConducto ? conductoUnidadesInteriores : undefined,
    });
  };

  const handleMetrosChange = (value: number) => {
    setMetrosAdicionalesCount(value);
    onUpdate({ 
      andamio, 
      urgencia, 
      metrosAdicionalesCount: value,
      conductoUnidadesInteriores: isConducto ? conductoUnidadesInteriores : undefined,
    });
  };

  const handleConducutoChange = (value: number) => {
    setConducutoUnidadesInteriores(value);
    onUpdate({ 
      andamio, 
      urgencia, 
      metrosAdicionalesCount,
      conductoUnidadesInteriores: value,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeInUp">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
          Extras de instalaci&oacute;n
        </h2>
        <p className="text-gray-600 text-lg">
          Selecciona los extras que necesitas
        </p>
      </div>

      <div className="space-y-5">
        {/* Metros Adicionales */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Ruler className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                Metros adicionales
              </h3>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            value={metrosAdicionalesCount}
            onChange={(e) => handleMetrosChange(parseInt(e.target.value))}
            className="w-full mb-4"
            style={{ '--value': `${(metrosAdicionalesCount / 15) * 100}%` } as React.CSSProperties}
          />
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{metrosAdicionalesCount} m</p>
            <p className="text-xs text-gray-500 mt-1">Hasta 15 metros adicionales</p>
          </div>
          {metrosAdicionalesCount > 0 && (
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
              <span className="text-gray-600 font-medium">Precio adicional:</span>
              <span className="text-xl font-bold text-blue-600">{formatCurrency(metrosPrice)}</span>
            </div>
          )}
        </div>

        {/* Andamio */}
        <button
          onClick={() => handleAndamioChange(!andamio)}
          className={`w-full rounded-2xl p-6 transition-all duration-300 shadow-card card-hover text-left ${
            andamio
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500'
              : 'bg-white border-2 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              andamio ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
            }`}>
              <Construction className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Andamio</h3>
              {andamio && (
                <p className="text-sm text-green-700 mt-1 font-semibold">+{formatCurrency(ANDAMIO_PRICE)}</p>
              )}
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              andamio ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {andamio ? <Check className="w-4 h-4" strokeWidth={3} /> : <Circle className="w-4 h-4" strokeWidth={1.5} />}
            </div>
          </div>
        </button>

        {/* Conductos - Albañilería, pladur y pintura (solo para conductos) */}
        {isConducto && (
          <div className="bg-white rounded-2xl shadow-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                <Pickaxe className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Albañilería, pladur y pintura
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Picado de techo, tapado de calas con compuertas y pintado
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[0, 1, 2, 3, 4].map((units) => (
                <button
                  key={units}
                  onClick={() => handleConducutoChange(units)}
                  className={`py-3 px-4 rounded-xl font-bold transition-all ${
                    conductoUnidadesInteriores === units
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {units === 0 ? 'Sin' : `${units}x1`}
                </button>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Unidades interiores</p>
              <p className="text-3xl font-bold text-purple-600">
                {conductoPrice === 0 ? 'Selecciona opción' : formatCurrency(conductoPrice)}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
              <p>• 1x1: 600€ | 2x1: 1.000€ | 3x1: 1.400€ | 4x1: 1.800€</p>
            </div>
          </div>
        )}

        {/* Instalación urgente */}
        <button
          onClick={() => handleUrgenciaChange(!urgencia)}
          className={`w-full rounded-2xl p-6 transition-all duration-300 shadow-card card-hover text-left ${
            urgencia
              ? 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-500'
              : 'bg-white border-2 border-gray-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              urgencia ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
            }`}>
              <Zap className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Instalaci&oacute;n urgente
              </h3>
              <p className="text-sm text-gray-700 font-semibold">
                Menos de 72 horas desde la recepci&oacute;n de la m&aacute;quina
              </p>
              <p className="text-xs text-red-600 font-bold mt-1">
                Con recargo
              </p>
              {urgencia && (
                <p className="text-sm text-red-700 mt-2 font-semibold">+{formatCurrency(urgenciaPrice)} ({isHighSeas ? 'temporada alta' : 'temporada baja'})</p>
              )}
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              urgencia ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {urgencia ? <Check className="w-4 h-4" strokeWidth={3} /> : <Circle className="w-4 h-4" strokeWidth={1.5} />}
            </div>
          </div>
        </button>

        {/* Aviso urgencia */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-cyan-700 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-cyan-800">
            La instalaci&oacute;n urgente aplica recargo en las fechas disponibles para este servicio.
          </p>
        </div>
      </div>
    </div>
  );
}
