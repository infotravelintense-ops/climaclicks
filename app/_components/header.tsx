'use client';

import type { Language } from '@/app/types';
import { t } from '@/app/utils/translations';

interface HeaderProps {
  language: Language;
  currentStep: number;
  stepNames: string[];
}

const stepColors: Record<number, string> = {
  1: 'from-blue-600 to-blue-800',
  2: 'from-indigo-600 to-indigo-800',
  3: 'from-purple-600 to-purple-800',
  4: 'from-emerald-600 to-emerald-800',
  5: 'from-amber-600 to-amber-800',
  6: 'from-green-600 to-green-800',
};

export function Header({ language, currentStep, stepNames }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">❄️</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                ClimaMallorca
              </h1>
              <p className="text-xs text-gray-500">Calculadora profesional de presupuestos</p>
            </div>
          </div>
          <div className={`text-right`}>
            <p className={`text-2xl font-bold bg-gradient-to-r ${stepColors[currentStep] || stepColors[1]} bg-clip-text text-transparent`}>
              {stepNames[currentStep - 1]}
            </p>
            <p className="text-sm text-gray-500">Paso {currentStep} de 6</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${stepColors[currentStep] || stepColors[1]} transition-all duration-500 rounded-full`}
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>
    </header>
  );
}

export function Footer({ language }: { language: Language }) {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">❄️</span> ClimaMallorca
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Expertos en soluciones de climatizacion en Mallorca desde 2010. Instalacion, mantenimiento y reparacion de aires acondicionados.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <p className="text-gray-400 text-sm mb-2">📍 Mallorca, Islas Baleares</p>
            <p className="text-gray-400 text-sm mb-2">📞 +34 XXX XXX XXX</p>
            <p className="text-gray-400 text-sm">✉️ info@climamallorca.es</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Nuestros servicios</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>✓ Instalacion de aires acondicionados</li>
              <li>✓ Sustituciones y actualizaciones</li>
              <li>✓ Reparacion y mantenimiento</li>
              <li>✓ Proyectos personalizados</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>© 2024 Manteniments Costa Nord S.L. | Todos los derechos reservados</p>
          <p className="mt-2">Soluciones de climatizacion profesionales en Mallorca</p>
        </div>
      </div>
    </footer>
  );
}
