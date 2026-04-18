'use client';

import type { Language } from '@/app/types';
import { t } from '@/app/utils/translations';
import { Snowflake, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white">
              <Snowflake className="w-7 h-7" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                ClimaMallorca
              </h1>
              <p className="text-xs text-gray-500">Calculadora profesional de presupuestos</p>
            </div>
          </div>
          <div className="text-right">
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
            <div className="text-xl font-bold mb-4 flex items-center gap-2">
              <Snowflake className="w-6 h-6 text-emerald-400" strokeWidth={2} />
              <span>ClimaMallorca</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Expertos en soluciones de climatización en Mallorca. Instalación, mantenimiento y reparación de aires acondicionados.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" strokeWidth={2} />
              <span>Mallorca, Islas Baleares</span>
            </p>
            <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" strokeWidth={2} />
              <span>+34 XXX XXX XXX</span>
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" strokeWidth={2} />
              <span>info@climamallorca.es</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Nuestros servicios</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={2} /><span>Instalación de aires acondicionados</span></li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={2} /><span>Sustituciones y actualizaciones</span></li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={2} /><span>Reparación y mantenimiento</span></li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={2} /><span>Proyectos personalizados</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>© 2024 Manteniments Costa Nord S.L. | Todos los derechos reservados</p>
          <p className="mt-2">Soluciones de climatización profesionales en Mallorca</p>
        </div>
      </div>
    </footer>
  );
}
