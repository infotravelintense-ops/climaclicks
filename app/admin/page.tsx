'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/app/_components/logo';
import {
  LayoutDashboard,
  Package,
  Settings,
  FileText,
  Users,
  LogOut,
  Save,
  Search,
  Lock,
  TrendingUp,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Home as HomeIcon,
} from 'lucide-react';
import Link from 'next/link';

type Tab = 'dashboard' | 'modelos' | 'config' | 'quotes' | 'contacts';

interface Equipment {
  tipo: string;
  modelo: string;
  marca: string;
  frigoriasMin: number;
  frigoriasMax: number;
  kW: number;
  precio: number;
  garantia: string;
  eficiencia: string;
  descripcion: string;
  imagen: string;
  imagenMarca: string;
}

interface SeasonConfig {
  id: string;
  temporadaAltaInicio: string;
  temporadaAltaFin: string;
  precioUrgenciaAlta: number;
  precioUrgenciaBaja: number;
  precioAveriaAlta: number;
  precioAveriaBaja: number;
}

interface Quote {
  id: string;
  timestamp: string;
  tipoServicio: string | null;
  tipoEquipo: string | null;
  marcaSeleccionada: string | null;
  modeloSeleccionado: string | null;
  totalFinal: number | null;
  nombreCliente: string | null;
  emailCliente: string | null;
  telefonoCliente: string | null;
  completado: boolean;
}

interface Contact {
  id: string;
  timestamp: string;
  nombre: string;
  email: string;
  telefono: string;
  tipoServicio: string;
  descripcion: string;
  estado: string;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<Tab>('dashboard');

