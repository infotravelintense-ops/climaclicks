'use client';

import type { Language, EquipmentType } from '@/app/types';
import { t } from '@/app/utils/translations';

interface Step2Props {
  language: Language;
  onSelectEquipment: (type: EquipmentType) => void;
  selectedEquipment: EquipmentType | null;
}

export function Step2Equipment({ language, onSelectEquipment, selectedEquipment }: Step2Props) {
  const equipmentTypes = [
    { id: 'split', titleKey: 'tipo.split', badgeKey: 'tipo.split.badge' },
    { id: 'multisplit', titleKey: 'tipo.multisplit', badgeKey: 'tipo.multisplit.badge' },
    { id: 'conducto', titleKey: 'tipo.conducto', badgeKey: 'tipo.conducto.badge' },
    { id: 'casete', titleKey: 'tipo.casete', badgeKey: 'tipo.casete.badge' },
    { id: 'suelo-techo', titleKey: 'tipo.suelo-techo', badgeKey: 'tipo.suelo-techo.badge' },
    { id: 'twin', titleKey: 'tipo.twin', badgeKey: 'tipo.twin.badge' },
    { id: 'multi-conducto', titleKey: 'tipo.multi-conducto', badgeKey: 'tipo.multi-conducto.badge' },
    { id: 'multi-casete', titleKey: 'tipo.multi-casete', badgeKey: 'tipo.multi-casete.badge' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        {t('paso2.title', language)}
      </h2>
      <p className="text-gray-600 text-center mb-12">
        {t('paso2.subtitle', language)}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {equipmentTypes.map((eq) => (
          <button
            key={eq.id}
            onClick={() => onSelectEquipment(eq.id as EquipmentType)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedEquipment === eq.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                {t(eq.titleKey, language)}
              </h3>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {t(eq.badgeKey, language)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}