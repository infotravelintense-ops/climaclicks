'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Language, ServiceType } from '@/app/types';
import { t } from '@/app/utils/translations';
import { Check, X, Play } from 'lucide-react';

interface Step1Props {
  language: Language;
  onSelectService: (service: ServiceType) => void;
  selectedService: ServiceType | null;
}

const serviceImages: Record<string, string> = {
  'sustitución': '/servicios/sustitucion.jpeg',
  'instalacion': '/servicios/instalacion.jfif',
  'reparacion': '/servicios/reparacion.jfif',
  'proyecto': '/servicios/proyecto.jfif',
  'casco-antiguo': '/servicios/casco-antiguo.jpg',
  'teknopoint': '/servicios/teknopoint.png',
};

const serviceAlt: Record<string, string> = {
  'sustitución': 'Técnico sustituyendo un aire acondicionado antiguo por uno nuevo',
  'instalacion': 'Dos técnicos instalando un aire acondicionado split en el salón',
  'reparacion': 'Técnico reparando un aire acondicionado averiado',
  'proyecto': 'Ingeniero revisando planos de un proyecto de climatización',
  'casco-antiguo': 'Fachada de casco antiguo de Palma de Mallorca sin unidades exteriores de aire acondicionado',
  'teknopoint': 'Sistema Tekno Point para edificios históricos y cascos antiguos',
};

export function Step1Service({ language, onSelectService, selectedService }: Step1Props) {
  const [showTeknoPoint, setShowTeknoPoint] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    descripcion: '',
  });

  const services = [
    { id: 'sustitución', titleKey: 'paso1.sustitucion', descKey: 'paso1.sustitucion.desc' },
    { id: 'instalacion', titleKey: 'paso1.instalacion', descKey: 'paso1.instalacion.desc' },
    { id: 'reparacion', titleKey: 'paso1.reparacion', descKey: 'paso1.reparacion.desc' },
    { id: 'proyecto', titleKey: 'paso1.proyecto', descKey: 'paso1.proyecto.desc' },
  ];

  const cascoAntiguoService = { id: 'casco-antiguo' as ServiceType, titleKey: 'paso1.cascoAntiguo', descKey: 'paso1.cascoAntiguo.desc' };

  const handleTeknoPointSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoServicio: 'teknopoint',
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          descripcion: `Solicitud de Sistema Tekno Point. ${formData.descripcion}`,
        }),
      });
      if (response.ok) {
        alert('Solicitud enviada. Nuestro equipo se pondrá en contacto contigo pronto.');
        setShowTeknoPoint(false);
        setFormData({ nombre: '', email: '', telefono: '', descripcion: '' });
      }
    } catch (error) {
      console.error('Error submitting teknopoint:', error);
      alert('Error al enviar la solicitud');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeInUp">
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          {t('paso1.title', language)}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t('paso1.subtitle', language)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
        {services.map((service, idx) => {
          const isSelected = selectedService === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelectService(service.id as ServiceType)}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-300 border-2 bg-white text-left ${
                isSelected
                  ? 'border-blue-500 shadow-elevated ring-2 ring-blue-400 ring-offset-2'
                  : 'border-gray-200 card-hover shadow-card hover:border-blue-300'
              }`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
              }}
            >
              {/* Imagen principal */}
              <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                <Image
                  src={serviceImages[service.id]}
                  alt={serviceAlt[service.id]}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={idx < 2}
                />
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Badge seleccionado */}
                {isSelected && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold text-xs shadow-lg">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    Seleccionado
                  </div>
                )}
              </div>

              {/* Contenido textual */}
              <div className="p-6 md:p-7">
                <h3 className={`text-xl md:text-2xl font-bold mb-2 transition-colors ${
                  isSelected ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-600'
                }`}>
                  {t(service.titleKey, language)}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {t(service.descKey, language)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Fila especial: Soluciones casco antiguo + Sistema Tekno Point (lado a lado) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
        {/* Card Casco Antiguo */}
        <button
          onClick={() => onSelectService(cascoAntiguoService.id)}
          className={`group relative overflow-hidden rounded-2xl transition-all duration-300 border-2 bg-white text-left ${
            selectedService === cascoAntiguoService.id
              ? 'border-blue-500 shadow-elevated ring-2 ring-blue-400 ring-offset-2'
              : 'border-gray-200 card-hover shadow-card hover:border-blue-300'
          }`}
          style={{
            animation: `fadeInUp 0.6s ease-out 0.4s both`,
          }}
        >
          <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
            <Image
              src={serviceImages['casco-antiguo']}
              alt={serviceAlt['casco-antiguo']}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            {selectedService === cascoAntiguoService.id && (
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold text-xs shadow-lg">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                Seleccionado
              </div>
            )}
          </div>
          <div className="p-6 md:p-7">
            <h3 className={`text-xl md:text-2xl font-bold mb-2 transition-colors ${
              selectedService === cascoAntiguoService.id ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-600'
            }`}>
              {t(cascoAntiguoService.titleKey, language)}
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {t(cascoAntiguoService.descKey, language)}
            </p>
          </div>
        </button>

        {/* Card Sistema Tekno Point (abre modal) */}
        <button
          onClick={() => setShowTeknoPoint(true)}
          className="group relative overflow-hidden rounded-2xl transition-all duration-300 border-2 border-gray-200 bg-white text-left card-hover shadow-card hover:border-purple-300"
          style={{
            animation: `fadeInUp 0.6s ease-out 0.5s both`,
          }}
        >
          <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
            <Image
              src={serviceImages['teknopoint']}
              alt={serviceAlt['teknopoint']}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-white transition-all group-hover:scale-110 duration-300 shadow-lg">
                <Play className="w-8 h-8 text-purple-600 fill-purple-600" />
              </div>
            </div>
          </div>
          <div className="p-6 md:p-7">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
              Sistema Tekno Point
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Solución especial para cascos antiguos y edificios históricos donde no es posible instalar unidades exteriores en fachada.
            </p>
          </div>
        </button>
      </div>

      {/* Modal de Tekno Point */}
      {showTeknoPoint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto animate-fadeInUp">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Sistema Tekno Point
              </h2>
              <button
                onClick={() => setShowTeknoPoint(false)}
                className="text-white hover:text-purple-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Imagen ilustrativa del sistema */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Conoce nuestro sistema</h3>
                <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={serviceImages['teknopoint']}
                    alt={serviceAlt['teknopoint']}
                    fill
                    sizes="(max-width: 768px) 100vw, 640px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Beneficios */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Beneficios del Sistema Tekno Point</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Perfecto para cascos antiguos y edificios históricos
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Sin unidades exteriores visibles en fachada
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Cumple con ordenanzas de protección del patrimonio
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Máxima eficiencia y rendimiento
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Instalación profesional incluida
                  </li>
                </ul>
              </div>

              {/* Formulario */}
              <form onSubmit={handleTeknoPointSubmit} className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tu teléfono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Detalles sobre tu vivienda
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Cuéntanos sobre tu casa, ubicación, etc..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTeknoPoint(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-semibold text-white hover:shadow-lg transition-all"
                  >
                    Solicitar información
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
