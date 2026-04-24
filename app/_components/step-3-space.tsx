'use client';

import type { Language, EquipmentType } from '@/app/types';
import { t } from '@/app/utils/translations';
import { calculateFrigorias } from '@/app/utils/calculations';
import { useState, useEffect } from 'react';
import { Ruler, ArrowUpDown, Sun, Snowflake, Home, Plus, Minus } from 'lucide-react';

interface RoomData {
  estancia: 'Salon' | 'Habitacion' | 'Oficina';
  metrosCuadrados: number;
  altura: number;
  exposicionSolar: number;
}

interface Step3Props {
  language: Language;
  equipmentType?: EquipmentType | null;
  onUpdate: (data: {
    estancia: string;
    metrosCuadrados: number;
    altura: number;
    exposicionSolar: number;
    frigoriasCalculadas: number;
    totalInteriorFrigorias?: number;
    unidadesInteriores?: number;
  }) => void;
}

const isMultiType = (type?: EquipmentType | null) =>
  type === 'multisplit' || type === 'twin' || type === 'multi-conducto' || type === 'multi-cassette';

const defaultRoom = (): RoomData => ({
  estancia: 'Salon',
  metrosCuadrados: 20,
  altura: 2.5,
  exposicionSolar: 1.0,
});

export function Step3Space({ language, equipmentType, onUpdate }: Step3Props) {
  const multi = isMultiType(equipmentType);
  const isTwin = equipmentType === 'twin'; // twin siempre 2 unidades

  // Single room state (non-multi)
  const [estancia, setEstancia] = useState<'Salon' | 'Habitacion' | 'Oficina'>('Salon');
  const [metrosCuadrados, setMetrosCuadrados] = useState(20);
  const [altura, setAltura] = useState(2.5);
  const [exposicionSolar, setExposicionSolar] = useState(1.0);

  // Multi room state
  const [rooms, setRooms] = useState<RoomData[]>([defaultRoom(), defaultRoom()]);

  const singleFrigorias = calculateFrigorias(metrosCuadrados, altura, exposicionSolar);
  const multiFrigorias = rooms.reduce((sum, r) => sum + calculateFrigorias(r.metrosCuadrados, r.altura, r.exposicionSolar), 0);

  const pushSingleUpdate = (over: Partial<{ estancia: string; metrosCuadrados: number; altura: number; exposicionSolar: number }>) => {
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

  const pushMultiUpdate = (updatedRooms: RoomData[]) => {
    const totalFrig = updatedRooms.reduce((sum, r) => sum + calculateFrigorias(r.metrosCuadrados, r.altura, r.exposicionSolar), 0);
    const avgM2 = updatedRooms.reduce((sum, r) => sum + r.metrosCuadrados, 0);
    onUpdate({
      estancia: updatedRooms.map(r => r.estancia).join(' + '),
      metrosCuadrados: avgM2,
      altura: updatedRooms[0]?.altura || 2.5,
      exposicionSolar: updatedRooms[0]?.exposicionSolar || 1.0,
      frigoriasCalculadas: totalFrig,
      totalInteriorFrigorias: totalFrig,
      unidadesInteriores: updatedRooms.length,
    });
  };

  // Initial update
  useEffect(() => {
    if (multi) {
      pushMultiUpdate(rooms);
    } else {
      pushSingleUpdate({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRoom = (index: number, field: keyof RoomData, value: string | number) => {
    const updated = rooms.map((r, i) => i === index ? { ...r, [field]: value } : r);
    setRooms(updated);
    pushMultiUpdate(updated);
  };

  const addRoom = () => {
    if (rooms.length < 5) {
      const updated = [...rooms, defaultRoom()];
      setRooms(updated);
      pushMultiUpdate(updated);
    }
  };

  const removeRoom = () => {
    if (rooms.length > 2) {
      const updated = rooms.slice(0, -1);
      setRooms(updated);
      pushMultiUpdate(updated);
    }
  };

  const multiLabel = isTwin ? 'Twin (2 unidades)' :
    equipmentType === 'multi-conducto' ? 'Multiconducto' :
    equipmentType === 'multi-cassette' ? 'Multicassette' :
    'Multisplit';

  // ─── RENDER MULTI ROOM ────────────────────────────────
  if (multi) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fadeInUp">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Características del espacio
          </h2>
          <p className="text-gray-600 text-lg">
            {multiLabel} — Configura cada estancia
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8 space-y-6">
          {/* Selector de número de unidades */}
          {!isTwin && (
            <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4">
              <span className="text-lg font-bold text-gray-900">Número de unidades interiores</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={removeRoom}
                  disabled={rooms.length <= 2}
                  className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center disabled:opacity-30 hover:border-red-400 hover:text-red-500"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-black text-blue-700 min-w-[50px] text-center">
                  {rooms.length}x1
                </span>
                <button
                  onClick={addRoom}
                  disabled={rooms.length >= 5}
                  className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center disabled:opacity-30 hover:border-green-400 hover:text-green-500"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Rooms */}
          {rooms.map((room, idx) => (
            <div key={idx} className="border-2 border-gray-100 rounded-xl p-6 space-y-5 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                Estancia {idx + 1}
              </h3>

              {/* Estancia tipo */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Home className="w-4 h-4 text-blue-600" /> Tipo
                </label>
                <select
                  value={room.estancia}
                  onChange={(e) => updateRoom(idx, 'estancia', e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-base font-medium"
                >
                  <option value="Salon">Salón</option>
                  <option value="Habitacion">Habitación</option>
                  <option value="Oficina">Oficina</option>
                </select>
              </div>

              {/* Metros */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-600" /> Metros cuadrados
                  </label>
                  <span className="text-xl font-bold text-blue-600">{Math.round(room.metrosCuadrados)} m²</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  value={room.metrosCuadrados}
                  onChange={(e) => updateRoom(idx, 'metrosCuadrados', parseFloat(e.target.value))}
                  className="w-full"
                  style={{ '--value': `${((room.metrosCuadrados - 5) / (150 - 5)) * 100}%` } as React.CSSProperties}
                />
              </div>

              {/* Altura */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-blue-600" /> Altura
                </label>
                <select
                  value={room.altura}
                  onChange={(e) => updateRoom(idx, 'altura', parseFloat(e.target.value))}
                  className="w-full appearance-none bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-base font-medium"
                >
                  <option value="2.5">2,5 m (normal)</option>
                  <option value="3">3 m</option>
                  <option value="4">4 m</option>
                </select>
              </div>

              {/* Ubicación */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" /> Ubicación
                </label>
                <select
                  value={room.exposicionSolar}
                  onChange={(e) => updateRoom(idx, 'exposicionSolar', parseFloat(e.target.value))}
                  className="w-full appearance-none bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-base font-medium"
                >
                  <option value="1">Normal</option>
                  <option value="1.2">Muy soleado</option>
                </select>
              </div>

              {/* Frigorías de esta estancia */}
              <div className="text-right text-sm text-gray-500">
                {Math.round(calculateFrigorias(room.metrosCuadrados, room.altura, room.exposicionSolar)).toLocaleString()} fg
              </div>
            </div>
          ))}

          {/* Total frigorías */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 text-center border border-slate-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Snowflake className="w-5 h-5 text-blue-600" />
              <p className="text-gray-600 font-semibold">Frigorías necesarias (total)</p>
            </div>
            <p className="text-4xl font-black text-slate-900">
              {Math.round(multiFrigorias).toLocaleString()} fg
            </p>
            <p className="text-sm text-gray-500 mt-1">{rooms.length} unidades interiores</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER SINGLE ROOM (default) ─────────────────────
  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeInUp">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
          Características del espacio
        </h2>
        <p className="text-gray-600 text-lg">
          Calculamos las frigorías automáticamente
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
              onChange={(e) => {
                const v = e.target.value as 'Salon' | 'Habitacion' | 'Oficina';
                setEstancia(v);
                pushSingleUpdate({ estancia: v });
              }}
              className="w-full appearance-none bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 rounded-xl px-4 py-3 pr-10 text-base font-medium"
            >
              <option value="Salon">Salón</option>
              <option value="Habitacion">Habitación</option>
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
            <span className="text-2xl font-bold text-blue-600">{Math.round(metrosCuadrados)} m²</span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            value={metrosCuadrados}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setMetrosCuadrados(value);
              pushSingleUpdate({ metrosCuadrados: value });
            }}
            className="w-full"
            style={{ '--value': `${((metrosCuadrados - 5) / (150 - 5)) * 100}%` } as React.CSSProperties}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>5 m²</span>
            <span>150 m²</span>
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
              onChange={(e) => {
                const alt = parseFloat(e.target.value);
                setAltura(alt);
                pushSingleUpdate({ altura: alt });
              }}
              className="w-full appearance-none bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 rounded-xl px-4 py-3 pr-10 text-base font-medium"
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
            Ubicación
          </label>
          <div className="relative">
            <select
              value={exposicionSolar}
              onChange={(e) => {
                const exp = parseFloat(e.target.value);
                setExposicionSolar(exp);
                pushSingleUpdate({ exposicionSolar: exp });
              }}
              className="w-full appearance-none bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 rounded-xl px-4 py-3 pr-10 text-base font-medium"
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
            <p className="text-gray-600 font-semibold">Frigorías necesarias</p>
          </div>
          <p className="text-4xl font-black text-slate-900">
            {Math.round(singleFrigorias).toLocaleString()} fg
          </p>
        </div>
      </div>
    </div>
  );
}
