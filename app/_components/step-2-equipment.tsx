'use client';

import Image from 'next/image';
import type { Language, EquipmentType } from '@/app/types';
import { t } from '@/app/utils/translations';

interface Step2Props {
  language: Language;
  onSelectEquipment: (type: EquipmentType) => void;
  selectedEquipment: EquipmentType | null;
}

const equipmentImages: Record<string, string> = {
  'split': '/servicios/split-pared.jfif',
  'conducto': '/servicios/conducto.jfif',
  'cassette': '/servicios/casete.jfif',
  'multisplit': '/servicios/multisplit.jfif',
  'suelo-techo': '/servicios/suelo-techo.jpeg',
  'multi-conducto': '/servicios/multiconducto.jfif',
  'multi-cassette': '/servicios/multicasete.jfif',
  'twin': '/servicios/twin-suelo-techo.jfif',
};

export function Step2Equipment({ language, onSelectEquipment, selectedEquipment }: Step2Props) {
  const equipmentTypes = [
    { id: 'split', titleKey: 'tipo.split', badgeKey: 'tipo.split.badge' },
    { id: 'conducto', titleKey: 'tipo.conducto', badgeKey: 'tipo.conducto.badge' },
    { id: 'cassette', titleKey: 'tipo.cassette', badgeKey: 'tipo.cassette.badge' },
    { id: 'multisplit', titleKey: 'tipo.multisplit', badgeKey: 'tipo.multisplit.badge' },
    { id: 'suelo-techo', titleKey: 'tipo.suelo-techo', badgeKey: 'tipo.suelo-techo.badge' },
    { id: 'multi-conducto', titleKey: 'tipo.multi-conducto', badgeKey: 'tipo.multi-conducto.badge' },
    { id: 'multi-cassette', titleKey: 'tipo.multi-cassette', badgeKey: 'tipo.multi-cassette.badge' },
    { id: 'twin', titleKey: 'tipo.twin', badgeKey: 'tipo.twin.badge' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto animate-fadeInUp">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
          {t('paso2.title', language)}
        </h2>
        <p className="text-gray-600 text-lg">
          {t('paso2.subtitle', language)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {equipmentTypes.map((eq) => (
          <button
            key={eq.id}
            onClick={() => onSelectEquipment(eq.id as EquipmentType)}
            className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
              selectedEquipment === eq.id
                ? 'ring-2 ring-blue-500 ring-offset-2 shadow-elevated'
                : 'card-hover shadow-card'
            }`}
          >
            {/* Fondo gradiente */}
            <div className={`absolute inset-0 ${
              selectedEquipment === eq.id
                ? 'bg-gradient-to-br from-blue-50 to-blue-100'
                : 'bg-gradient-to-br from-white to-gray-50'
            } transition-all duration-300`} />

            {/* Contenedor de imagen */}
            <div className="relative w-full h-56 bg-white/70 flex items-center justify-center overflow-hidden">
              <Image
                src={equipmentImages[eq.id] || equipmentImages['split']}
                alt={t(eq.titleKey, language)}
                fill
                className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>

            {/* Contenido de texto */}
            <div className="relative p-5 text-center">
              <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {t(eq.titleKey, language)}
              </h3>
              <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 group-hover:border-blue-300 transition-all">
                {t(eq.badgeKey, language)}
              </div>
            </div>

            {/* Efecto de brillo en hover */}
            {selectedEquipment === eq.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
