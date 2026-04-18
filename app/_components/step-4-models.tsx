'use client';

import Image from 'next/image';
import { Snowflake, Zap, ShieldCheck } from 'lucide-react';
import type { Language, Equipment } from '@/app/types';

interface Step4Props {
  models: Equipment[];
  language: Language;
  onSelectModel: (model: Equipment) => void;
  selectedModel: Equipment | null;
}

function getGiatsuLineInfo(modelo: string): { displayName: string; orderIndex: number } | null {
  const m = modelo.toUpperCase();
  if (m.includes('SAKU')) return { displayName: 'Sakura', orderIndex: 0 };
  if (m.includes('ARPLUS')) return { displayName: 'Aroma Plus', orderIndex: 2 };
  if (m.includes('AR3')) return { displayName: 'Aroma 3', orderIndex: 1 };
  return null;
}

// Orden exacto según el spec: Sakura, Aroma 3, Aroma Plus
const BADGE_LABELS = [
  'Relación calidad precio',
  'Con más garantía',
  'La mejor opción',
];
const BADGE_STYLES = [
  'bg-emerald-100 text-emerald-800 border border-emerald-300',
  'bg-orange-100 text-orange-800 border border-orange-300',
  'bg-purple-100 text-purple-800 border border-purple-300',
];
const CARD_TINT = [
  'from-emerald-50/40 to-white',
  'from-orange-50/40 to-white',
  'from-purple-50/40 to-white',
];

export function Step4Models({ models, language, onSelectModel, selectedModel }: Step4Props) {
  // Ordenar siempre: Sakura -> Aroma 3 -> Aroma Plus (de más barato a más caro, igual al spec)
  const sorted = [...models]
    .map((m) => ({ model: m, info: getGiatsuLineInfo(m.modelo) }))
    .filter((x) => x.info !== null)
    .sort((a, b) => (a.info!.orderIndex - b.info!.orderIndex))
    .map((x) => x.model);

  const displayModels = sorted.slice(0, 3);

  if (displayModels.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-12 animate-fadeInUp">
        <p className="text-gray-500 text-lg">No encontramos modelos para tu espacio. Ajusta las características del paso anterior.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fadeInUp">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-3">
          Modelos recomendados
        </h2>
        <p className="text-gray-600 text-lg">
          Te mostramos las opciones que mejor encajan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayModels.map((model, index) => {
          const info = getGiatsuLineInfo(model.modelo);
          const displayName = info ? info.displayName : model.marca;
          const isSelected = selectedModel?.modelo === model.modelo;
          return (
            <button
              key={model.modelo}
              onClick={() => onSelectModel(model)}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${CARD_TINT[index] || CARD_TINT[0]} transition-all duration-300 text-left h-full shadow-card card-hover ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 shadow-elevated' : ''}`}
            >
              {/* Badge */}
              <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full text-xs font-bold ${BADGE_STYLES[index] || BADGE_STYLES[0]}`}>
                {BADGE_LABELS[index] || BADGE_LABELS[0]}
              </div>

              <div className="pt-14 pb-6 px-6 flex flex-col h-full">
                {/* Imagen del equipo */}
                {model.imagen && (
                  <div className="relative w-full h-40 mb-4 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                      src={model.imagen}
                      alt={model.modelo}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}

                {/* Nombre y referencia */}
                <div className="text-center mb-4">
                  <p className="text-3xl font-black text-slate-900">{displayName}</p>
                  <p className="text-xs text-gray-500 mt-1">{model.modelo}</p>
                </div>

                {/* Garantía + Eficiencia */}
                <div className="text-center text-sm text-gray-700 space-y-1 mb-4">
                  <p>
                    <span className="font-semibold">Garantía:</span> {model.garantia}
                  </p>
                  <p>
                    <span className="font-semibold">Eficiencia:</span> {model.eficiencia}
                  </p>
                </div>

                {/* Especificaciones adicionales */}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <div className="bg-white/70 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <Snowflake className="w-3.5 h-3.5 text-blue-600" />
                      <p className="text-xs text-gray-500">Frigorías</p>
                    </div>
                    <p className="text-sm font-bold text-blue-700">{model.frigoriasMin.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <Zap className="w-3.5 h-3.5 text-purple-600" />
                      <p className="text-xs text-gray-500">Potencia</p>
                    </div>
                    <p className="text-sm font-bold text-purple-700">{model.kW} kW</p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
