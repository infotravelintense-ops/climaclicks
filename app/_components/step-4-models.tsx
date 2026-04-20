'use client';

import Image from 'next/image';
import { Snowflake, Zap, ShieldCheck, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import type { Language, Equipment } from '@/app/types';

interface Step4Props {
  models: Equipment[];
  language: Language;
  onSelectModel: (model: Equipment) => void;
  selectedModel: Equipment | null;
  frigoriasCalculadas?: number;
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

export function Step4Models({ models, language, onSelectModel, selectedModel, frigoriasCalculadas = 0 }: Step4Props) {
  const [showAsesoramiento, setShowAsesoramiento] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    descripcion: '',
  });

  // Detectar si frigorías exceden máximo permitido (6000 + 20% = 7200)
  const MAX_FRIGORIAS = 6000;
  const MAX_WITH_PLUS = MAX_FRIGORIAS * 1.2; // 7200
  const exceedsFrigorias = frigoriasCalculadas > MAX_WITH_PLUS;

  // Ordenar siempre: Sakura -> Aroma 3 -> Aroma Plus (de más barato a más caro, igual al spec)
  const sorted = [...models]
    .map((m) => ({ model: m, info: getGiatsuLineInfo(m.modelo) }))
    .filter((x) => x.info !== null)
    .sort((a, b) => (a.info!.orderIndex - b.info!.orderIndex))
    .map((x) => x.model);

  const displayModels = sorted.slice(0, 3);

  const handleAsesoramientoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoServicio: 'asesoramiento_tecnico',
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          descripcion: `Solicitud de asesoramiento técnico para instalación. Frigorías requeridas: ${frigoriasCalculadas}. ${formData.descripcion}`,
        }),
      });
      if (response.ok) {
        alert('Solicitud enviada. Gabriel Guardiola se pondrá en contacto contigo pronto.');
        setShowAsesoramiento(false);
        setFormData({ nombre: '', email: '', telefono: '', descripcion: '' });
      }
    } catch (error) {
      console.error('Error submitting asesoramiento:', error);
      alert('Error al enviar la solicitud');
    }
  };

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

      {/* Aviso si frigorías exceden el máximo */}
      {exceedsFrigorias && (
        <div className="mt-8 bg-amber-50 border-2 border-amber-300 rounded-2xl p-6">
          <div className="flex gap-4 items-start">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                Instalación que requiere asesoramiento experto
              </h3>
              <p className="text-amber-800 mb-4">
                Las frigorías requeridas ({frigoriasCalculadas.toLocaleString()}) exceden el rango estándar de nuestros modelos recomendados. 
                Para esta instalación es necesario el asesoramiento experto de <strong>Gabriel Guardiola</strong>, nuestro técnico especializado.
              </p>
              <p className="text-sm text-amber-700 mb-4">
                Nos especializamos en instalaciones con conductos de 12.000 BTU, multi-split y multi-conducto con más del 20% adicional de capacidad.
              </p>
              <button
                onClick={() => setShowAsesoramiento(true)}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Solicitar asesoramiento técnico
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Asesoramiento */}
      {showAsesoramiento && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-screen overflow-y-auto animate-fadeInUp">
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Asesoramiento Técnico
              </h2>
              <button
                onClick={() => setShowAsesoramiento(false)}
                className="text-white hover:text-amber-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAsesoramientoSubmit} className="p-6 space-y-5">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Frigorías requeridas: <strong>{frigoriasCalculadas.toLocaleString()}</strong> (máximo estándar: {MAX_WITH_PLUS.toLocaleString()})
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  Gabriel Guardiola evaluará tu proyecto y te ofrecerá la mejor solución.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Tu teléfono"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Detalles adicionales
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Cuéntanos más sobre tu proyecto..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAsesoramiento(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg font-semibold text-white hover:shadow-lg transition-all"
                >
                  Enviar solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
