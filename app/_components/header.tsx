'use client';

import type { Language } from '@/app/types';
import { t } from '@/app/utils/translations';
import Image from 'next/image';

interface HeaderProps {
  language: Language;
  currentStep: number;
  stepNames: string[];
}

export function Header({ language, currentStep, stepNames }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">❄️</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ClimaMallorca</h1>
            <p className="text-sm text-gray-600">{t('app.title', language)}</p>
          </div>
        </div>
        <div className="hidden md:text-right">
          <p className="text-sm text-gray-600">
            {t('app.step', language)} {currentStep} {t('app.of', language)} 6
          </p>
          <p className="font-semibold text-gray-900">{stepNames[currentStep - 1]}</p>
        </div>
      </div>
    </header>
  );
}

export function Footer({ language }: { language: Language }) {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Manteniments Costa Nord S.L.</h3>
          <p className="text-gray-400 text-sm">
            Empresa instaladora autorizada para la ejecución del servicio contratado.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-700">
          <div>
            <p className="font-semibold text-white mb-2">Contacto</p>
            <p>📞 657 12 94 74</p>
            <p>✉ contabilidad@grupocostanord.com</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Ubicación</p>
            <p>Av. Golf, 23 - 07458</p>
            <p>Can Picafort, Mallorca</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Servicios</p>
            <p>Instalación profesional</p>
            <p>Servicio 24/7</p>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500">
          <p>&copy; 2026 Manteniments Costa Nord. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}