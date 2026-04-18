'use client';

import type { Language, ServiceType } from '@/app/types';
import { t } from '@/app/utils/translations';
import { useState } from 'react';

interface Step1Props {
  language: Language;
  onSelectService: (service: ServiceType) => void;
  selectedService: ServiceType | null;
}

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
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        {t('paso1.title', language)}
      </h2>
      <p className="text-gray-600 text-center mb-12">
        {t('paso1.subtitle', language)}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelectService(service.id as ServiceType)}
            className={`p-6 rounded-lg border-2 transition-all ${
              selectedService === service.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t(service.titleKey, language)}
              </h3>
              <p className="text-gray-600 text-sm">
                {t(service.descKey, language)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}