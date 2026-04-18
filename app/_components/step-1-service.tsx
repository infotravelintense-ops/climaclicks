'use client';

import Image from 'next/image';
import type { Language, ServiceType } from '@/app/types';
import { t } from '@/app/utils/translations';
import { Check } from 'lucide-react';

interface Step1Props {
  language: Language;
  onSelectService: (service: ServiceType) => void;
  selectedService: ServiceType | null;
}

const serviceImages: Record<string, string> = {
  'sustitución': '/servicios/sustitucion.png',
  'instalacion': '/servicios/instalacion.png',
  'averia': '/servicios/reparacion.png',
  'proyecto': '/servicios/proyecto.png',
};

const serviceAlt: Record<string, string> = {
  'sustitución': 'Técnico sustituyendo un aire acondicionado antiguo por uno nuevo',
  'instalacion': 'Dos técnicos instalando un aire acondicionado split en el salón',
  'averia': 'Técnico reparando un aire acondicionado averiado',
  'proyecto': 'Ingeniero revisando planos de un proyecto de climatización',
};

export function Step1Service({ language, onSelectService, selectedService }: Step1Props) {
  const services = [
    { id: 'sustitución', titleKey: 'paso1.sustitucion', descKey: 'paso1.sustitucion.desc' },
    { id: 'instalacion', titleKey: 'paso1.instalacion', descKey: 'paso1.instalacion.desc' },
    { id: 'averia', titleKey: 'paso1.averia', descKey: 'paso1.averia.desc' },
    { id: 'proyecto', titleKey: 'paso1.proyecto', descKey: 'paso1.proyecto.desc' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeInUp">
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          {t('paso1.title', language)}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t('paso1.subtitle', language)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {services.map((service, idx) => {
          const isSelected = selectedService === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelectService(service.id as ServiceType)}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-300 border-2 bg-white text-left ${
                isSelected
                  ? 'border-blue-500 shadow-elevated ring-2 ring-blue-400 ring-offset-2'
                  : 'border-gray-200 card-hover shadow-card hover:border-blue-300'
              }`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
              }}
            >
              {/* Imagen principal */}
              <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                <Image
                  src={serviceImages[service.id]}
                  alt={serviceAlt[service.id]}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={idx < 2}
                />
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Badge seleccionado */}
                {isSelected && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold text-xs shadow-lg">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    Seleccionado
                  </div>
                )}
              </div>

              {/* Contenido textual */}
              <div className="p-6 md:p-7">
                <h3 className={`text-xl md:text-2xl font-bold mb-2 transition-colors ${
                  isSelected ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-600'
                }`}>
                  {t(service.titleKey, language)}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {t(service.descKey, language)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
