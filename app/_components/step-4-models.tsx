'use client';

import type { Language, Equipment } from '@/app/types';
import { t } from '@/app/utils/translations';
import { formatCurrency } from '@/app/utils/calculations';

interface Step4Props {
  language: Language;
  models: Equipment[];
  onSelectModel: (model: Equipment) => void;
  selectedModel: Equipment | null;
}

export function Step4Models({ language, models, onSelectModel, selectedModel }: Step4Props) {
  // Limitar a 3 modelos y asignar badges
  const displayModels = models.slice(0, 3).map((model, index) => {
    let badge = null;
    if (index === 0) badge = 'paso4.badge.mejor';
    else if (index === 1) badge = 'paso4.badge.garantia';
    else if (index === 2) badge = 'paso4.badge.precio';
    return { ...model, badge };
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        {t('paso4.title', language)}
      </h2>
      <p className="text-gray-600 text-center mb-12">
        {t('paso4.subtitle', language)}
      </p>

      {models.length === 0 ? (
        <div className="text-center py-12 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <p className="text-gray-600">
            {language === 'es'
              ? 'No hay modelos disponibles para las especificaciones seleccionadas. Por favor, ajusta los parámetros.'
              : 'No models available for the selected specifications.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayModels.map((model) => (
            <button
              key={model.modelo}
              onClick={() => onSelectModel(model)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                selectedModel?.modelo === model.modelo
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {model.badge && (
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full mb-3">
                  {t(model.badge, language)}
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{model.marca}</h3>
              <p className="text-sm text-gray-600 mb-1">Modelo: {model.modelo}</p>
              <p className="text-sm text-gray-600 mb-1">
                {model.frigoriasMin.toLocaleString()} fg - {model.kW} kW
              </p>
              <p className="text-sm text-gray-600 mb-2">Eficiencia: {model.eficiencia}</p>
              <p className="text-sm text-gray-600 mb-4">Garantía: {model.garantia}</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(model.precio)}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}