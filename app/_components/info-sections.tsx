'use client';

import { motion } from 'framer-motion';
import {
  Snowflake,
  Wrench,
  Settings,
  Home as HomeIcon,
  Shield,
  Award,
  Users,
  Clock,
  CheckCircle2,
  Star,
  Briefcase,
  ThermometerSun,
  Building2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

/* ==========================================
   SECCIÓN: SERVICIOS
   ========================================== */
export function ServicesSection() {
  const services = [
    {
      icon: Snowflake,
      title: 'Instalación de aire acondicionado',
      description:
        'Instalación profesional de equipos de climatización con presupuesto cerrado. Desde splits hasta sistemas de conductos.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Settings,
      title: 'Sustitución de equipos antiguos',
      description:
        'Cambia tu equipo antiguo por uno de última generación. Más eficiente, menos consumo y mejor confort.',
      color: 'from-cyan-500 to-teal-500',
    },
    {
      icon: Wrench,
      title: 'Reparación y averías',
      description:
        'Localizamos y solucionamos cualquier avería. Servicio de urgencia en 72h en temporada alta.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Mantenimiento preventivo',
      description:
        'Revisiones periódicas para alargar la vida útil de tu equipo y evitar averías costosas.',
      color: 'from-emerald-500 to-green-500',
    },
    {
      icon: Building2,
      title: 'Proyectos personalizados',
      description:
        'Proyectos para hoteles, oficinas, locales comerciales y viviendas. Soluciones a medida.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: ThermometerSun,
      title: 'Climatización eficiente',
      description:
        'Equipos de alta eficiencia energética (A+++) que reducen tu factura de la luz hasta un 40%.',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <section id="servicios" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
            Nuestros servicios
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-4">
            Todo lo que necesitas para tu climatización
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Servicio integral de aire acondicionado en Mallorca. Instalación, reparación y mantenimiento con garantía profesional.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   SECCIÓN: SOBRE NOSOTROS
   ========================================== */
export function AboutSection() {
  const stats = [
    { value: '15+', label: 'Años de experiencia', icon: Award },
    { value: '2.500+', label: 'Instalaciones realizadas', icon: Briefcase },
    { value: '4.9★', label: 'Valoración media', icon: Star },
    { value: '24/7', label: 'Atención al cliente', icon: Clock },
  ];

  const values = [
    { icon: CheckCircle2, text: 'Presupuestos cerrados, sin sorpresas' },
    { icon: CheckCircle2, text: 'Equipo técnico certificado y autorizado' },
    { icon: CheckCircle2, text: 'Equipos de primeras marcas con garantía oficial' },
    { icon: CheckCircle2, text: 'Servicio postventa y mantenimiento' },
    { icon: CheckCircle2, text: 'Financiación hasta 12 meses sin intereses' },
    { icon: CheckCircle2, text: 'Respuesta en menos de 24h' },
  ];

  return (
    <section id="sobre-nosotros" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 text-sm font-semibold rounded-full mb-4">
              Sobre Climaya
            </span>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-6">
              Tu empresa de confianza en Mallorca
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              <strong>Climaya</strong> es la marca de <strong>Manteniments Costa Nord S.L.</strong>, empresa instaladora autorizada especializada en aire acondicionado en Mallorca. Con más de 15 años de experiencia, hemos ayudado a miles de familias y empresas a disfrutar del confort ideal en sus hogares y negocios.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Nos diferenciamos por ofrecer <strong>presupuestos cerrados online</strong>, transparencia total y un servicio técnico certificado. Trabajamos con las mejores marcas del mercado para garantizar calidad y durabilidad.
            </p>
            <div className="space-y-3">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.text} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{v.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-5"
          >
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-8 h-8 text-blue-600 mb-3" />
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-1">
                    {s.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{s.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   SECCIÓN: TRABAJOS REALIZADOS
   ========================================== */
export function WorksSection() {
  const works = [
    {
      type: 'Villa en Andratx',
      description: 'Sistema multisplit de 4 unidades para vivienda de 250m² con equipos Giatsu A+++.',
      details: '4 unidades interiores · Equipos A+++',
      color: 'from-blue-500 to-blue-700',
    },
    {
      type: 'Oficina en Palma',
      description: 'Instalación de conductos para oficina de 180m² con zonificación inteligente WiFi.',
      details: 'Sistema conductos · Zonificación WiFi',
      color: 'from-cyan-500 to-cyan-700',
    },
    {
      type: 'Restaurante Portocolom',
      description: 'Climatización integral con sistema casete de techo para sala de 120m².',
      details: 'Casete techo · 24.000 frigorías',
      color: 'from-emerald-500 to-emerald-700',
    },
    {
      type: 'Hotel Cala Millor',
      description: 'Renovación completa de 24 habitaciones con equipos split de bajo consumo.',
      details: '24 splits · Eficiencia A+++',
      color: 'from-purple-500 to-purple-700',
    },
    {
      type: 'Vivienda Sóller',
      description: 'Sustitución de equipo antiguo por modelo eco-silencioso con control por voz.',
      details: 'Sustitución · WiFi + Alexa',
      color: 'from-amber-500 to-amber-700',
    },
    {
      type: 'Local comercial Inca',
      description: 'Suelo-techo para tienda de 80m² con instalación en 1 solo día."',
      details: 'Suelo-techo · Instalación rápida',
      color: 'from-rose-500 to-rose-700',
    },
  ];

  return (
    <section id="trabajos" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">
            Trabajos realizados
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-4">
            Proyectos que hablan por sí solos
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Miles de instalaciones en toda Mallorca. Desde viviendas particulares hasta grandes proyectos comerciales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((w, idx) => (
            <motion.div
              key={w.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 bg-white"
            >
              <div className={`h-40 bg-gradient-to-br ${w.color} flex items-center justify-center relative overflow-hidden`}>
                <HomeIcon className="w-20 h-20 text-white/30 group-hover:scale-110 transition-transform" />
                <div className="absolute top-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                  {w.details}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{w.type}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{w.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   SECCIÓN: CONTACTO CTA
   ========================================== */
export function ContactCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-cyan-700 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Users className="w-14 h-14 text-cyan-300 mx-auto mb-5" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Hablamos de tu proyecto?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Solicita tu presupuesto online en 2 minutos o contáctanos directamente. Nuestro equipo te atenderá sin compromiso.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="tel:+34971123456"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              <Phone className="w-5 h-5" /> +34 971 123 456
            </a>
            <a
              href="mailto:info@climaya.es"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              <Mail className="w-5 h-5" /> info@climaya.es
            </a>
            <a
              href="https://wa.me/34971123456?text=Hola,%20necesito%20un%20presupuesto%20de%20aire%20acondicionado"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              <WhatsAppSmallIcon className="w-5 h-5" /> WhatsApp
            </a>
          </div>
          <div className="mt-10 flex items-center justify-center gap-2 text-cyan-200">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Cubrimos toda Mallorca · Islas Baleares</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WhatsAppSmallIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
