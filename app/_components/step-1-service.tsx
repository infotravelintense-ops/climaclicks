'use client';

import type { Language, ServiceType } from '@/app/types';
import { t } from '@/app/utils/translations';

interface Step1Props {
  language: Language;
  onSelectService: (service: ServiceType) => void;
  selectedService: ServiceType | null;
}

const serviceIcons: Record<string, string> = {
  'sustitución': '🔄',
  'instalacion': '⚙️',
  'averia': '🔧',
  'proyecto': '📋',
};

export function Step1Service({ language, onSelectService, selectedService }: Step1Props) {
  const services = [
    {
      id: 'sustitución',
      titleKey: 'paso1.sustitucion',
      descKey: 'paso1.sustitucion.desc',
    },
    {
      id: 'instalacion',
      titleKey: 'paso1.instalacion',
      descKey: 'paso1.instalacion.desc',
    },
    {
      id: 'averia',
      titleKey: 'paso1.averia',
      descKey: 'paso1.averia.desc',
    },
    {
      id: 'proyecto',
      titleKey: 'paso1.proyecto',
      descKey: 'paso1.proyecto.desc',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeInUp">
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          {t('paso1.title', language)}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t('paso1.subtitle', language)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {services.map((service, idx) => (
          <button
            key={service.id}
            onClick={() => onSelectService(service.id as ServiceType)}
            className={`group relative overflow-hidden rounded-2xl transition-all duration-300 border-2 ${
              selectedService === service.id
                ? 'border-transparent shadow-elevated ring-2 ring-blue-400 ring-offset-2'
                : 'border-gray-200 card-hover shadow-card'
            }`}
            style={{
              animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
            }}
          >
            {/* Fondo gradiente */}
            <div className={`absolute inset-0 ${ 
              selectedService === service.id
                ? 'bg-gradient-to-br from-blue-50 to-blue-100'
                : 'bg-gradient-to-br from-white to-gray-50 group-hover:from-blue-50'
            } transition-all duration-300`} />

            {/* Contenido */}
            <div className="relative p-8 text-left h-full flex flex-col">
              {/* Icono */}
              <div className="mb-6 text-6xl transform group-hover:scale-110 transition-transform duration-300">
                {serviceIcons[service.id]}
              </div>

              {/* Título */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {t(service.titleKey, language)}
              </h3>

              {/* Descripción */}
              <p className="text-gray-600 text-base leading-relaxed flex-grow">
                {t(service.descKey, language)}
              </p>

              {/* Indicador de selección */}
              {selectedService === service.id && (
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm">
                  <span>✓</span>
                  Seleccionado
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
