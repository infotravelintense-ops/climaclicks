'use client';

import { motion } from 'framer-motion';
import { MapPin, Sparkles, ShieldCheck, Timer, TrendingUp } from 'lucide-react';

export function HeroIntro() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[40rem] h-[40rem] bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[35rem] h-[35rem] bg-cyan-400/20 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-10 text-center">
        {/* Badge de ubicación */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 text-sm font-semibold mb-6 shadow-sm"
        >
          <MapPin className="w-4 h-4" />
          Servicio de climatización disponible en Mallorca
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-5"
        >
          Aire acondicionado en Mallorca:
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
            presupuesto online en 6 pasos
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-4"
        >
          Selecciona el servicio que necesitas y calcula tu presupuesto de climatización en Mallorca.
        </motion.p>

        {/* Descripción larga SEO */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-sm md:text-base text-slate-500 max-w-4xl mx-auto leading-relaxed"
        >
          Compara de forma rápida tu <strong className="text-slate-700">sustitución de aire acondicionado en Mallorca</strong>,{' '}
          <strong className="text-slate-700">nueva instalación de aire acondicionado en Mallorca</strong>,{' '}
          <strong className="text-slate-700">reparación de aire acondicionado en Mallorca</strong> o{' '}
          <strong className="text-slate-700">petición de proyecto de climatización en Mallorca</strong>{' '}
          sin perder la simplicidad del proceso.
        </motion.p>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-6"
        >
          <TrustItem icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />} label="Instalador autorizado" />
          <TrustItem icon={<Timer className="w-5 h-5 text-blue-600" />} label="Presupuesto en 2 minutos" />
          <TrustItem icon={<TrendingUp className="w-5 h-5 text-purple-600" />} label="+15 años de experiencia" />
          <TrustItem icon={<Sparkles className="w-5 h-5 text-amber-600" />} label="Precios cerrados" />
        </motion.div>
      </div>
    </section>
  );
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
      {icon}
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
  );
}