  // Data states
  const [catalog, setCatalog] = useState<Equipment[]>([]);
  const [config, setConfig] = useState<SeasonConfig | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Check auth on mount
  useEffect(() => {
    fetch('/api/admin/login')
      .then((r) => r.json())
      .then((d) => {
        setAuthed(!!d.authenticated);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  // Load data when authed and tab changes
  useEffect(() => {
    if (!authed) return;
    if (tab === 'modelos') loadCatalog();
    else if (tab === 'config') loadConfig();
    else if (tab === 'quotes') loadQuotes();
    else if (tab === 'contacts') loadContacts();
    else if (tab === 'dashboard') {
      loadQuotes();
      loadContacts();
      loadConfig();
    }
  }, [authed, tab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthed(true);
        setPassword('');
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Error al autenticar');
      }
    } catch (err) {
      setLoginError('Error de conexión');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    setAuthed(false);
  };

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      if (Array.isArray(data)) setCatalog(data);
    } finally {
      setLoading(false);
    }
  };

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/config');
      const data = await res.json();
      if (data) setConfig(data);
    } finally {
      setLoading(false);
    }
  };

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/quotes');
      const data = await res.json();
      if (Array.isArray(data)) setQuotes(data);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contacts');
      const data = await res.json();
      if (Array.isArray(data)) setContacts(data);
    } finally {
      setLoading(false);
    }
  };

  const saveCatalog = async () => {
    setSaveMsg('Guardando...');
    try {
      const res = await fetch('/api/admin/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catalog),
      });
      if (res.ok) {
        setSaveMsg('✓ Cambios guardados');
        setTimeout(() => setSaveMsg(''), 3000);
      } else {
        setSaveMsg('Error al guardar');
      }
    } catch {
      setSaveMsg('Error al guardar');
    }
  };

  const saveConfig = async () => {
    if (!config) return;
    setSaveMsg('Guardando...');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaveMsg('✓ Configuración guardada');
        setTimeout(() => setSaveMsg(''), 3000);
      } else {
        setSaveMsg('Error al guardar');
      }
    } catch {
      setSaveMsg('Error al guardar');
    }
  };

  const updateEquipmentField = (idx: number, field: keyof Equipment, value: any) => {
    const next = [...catalog];
    (next[idx] as any)[field] = value;
    setCatalog(next);
  };

  const filteredCatalog = catalog.filter(
    (e) =>
      !search ||
      e.modelo.toLowerCase().includes(search.toLowerCase()) ||
      e.marca.toLowerCase().includes(search.toLowerCase()) ||
      e.tipo.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const totalQuotes = quotes.length;
  const totalContacts = contacts.length;
  const avgQuote = quotes.length
    ? quotes.reduce((s, q) => s + (q.totalFinal || 0), 0) / quotes.length
    : 0;
  const now = new Date();
  // Parse dates in DD/MM format (e.g. "15/05")
  const parseDM = (s: string): [number, number] => {
    const parts = s.split(/[/-]/).map(Number);
    // DD/MM by default (matches seed "15/05")
    return [parts[1] || 0, parts[0] || 0]; // [month, day]
  };
  const isHighSeason =
    config &&
    (() => {
      const [im, id] = parseDM(config.temporadaAltaInicio);
      const [fm, fd] = parseDM(config.temporadaAltaFin);
      const m = now.getMonth() + 1;
      const d = now.getDate();
      const start = im * 100 + id;
      const end = fm * 100 + fd;
      const cur = m * 100 + d;
      if (start <= end) return cur >= start && cur <= end;
      return cur >= start || cur <= end;
    })();

  // ====== RENDER ======

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          Verificando sesión...
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Área de administración</h1>
                <p className="text-sm text-gray-500">Acceso restringido</p>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce la contraseña"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  required
                />
              </div>
              {loginError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                disabled={loggingIn || !password}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Accediendo...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Entrar
                  </>
                )}
              </button>
            </form>
            <Link
              href="/"
              className="block text-center mt-6 text-sm text-gray-500 hover:text-blue-600 transition"
            >
              ← Volver al sitio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== AUTHENTICATED VIEW =====
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <span className="hidden sm:inline-block text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Panel de administración
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition"
            >
              <HomeIcon className="w-4 h-4" /> Sitio web
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { key: 'modelos', label: 'Modelos', icon: Package },
            { key: 'config', label: 'Configuración', icon: Settings },
            { key: 'quotes', label: 'Presupuestos', icon: FileText },
            { key: 'contacts', label: 'Contactos', icon: Users },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key as Tab);
                  setSaveMsg('');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Save Toast */}
        {saveMsg && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
              saveMsg.startsWith('✓')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : saveMsg.includes('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {saveMsg.startsWith('✓') ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : saveMsg.includes('Error') ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {saveMsg}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
          </div>
        )}

        {/* ========== DASHBOARD ========== */}
        {tab === 'dashboard' && !loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<FileText className="w-5 h-5" />}
                label="Presupuestos totales"
                value={totalQuotes.toString()}
                color="blue"
              />
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="Contactos recibidos"
                value={totalContacts.toString()}
                color="cyan"
              />
              <StatCard
                icon={<DollarSign className="w-5 h-5" />}
                label="Presupuesto promedio"
                value={`${avgQuote.toFixed(0)}€`}
                color="green"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Temporada actual"
                value={isHighSeason ? 'Alta' : 'Baja'}
                color={isHighSeason ? 'red' : 'gray'}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Últimos presupuestos
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {quotes.slice(0, 10).map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {q.nombreCliente || 'Sin nombre'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {q.marcaSeleccionada} {q.modeloSeleccionado || '—'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {q.totalFinal?.toFixed(0) || '0'}€
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(q.timestamp).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {quotes.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Aún no hay presupuestos
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-600" />
                  Últimos contactos
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {contacts.slice(0, 10).map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{c.nombre}</p>
                        <p className="text-xs text-gray-500 truncate">{c.email}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ml-2 ${
                          c.tipoServicio === 'averias'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {c.tipoServicio}
                      </span>
                    </div>
                  ))}
                  {contacts.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Aún no hay contactos
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== MODELOS ========== */}
        {tab === 'modelos' && !loading && (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por modelo, marca o tipo..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-sm text-gray-500">
                {filteredCatalog.length} / {catalog.length} modelos
              </span>
              <button
                onClick={saveCatalog}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                <Save className="w-4 h-4" /> Guardar cambios
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Tipo</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Marca</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Modelo</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Frig.Min</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Frig.Max</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">kW</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Precio €</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Eficiencia</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Garantía</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCatalog.map((eq, idx) => {
                      const realIdx = catalog.findIndex(
                        (c) => c.modelo === eq.modelo && c.marca === eq.marca
                      );
                      return (
                        <tr key={`${eq.marca}-${eq.modelo}-${idx}`} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                              {eq.tipo}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={eq.marca}
                              onChange={(e) => updateEquipmentField(realIdx, 'marca', e.target.value)}
                              className="w-28 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={eq.modelo}
                              onChange={(e) => updateEquipmentField(realIdx, 'modelo', e.target.value)}
                              className="w-48 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={eq.frigoriasMin}
                              onChange={(e) => updateEquipmentField(realIdx, 'frigoriasMin', parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={eq.frigoriasMax}
                              onChange={(e) => updateEquipmentField(realIdx, 'frigoriasMax', parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              step="0.1"
                              value={eq.kW}
                              onChange={(e) => updateEquipmentField(realIdx, 'kW', parseFloat(e.target.value) || 0)}
                              className="w-16 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              step="0.01"
                              value={eq.precio}
                              onChange={(e) => updateEquipmentField(realIdx, 'precio', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 border border-blue-300 bg-blue-50 rounded text-sm font-semibold text-blue-700 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={eq.eficiencia}
                              onChange={(e) => updateEquipmentField(realIdx, 'eficiencia', e.target.value)}
                              className="w-16 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={eq.garantia}
                              onChange={(e) => updateEquipmentField(realIdx, 'garantia', e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========== CONFIG ========== */}
        {tab === 'config' && !loading && config && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Temporada alta
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Formato DD/MM (ej. 15/05 para 15 de mayo). La temporada alta influye en los precios de urgencia y avería.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inicio (DD/MM)</label>
                  <input
                    type="text"
                    value={config.temporadaAltaInicio}
                    onChange={(e) => setConfig({ ...config, temporadaAltaInicio: e.target.value })}
                    placeholder="15/05"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin (DD/MM)</label>
                  <input
                    type="text"
                    value={config.temporadaAltaFin}
                    onChange={(e) => setConfig({ ...config, temporadaAltaFin: e.target.value })}
                    placeholder="15/09"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Precios de urgencia 72h
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Precio que se añade al presupuesto cuando el cliente solicita servicio urgente.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temporada alta (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.precioUrgenciaAlta}
                    onChange={(e) => setConfig({ ...config, precioUrgenciaAlta: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temporada baja (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.precioUrgenciaBaja}
                    onChange={(e) => setConfig({ ...config, precioUrgenciaBaja: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Precios de avería (Paso 1)
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Precio mostrado para el servicio "Localizar avería".
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temporada alta (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.precioAveriaAlta}
                    onChange={(e) => setConfig({ ...config, precioAveriaAlta: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temporada baja (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.precioAveriaBaja}
                    onChange={(e) => setConfig({ ...config, precioAveriaBaja: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={saveConfig}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              <Save className="w-4 h-4" /> Guardar configuración
            </button>
          </div>
        )}

        {/* ========== QUOTES ========== */}
        {tab === 'quotes' && !loading && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Fecha</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Cliente</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Contacto</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Servicio</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Equipo</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Marca / Modelo</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700">Total</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q) => (
                    <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {new Date(q.timestamp).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {q.nombreCliente || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {q.emailCliente && (
                          <a href={`mailto:${q.emailCliente}`} className="hover:text-blue-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {q.emailCliente}
                          </a>
                        )}
                        {q.telefonoCliente && (
                          <a href={`tel:${q.telefonoCliente}`} className="hover:text-blue-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {q.telefonoCliente}
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{q.tipoServicio || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{q.tipoEquipo || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {q.marcaSeleccionada} {q.modeloSeleccionado || ''}
                      </td>
                      <td className="px-4 py-3 font-bold text-right text-blue-700">
                        {q.totalFinal?.toFixed(2) || '0.00'}€
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                            q.completado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {q.completado ? 'Completado' : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {quotes.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-400">
                        No hay presupuestos aún
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== CONTACTS ========== */}
        {tab === 'contacts' && !loading && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Fecha</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Tipo</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Nombre</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Teléfono</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Descripción</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {new Date(c.timestamp).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                            c.tipoServicio === 'averias'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {c.tipoServicio}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{c.nombre}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <a href={`mailto:${c.email}`} className="hover:text-blue-600">
                          {c.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <a href={`tel:${c.telefono}`} className="hover:text-blue-600">
                          {c.telefono}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-md truncate" title={c.descripcion}>
                        {c.descripcion}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {c.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-400">
                        No hay contactos aún
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'cyan' | 'green' | 'red' | 'gray';
}) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    cyan: 'from-cyan-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    red: 'from-red-500 to-red-600',
    gray: 'from-gray-500 to-gray-600',
  };
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} text-white flex items-center justify-center`}>
          {icon}
        </div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
