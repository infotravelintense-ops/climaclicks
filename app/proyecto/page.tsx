'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react';
import type { Language } from '@/app/types';
import { t } from '@/app/utils/translations';
import { LanguageSelector } from '@/app/_components/language-selector';

export default function ProyectoPage() {
  const [language, setLanguage] = useState<Language>('es');
  const [formData, setFormData] = useState({
    tipoProyecto: '',
    tieneIngeniero: '',
    codigoPostal: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    email: '',
    comentarios: '',
    archivo: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidMallorkaPostalCode = (code: string) => {
    const postal = parseInt(code);
    return !isNaN(postal) && postal >= 1000 && postal <= 52999;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFormData({ ...formData, archivo: files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.tipoProyecto) newErrors.tipoProyecto = 'Requerido';
    if (!formData.tieneIngeniero) newErrors.tieneIngeniero = 'Requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'Requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'Requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'Requerido';
    if (!formData.email.trim()) newErrors.email = 'Requerido';
    if (!formData.codigoPostal.trim()) newErrors.codigoPostal = 'Requerido';
    if (!isValidMallorkaPostalCode(formData.codigoPostal)) {
      newErrors.codigoPostal = 'Solo Mallorca';
    }
    if (!formData.direccion.trim()) newErrors.direccion = 'Requerido';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('tipoServicio', 'proyecto');
        formDataToSend.append('tipoProyecto', formData.tipoProyecto);
        formDataToSend.append('tieneIngeniero', formData.tieneIngeniero);
        formDataToSend.append('nombre', formData.nombre);
        formDataToSend.append('apellido', formData.apellido);
        formDataToSend.append('telefono', formData.telefono);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('direccion', formData.direccion);
        formDataToSend.append('codigoPostal', formData.codigoPostal);
        formDataToSend.append('descripcion', formData.comentarios);
        if (formData.archivo) {
          formDataToSend.append('archivo', formData.archivo);
        }

        // For now, just show success (actual file upload would be implemented with cloud storage)
        alert('Solicitud de proyecto enviada. Nuestro equipo se pondrá en contacto contigo pronto.');
        
        // Reset form
        setFormData({
          tipoProyecto: '',
          tieneIngeniero: '',
          codigoPostal: '',
          nombre: '',
          apellido: '',
          telefono: '',
          direccion: '',
          email: '',
          comentarios: '',
          archivo: null,
        });
      } catch (error) {
        console.error('Error submitting proyecto:', error);
        alert('Error al enviar la solicitud');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">{t('btn.volverInicio', language)}</span>
          </Link>
          <LanguageSelector current={language} onChange={setLanguage} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('proyecto.title', language)}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-8">
          {/* Tipo de Proyecto */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              {t('proyecto.tipoProyecto', language)} *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'aeroTermia', label: 'proyecto.aeroTermia' },
                { id: 'multiconducor', label: 'proyecto.multiconducor' },
                { id: 'evaporativo', label: 'proyecto.evaporativo' },
                { id: 'vrf', label: 'proyecto.vrf' },
                { id: 'chiller', label: 'proyecto.chiller' },
                { id: 'otro', label: 'proyecto.otro' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, tipoProyecto: option.id })
                  }
                  className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                    formData.tipoProyecto === option.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300'
                  }`}
                >
                  {t(option.label, language)}
                </button>
              ))}
            </div>
            {errors.tipoProyecto && (
              <p className="text-red-500 text-sm mt-2">{errors.tipoProyecto}</p>
            )}
          </div>

          {/* ¿Tienes proyecto de ingeniero? */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              {t('proyecto.tieneIngeniero', language)} *
            </label>
            <div className="flex gap-4">
              {[
                { id: 'si', label: 'proyecto.si' },
                { id: 'no', label: 'proyecto.no' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, tieneIngeniero: option.id })
                  }
                  className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                    formData.tieneIngeniero === option.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300'
                  }`}
                >
                  {t(option.label, language)}
                </button>
              ))}
            </div>
            {errors.tieneIngeniero && (
              <p className="text-red-500 text-sm mt-2">{errors.tieneIngeniero}</p>
            )}
          </div>

          {/* Datos personales */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Datos personales</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('proyecto.nombre', language)} *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Juan"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('proyecto.apellido', language)} *
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.apellido ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="García"
                />
                {errors.apellido && (
                  <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('proyecto.telefono', language)} *
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+34 600 000 000"
                />
                {errors.telefono && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('proyecto.email', language)} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('proyecto.codigoPostal', language)} *
                </label>
                <input
                  type="text"
                  value={formData.codigoPostal}
                  onChange={(e) =>
                    setFormData({ ...formData, codigoPostal: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.codigoPostal ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="07000"
                />
                {errors.codigoPostal && (
                  <p className="text-red-500 text-sm mt-1">{errors.codigoPostal}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('proyecto.direccion', language)} *
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.direccion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Calle Principal, 123"
                />
                {errors.direccion && (
                  <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
                )}
              </div>
            </div>
          </div>

          {/* Comentarios */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('proyecto.comentarios', language)}
            </label>
            <textarea
              value={formData.comentarios}
              onChange={(e) =>
                setFormData({ ...formData, comentarios: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Cuéntanos sobre tu proyecto..."
            />
          </div>

          {/* Subir archivo */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('proyecto.subirArchivo', language)}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {formData.archivo ? formData.archivo.name : 'Haz clic para seleccionar archivo'}
                </p>
              </label>
            </div>
          </div>

          {/* Aviso */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              {t('proyecto.soloMallorca', language)}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : t('proyecto.enviar', language)}
          </button>
        </form>
      </main>
    </div>
  );
}
