'use client';

import type { Language } from '@/app/types';
import { t } from '@/app/utils/translations';
import { calculateFrigorias } from '@/app/utils/calculations';
import { useState } from 'react';
import { Ruler, ArrowUpDown, Sun, Snowflake, Home } from 'lucide-react';

interface Step3Props {
  language: Language;
  onUpdate: (data: {
    estancia: string;
    metrosCuadrados: number;
    altura: number;
    exposicionSolar: number;
    frigoriasCalculadas: number;
  }) => void;
}

export function Step3Space({ language, onUpdate }: Step3Props) {
  const [estancia, setEstancia] = useState<'Salon' | 'Habitacion' | 'Oficina'>('Salon');
  const [metrosCuadrados, setMetrosCuadrados] = useState(20);
  const [altura, setAltura] = useState(2.5);
  const [exposicionSolar, setExposicionSolar] = useState(1.0);

  const frigoriasCalculadas = calculateFrigorias(metrosCuadrados, altura, exposicionSolar);

  const pushUpdate = (over: Partial<{ estancia: string; metrosCuadrados: number; altura: number; exposicionSolar: number }>) => {
    const est = over.estancia ?? estancia;
    const m2 = over.metrosCuadrados ?? metrosCuadrados;
    const alt = over.altura ?? altura;
    const exp = over.exposicionSolar ?? exposicionSolar;
    onUpdate({
      estancia: est,
      metrosCuadrados: m2,
      altura: alt,
      exposicionSolar: exp,
      frigoriasCalculadas: calculateFrigorias(m2, alt, exp),
    });
  };

  const handleEstanciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as 'Salon' | 'Habitacion' | 'Oficina';
    setEstancia(v);
    pushUpdate({ estancia: v });
  };

  const handleMetrosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setMetrosCuadrados(value);
    pushUpdate({ metrosCuadrados: value });
  };

  const handleAlturaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const alt = parseFloat(e.target.value);
    setAltura(alt);
    pushUpdate({ altura: alt });
  };

  const handleExposicionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const exp = parseFloat(e.target.value);
    setExposicionSolar(exp);
    pushUpdate({ exposicionSolar: exp });
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeInUp">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
          Caracter&iacute;sticas del espacio
        </h2>
        <p className="text-gray-600 text-lg">
          Calculamos las frigor&iacute;as autom&aacute;ticamente
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-8 space-y-8">
        {/* Estancia a climatizar */}
        <div className="space-y-3">
          <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" />
            Estancia a climatizar
          </label>
          <div className="relative">
            <select
              value={estancia}
              onChange={handleEstanciaChange}
              className="w-full appearance-none bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 rounded-xl px-4 py-3 pr-10 text-base font-medium transition-all"
            >
              <option value="Salon">Sal&oacute;n</option>
              <option value="Habitacion">Habitaci&oacute;n</option>
              <option value="Oficina">Oficina</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>

        {/* Metros Cuadrados */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-blue-600" />
              Metros cuadrados
            </label>
            <span className="text-2xl font-bold text-blue-600">{Math.round(metrosCuadrados)} m&sup2;</span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            value={metrosCuadrados}
            onChange={handleMetrosChange}
            className="w-full"
            style={{ '--value': `${((metrosCuadrados - 5) / (150 - 5)) * 100}%` } as React.CSSProperties}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>5 m&sup2;</span>
            <span>150 m&sup2;</span>
          </div>
        </div>

        {/* Altura */}
        <div className="space-y-3">
          <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-blue-600" />
            Altura
          </label>
          <div className="relative">
            <select
              value={altura}
              onChange={handleAlturaChange}
              className="w-full appearance-none bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 rounded-xl px-4 py-3 pr-10 text-base font-medium transition-all"
            >
              <option value="2.5">2,5 m (normal)</option>
              <option value="3">3 m</option>
              <option value="4">4 m</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>

        {/* Ubicación */}
        <div className="space-y-3">
          <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            Ubicaci&oacute;n
          </label>
          <div className="relative">
            <select
              value={exposicionSolar}
              onChange={handleExposicionChange}
              className="w-full appearance-none bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 rounded-xl px-4 py-3 pr-10 text-base font-medium transition-all"
            >
              <option value="1">Normal</option>
              <option value="1.2">Muy soleado</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 text-center border border-slate-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Snowflake className="w-5 h-5 text-blue-600" />
            <p className="text-gray-600 font-semibold">Frigor&iacute;as necesarias</p>
          </div>
          <p className="text-4xl font-black text-slate-900">
            {Math.round(frigoriasCalculadas).toLocaleString()} fg
          </p>
        </div>
      </div>
    </div>
  );
}
