'use client';

import Image from 'next/image';
import type { Language, Equipment } from '@/app/types';
import { t } from '@/app/utils/translations';
import { formatCurrency } from '@/app/utils/calculations';

interface Step4Props {
  models: Equipment[];
  language: Language;
  onSelectModel: (model: Equipment) => void;
  selectedModel: Equipment | null;
}

const badgeLabels = ['La mejor opcion', 'Con mas garantia', 'Relacion calidad precio'];
const badgeColors = ['bg-amber-100 text-amber-800 border-amber-300', 'bg-green-100 text-green-800 border-green-300', 'bg-blue-100 text-blue-800 border-blue-300'];

export function Step4Models({ models, language, onSelectModel, selectedModel }: Step4Props) {
  const displayModels = models.slice(0, 3);

  if (displayModels.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-12 animate-fadeInUp">
        <p className="text-gray-500 text-lg">{t('paso4.nomodels', language)}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fadeInUp">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4">
          {t('paso4.title', language)}
        </h2>
        <p className="text-gray-600 text-lg">
          {t('paso4.subtitle', language)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayModels.map((model, index) => (
          <button
            key={model.modelo + index}
            onClick={() => onSelectModel(model)}
            className={`group relative overflow-hidden rounded-2xl transition-all duration-300 text-left h-full shadow-card card-hover ${
              selectedModel?.modelo === model.modelo
                ? 'ring-2 ring-emerald-500 ring-offset-2 shadow-elevated'
                : ''
            }`}
          >
            {/* Badge superior */}
            <div className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-full text-sm font-bold border transition-all duration-300 ${
              badgeColors[index] || badgeColors[0]
            }`}>
              {badgeLabels[index] || badgeLabels[0]}
            </div>

            {/* Fondo gradiente */}
            <div className={`absolute inset-0 transition-all duration-300 ${
              selectedModel?.modelo === model.modelo
                ? 'bg-gradient-to-br from-emerald-50 to-emerald-100'
                : 'bg-gradient-to-br from-white to-gray-50'
            }`} />

            {/* Contenedor de imagen */}
            <div className="relative w-full h-64 bg-white/80 flex items-center justify-center overflow-hidden border-b border-gray-100 group-hover:bg-gradient-to-b from-white to-gray-100 transition-all duration-300">
              {model.imagen && (
                <Image
                  src={model.imagen || 'https://via.placeholder.com/300x300?text=AC'}
                  alt={model.modelo}
                  fill
                  className="object-contain p-6 group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </div>

            {/* Contenido */}
            <div className="relative p-6 flex flex-col h-full justify-between">
              {/* Marca */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Marca</p>
                <p className="text-lg font-bold text-gray-900">{model.marca}</p>
              </div>

              {/* Modelo */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 font-medium text-ellipsis line-clamp-2">{model.modelo}</p>
              </div>

              {/* Especificaciones en grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100/50">
                <div className="bg-blue-50 rounded-lg p-3 group-hover:bg-blue-100 transition-colors">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Frigorias</p>
                  <p className="text-base font-bold text-blue-600">{model.frigoriasMin.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 group-hover:bg-purple-100 transition-colors">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Potencia</p>
                  <p className="text-base font-bold text-purple-600">{model.kW} kW</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 group-hover:bg-green-100 transition-colors">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Eficiencia</p>
                  <p className="text-base font-bold text-green-600">{model.eficiencia}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 group-hover:bg-amber-100 transition-colors">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Garantia</p>
                  <p className="text-base font-bold text-amber-600">{model.garantia}</p>
                </div>
              </div>

              {/* Descripcion */}
              <p className="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed">{model.descripcion}</p>

              {/* Precio */}
              <div className="relative">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 text-white text-center">
                  <p className="text-xs font-semibold opacity-90 mb-1">Precio del equipo</p>
                  <p className="text-2xl font-bold">{formatCurrency(model.precio)}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
