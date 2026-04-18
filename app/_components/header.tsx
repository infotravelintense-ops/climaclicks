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
  Facebook,
  Instagram,
  Linkedin,
} from 'lucide-react';
import { Logo } from './logo';
import { LanguageSelector } from './language-selector';

interface HeaderProps {
  language: Language;
  currentStep: number;
  stepNames: string[];
  onLanguageChange?: (lang: Language) => void;
}

const navLinks = [
  { href: '#presupuesto', label: 'Presupuesto' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#sobre-nosotros', label: 'Sobre nosotros' },
  { href: '#trabajos', label: 'Trabajos' },
  { href: '#contacto', label: 'Contacto' },
];

const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: 'smooth' });
  } else if (href === '#presupuesto') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

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
      {/* Top bar con info de contacto */}
      <div className="hidden md:block bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 text-white text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Mallorca, Islas Baleares
            </span>
            <a href="tel:+34971123456" className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <Phone className="w-3.5 h-3.5" /> +34 971 123 456
            </a>
            <a href="mailto:info@climaya.es" className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <Mail className="w-3.5 h-3.5" /> info@climaya.es
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Lun-Vie 9:00 - 18:00
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Instalador autorizado
            </span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <Logo size="md" showText={true} />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => smoothScroll(e, link.href)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Idioma + CTA */}
          <div className="flex items-center gap-3">
            {onLanguageChange && (
              <div className="hidden sm:block">
                <LanguageSelector current={language} onChange={onLanguageChange} compact />
              </div>
            )}
            <a
              href="tel:+34971123456"
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-gray-100 overflow-hidden"
          >
            <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    smoothScroll(e, link.href);
                    setMobileOpen(false);
                  }}
                  className="px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                >
                  {link.label}
                </a>
              ))}
              {onLanguageChange && (
                <div className="pt-3 border-t border-gray-100 mt-2">
                  <LanguageSelector current={language} onChange={onLanguageChange} compact />
                </div>
              )}
            </nav>
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
            <span className={`text-xs font-bold bg-gradient-to-r ${stepColors[currentStep] || stepColors[1]} bg-clip-text text-transparent`}>
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
   FOOTER COMPLETO con datos de empresa
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
              href="tel:+34971123456"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-lg shadow-lg hover:scale-105 transition-all"
            >
              <Phone className="w-5 h-5" /> +34 971 123 456
            </a>
            <a
              href="https://wa.me/34971123456?text=Hola,%20necesito%20ayuda%20con%20un%20aire%20acondicionado"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-all"
            >
              <WhatsAppIcon className="w-5 h-5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Columna 1: marca */}
          <div>
            <Logo size="md" variant="white" showText={true} />
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              Expertos en climatización en Mallorca. Instalación, sustitución, reparación y mantenimiento de aire acondicionado con más de 15 años de experiencia.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-pink-600 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Columna 2: Servicios */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Servicios</h4>
            <ul className="space-y-2.5 text-gray-400 text-sm">
              <li className="flex items-start gap-2 hover:text-cyan-300 transition-colors cursor-pointer">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Instalación de aire acondicionado</span>
              </li>
              <li className="flex items-start gap-2 hover:text-cyan-300 transition-colors cursor-pointer">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Sustitución de equipos antiguos</span>
              </li>
              <li className="flex items-start gap-2 hover:text-cyan-300 transition-colors cursor-pointer">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Reparación y averías</span>
              </li>
              <li className="flex items-start gap-2 hover:text-cyan-300 transition-colors cursor-pointer">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Mantenimiento preventivo</span>
              </li>
              <li className="flex items-start gap-2 hover:text-cyan-300 transition-colors cursor-pointer">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Proyectos personalizados</span>
              </li>
            </ul>
          </div>

          {/* Columna 3: Enlaces */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Empresa</h4>
            <ul className="space-y-2.5 text-gray-400 text-sm">
              <li><a href="#inicio" className="hover:text-cyan-300 transition-colors">Inicio</a></li>
              <li><a href="#sobre-nosotros" className="hover:text-cyan-300 transition-colors">Sobre nosotros</a></li>
              <li><a href="#servicios" className="hover:text-cyan-300 transition-colors">Nuestros servicios</a></li>
              <li><a href="#trabajos" className="hover:text-cyan-300 transition-colors">Trabajos realizados</a></li>
              <li><a href="#contacto" className="hover:text-cyan-300 transition-colors">Contacto</a></li>
              <li><a href="/admin" className="hover:text-cyan-300 transition-colors">Área interna</a></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Contacto</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Mallorca</p>
                  <p>Islas Baleares, España</p>
                </div>
              </li>
              <li>
                <a href="tel:+34971123456" className="flex items-start gap-2 hover:text-cyan-300 transition-colors">
                  <Phone className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>+34 971 123 456</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@climaya.es" className="flex items-start gap-2 hover:text-cyan-300 transition-colors">
                  <Mail className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>info@climaya.es</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Lun-Vie: 9:00 - 18:00</p>
                  <p>Sábado: 10:00 - 14:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            <p>© {new Date().getFullYear()} Climaya — Manteniments Costa Nord S.L. Todos los derechos reservados.</p>
            <p className="mt-1 text-gray-500">Empresa instaladora autorizada en Mallorca.</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Aviso legal</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
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
      {/* Tooltip */}
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
                <p className="font-bold text-gray-900 text-sm">Climaya</p>
                <p className="text-xs text-green-600">● En línea ahora</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">¡Hola! ¿Necesitas ayuda? Responderemos en menos de 5 minutos.</p>
            <a
              href="https://wa.me/34971123456?text=Hola,%20necesito%20ayuda%20con%20un%20aire%20acondicionado"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-lg transition-colors"
            >
              Iniciar conversación
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
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
