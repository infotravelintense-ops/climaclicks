'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Language } from '@/app/types';
import {
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Menu,
  X,
  Clock,
  Award,
  Shield,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { Logo } from './logo';
import { LanguageSelector } from './language-selector';

const PHONE_DISPLAY = '657 12 94 74';
const PHONE_TEL = '+34657129474';
const EMAIL = 'contabilidad@grupocostanord.com';
const WHATSAPP_URL =
  'https://wa.me/34657129474?text=Hola,%20necesito%20ayuda%20con%20un%20aire%20acondicionado';
const COMPANY_NAME = 'Manteniments Costa Nord S.L.';
const ADDRESS_LINE_1 = 'Av. Golf 23, Bajo Izquierda';
const ADDRESS_LINE_2 = '07458 Can Picafort · Illes Balears';
const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Avenida+Golf+23+Can+Picafort+07458';
const WEBSITE_URL = 'https://www.mantenimentscostanord.com/';

interface HeaderProps {
  language: Language;
  currentStep: number;
  stepNames: string[];
  onLanguageChange?: (lang: Language) => void;
}

const stepColors: Record<number, string> = {
  1: 'from-blue-600 to-blue-800',
  2: 'from-indigo-600 to-indigo-800',
  3: 'from-purple-600 to-purple-800',
  4: 'from-emerald-600 to-emerald-800',
  5: 'from-amber-600 to-amber-800',
  6: 'from-green-600 to-green-800',
};

export function Header({ language, currentStep, stepNames, onLanguageChange }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      {/* Top bar con info de contacto (solo escritorio) */}
      <div className="hidden md:block bg-slate-900 text-white text-xs">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> {PHONE_DISPLAY}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> {EMAIL}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Servicio 24/7
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Instalador autorizado
            </span>
          </div>
        </div>
      </div>

      {/* Main navbar: Logo + Banderas + CTA */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex-shrink-0 group">
            <Logo size="md" showText={true} />
          </Link>

          {onLanguageChange && (
            <div className="hidden md:flex flex-1 justify-center">
              <LanguageSelector current={language} onChange={onLanguageChange} compact />
            </div>
          )}

          <div className="flex items-center gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <Phone className="w-4 h-4" /> Llámanos
            </a>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Franja con mensaje de Mallorca */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide">
          <MapPin className="w-4 h-4 text-cyan-300" />
          <span>Servicio de climatización disponible en Mallorca</span>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && onLanguageChange && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-gray-100 overflow-hidden bg-white"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-center gap-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Idioma</span>
              <LanguageSelector
                current={language}
                onChange={(lang) => {
                  onLanguageChange(lang);
                  setMobileOpen(false);
                }}
                compact
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Paso {currentStep}/6</span>
              <span className="text-sm font-bold text-gray-900">· {stepNames[currentStep - 1]}</span>
            </div>
            <span
              className={`text-xs font-bold bg-gradient-to-r ${stepColors[currentStep] || stepColors[1]} bg-clip-text text-transparent`}
            >
              {Math.round((currentStep / 6) * 100)}% completado
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${stepColors[currentStep] || stepColors[1]} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 6) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   FOOTER — Estructura igual al spec Canvas
   ========================================================= */
export function Footer({ language }: { language: Language }) {
  return (
    <footer id="contacto" className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Banda superior con CTA */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-1">¿Quieres hablar con nosotros?</h3>
            <p className="text-white/90">Responderemos a tu consulta en menos de 24h.</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-lg shadow-lg hover:scale-105 transition-all"
            >
              <Phone className="w-5 h-5" /> {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-all"
            >
              <WhatsAppIcon className="w-5 h-5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Badges / tags superiores (3 tags como en el spec) */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-cyan-200">
              <Clock className="w-4 h-4" /> Servicio 24/7
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-cyan-200">
              <Award className="w-4 h-4" /> Empresa instaladora
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-cyan-200">
              <Shield className="w-4 h-4" /> Calidad garantizada
            </span>
          </div>
        </div>
      </div>

      {/* Trustpilot widget placeholder — se activará cuando el cliente proporcione su perfil de Trustpilot */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10">
            <svg className="w-6 h-6 text-[#00b67a]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <div>
              <p className="text-sm font-bold text-white">Trustpilot</p>
              <p className="text-xs text-gray-400">Valoraciones verificadas — próximamente</p>
            </div>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-4 h-4 text-[#00b67a]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal: 4 columnas */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Columna 1: Marca + descripción + 3 checks */}
          <div>
            <Logo size="md" variant="white" showText={true} />
            <p className="font-bold text-white mt-4">{COMPANY_NAME}</p>
            <p className="text-gray-400 text-sm leading-relaxed mt-3">
              Calidad y profesionalidad en todos nuestros servicios. Equipo técnico especializado en
              climatización, electricidad, fontanería, albañilería y carpintería en Mallorca.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Técnicos cualificados</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Atención personalizada</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Precios competitivos</span>
              </li>
            </ul>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Enlaces rápidos</h4>
            <ul className="space-y-2.5 text-gray-400 text-sm">
              <li>
                <a
                  href={`${WEBSITE_URL}sobre-nosotros`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a
                  href={`${WEBSITE_URL}servicios`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Servicios
                </a>
              </li>
              <li>
                <a
                  href={`${WEBSITE_URL}trabajos-realizados`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Trabajos realizados
                </a>
              </li>
              <li>
                <a
                  href={`${WEBSITE_URL}contacto`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Contacto</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="flex items-start gap-2 hover:text-cyan-300 transition-colors"
                >
                  <Phone className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold text-white">{PHONE_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-start gap-2 hover:text-cyan-300 transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>{EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-cyan-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>WhatsApp directo</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{ADDRESS_LINE_1},</p>
                  <p>{ADDRESS_LINE_2}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Columna 4: Información legal */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Información legal</h4>
            <ul className="space-y-2.5 text-gray-400 text-sm">
              <li>
                <a href="/legal/aviso-legal" className="hover:text-cyan-300 transition-colors">
                  Aviso legal
                </a>
              </li>
              <li>
                <a href="/legal/privacidad" className="hover:text-cyan-300 transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a
                  href={`${WEBSITE_URL}contacto`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Solicitar información
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-cyan-300 transition-colors">
                  Área interna
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ubicación card */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <p className="font-bold text-white text-base">Ubicación</p>
              <p className="text-gray-300 text-sm">Av. Golf, 23 · 07458 Can Picafort · Illes Balears</p>
            </div>
          </div>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-sm rounded-lg shadow-md transition-all"
          >
            <ExternalLink className="w-4 h-4" /> Abrir en Google Maps
          </a>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {COMPANY_NAME} Todos los derechos reservados.</p>
          <p className="text-gray-500">Empresa instaladora autorizada en Mallorca.</p>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/* =========================================================
   Floating WhatsApp button
   ========================================================= */
export function WhatsAppButton() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl p-5 max-w-xs border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <WhatsAppIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">ClimaClicks</p>
                <p className="text-xs text-green-600">● En línea ahora</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">¡Hola! ¿Necesitas ayuda? Responderemos en menos de 5 minutos.</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-lg transition-colors"
            >
              Iniciar conversación
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
        className="relative w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl flex items-center justify-center"
        aria-label="WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40" />
        {expanded ? <X className="w-7 h-7" /> : <WhatsAppIcon className="w-8 h-8" />}
        {!expanded && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
}
