'use client';

import type { Language } from '@/app/types';
import { t } from '@/app/utils/translations';

interface ProgressBarProps {
  currentStep: number;
  language: Language;
  stepNames: string[];
}

export function ProgressBar({ currentStep, language, stepNames }: ProgressBarProps) {
  const progressPercentage = (currentStep / 6) * 100;

  return (
    <div className="mb-8">
      {/* Barra de progreso visual */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Texto de paso actual */}
      <div className="text-center text-sm text-gray-600">
        {t('app.step', language)} {currentStep} {t('app.of', language)} 6 - {stepNames[currentStep - 1]}
      </div>
    </div>
  );
}

// Componente para desktop con círculos
export function StepIndicators({ currentStep }: { currentStep: number }) {
  return (
    <div className="hidden md:flex justify-between mb-12 px-4">
      {Array.from({ length: 6 }).map((_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum <= currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {stepNum}
            </div>
            {i < 5 && (
              <div
                className={`flex-1 h-1 mt-2 ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
                style={{ minWidth: '40px' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}