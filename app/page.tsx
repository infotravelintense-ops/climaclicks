'use client';

import { useState, useEffect } from 'react';
import type { Language, ServiceType, EquipmentType, Equipment } from '@/app/types';
import { t, getTranslations } from '@/app/utils/translations';
import { calculateFrigorias, calculatePrice, getUrgenciaPrice, isHighSeason, calculateMetrosAdicionalesPrice } from '@/app/utils/calculations';
import { Header, Footer } from '@/app/_components/header';
import { LanguageSelector } from '@/app/_components/language-selector';
import { ProgressBar } from '@/app/_components/progress-bar';
import { Step1Service } from '@/app/_components/step-1-service';
import { Step2Equipment } from '@/app/_components/step-2-equipment';
import { Step3Space } from '@/app/_components/step-3-space';
import { Step4Models } from '@/app/_components/step-4-models';
import { Step5Extras } from '@/app/_components/step-5-extras';
import { Step6Quote } from '@/app/_components/step-6-quote';
import { ArrowLeft, ArrowRight, Home as HomeIcon } from 'lucide-react';

const STEP_NAMES: Record<Language, string[]> = {
  es: ['Tipo de instalación', 'Tipo de aire', 'Espacio', 'Modelo', 'Extras', 'Presupuesto'],
  en: ['Installation Type', 'Air Type', 'Space', 'Model', 'Extras', 'Quote'],
  de: ['Installationstyp', 'Lufttyp', 'Raum', 'Modell', 'Extras', 'Angebot'],
  it: ['Tipo di installazione', 'Tipo di aria', 'Spazio', 'Modello', 'Extra', 'Preventivo'],
  hu: ['Telepítés típusa', 'Levegő típusa', 'Hely', 'Modell', 'Extra', 'Ajánlat'],
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<Language>('es');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  const [quoteData, setQuoteData] = useState({
    language: 'es' as Language,
    tipoServicio: null as ServiceType | null,
    tipoEquipo: null as EquipmentType | null,
    metrosCuadrados: 20,
    altura: 2.5,
    exposicionSolar: 1.0,
    frigoriasCalculadas: 2500,
    modeloSeleccionado: null as Equipment | null,
    andamio: false,
    urgencia72h: false,
    metrosAdicionales: 0,
    nombreCliente: '',
    emailCliente: '',
    telefonoCliente: '',
    direccionCliente: '',
    codigoPostalCliente: '',
  });

  // Cargar equipos cuando cambia tipo o frigorías
  useEffect(() => {
    if (currentStep === 4 && quoteData.tipoEquipo) {
      loadEquipment();
    }
  }, [quoteData.tipoEquipo, quoteData.frigoriasCalculadas, currentStep]);

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/equipment?type=${quoteData.tipoEquipo}&minFrigorias=${quoteData.frigoriasCalculadas * 0.8}&maxFrigorias=${quoteData.frigoriasCalculadas * 1.2}`
      );
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error('Error loading equipment:', error);
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    // Validaciones básicas
    if (currentStep === 1 && !quoteData.tipoServicio) return;
    if (currentStep === 2 && !quoteData.tipoEquipo) return;
    if (currentStep === 4 && !quoteData.modeloSeleccionado) return;

    // En paso 2, si es servicio rápido (averia/proyecto), saltar a paso especial
    if (
      currentStep === 1 &&
      (quoteData.tipoServicio === 'averia' || quoteData.tipoServicio === 'proyecto')
    ) {
      // TODO: Implementar flujo rápido
      console.log('Flujo rápido:', quoteData.tipoServicio);
      return;
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setQuoteData({
      language,
      tipoServicio: null,
      tipoEquipo: null,
      metrosCuadrados: 20,
      altura: 2.5,
      exposicionSolar: 1.0,
      frigoriasCalculadas: 2500,
      modeloSeleccionado: null,
      andamio: false,
      urgencia72h: false,
      metrosAdicionales: 0,
      nombreCliente: '',
      emailCliente: '',
      telefonoCliente: '',
      direccionCliente: '',
      codigoPostalCliente: '',
    });
  };

  const handleQuoteSubmit = async (formData: any) => {
    try {
      const precioInstalacion = 800; // Precio base (simplificado)
      const urgenciaPrice = quoteData.urgencia72h ? getUrgenciaPrice(isHighSeason(new Date())) : 0;
      const andamioPrice = quoteData.andamio ? 120 : 0;
      const metrosPrice = calculateMetrosAdicionalesPrice(quoteData.metrosAdicionales);

      const prices = calculatePrice(
        quoteData.modeloSeleccionado?.precio || 0,
        precioInstalacion,
        quoteData.andamio,
        andamioPrice,
        quoteData.urgencia72h,
        urgenciaPrice,
        quoteData.metrosAdicionales,
        metrosPrice
      );

      const response = await fetch('/api/quote/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: quoteData.language,
          tipoServicio: quoteData.tipoServicio,
          tipoEquipo: quoteData.tipoEquipo,
          metrosCuadrados: quoteData.metrosCuadrados,
          altura: quoteData.altura,
          exposicionSolar: quoteData.exposicionSolar,
          frigoriasCalculadas: quoteData.frigoriasCalculadas,
          modeloSeleccionado: quoteData.modeloSeleccionado?.modelo,
          marcaSeleccionada: quoteData.modeloSeleccionado?.marca,
          precioEquipo: quoteData.modeloSeleccionado?.precio,
          andamio: quoteData.andamio,
          andamioPrice,
          urgencia72h: quoteData.urgencia72h,
          urgenciaPrice,
          metrosAdicionales: quoteData.metrosAdicionales,
          metrosAdicionalesPrice: metrosPrice,
          ...prices,
          nombreCliente: formData.nombre,
          emailCliente: formData.email,
          telefonoCliente: formData.telefono,
          direccionCliente: formData.direccion,
          codigoPostalCliente: formData.codigoPostal,
        }),
      });

      if (response.ok) {
        alert('Presupuesto creado exitosamente!');
        handleReset();
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Error al crear el presupuesto');
    }
  };

  const precioInstalacion = 800; // Simplificado
  const urgenciaPrice = quoteData.urgencia72h ? getUrgenciaPrice(isHighSeason(new Date())) : 0;
  const andamioPrice = quoteData.andamio ? 120 : 0;
  const metrosPrice = calculateMetrosAdicionalesPrice(quoteData.metrosAdicionales);
  const prices = calculatePrice(
    quoteData.modeloSeleccionado?.precio || 0,
    precioInstalacion,
    quoteData.andamio,
    andamioPrice,
    quoteData.urgencia72h,
    urgenciaPrice,
    quoteData.metrosAdicionales,
    metrosPrice
  );

  return (
    <>
      <Header language={language} currentStep={currentStep} stepNames={STEP_NAMES[language]} />

      <main className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Language selector - solo en paso 1 */}
          {currentStep === 1 && (
            <LanguageSelector
              current={language}
              onChange={(lang) => {
                setLanguage(lang);
                setQuoteData({ ...quoteData, language: lang });
              }}
            />
          )}

          {/* Progress bar */}
          <ProgressBar
            currentStep={currentStep}
            language={language}
            stepNames={STEP_NAMES[language]}
          />

          {/* Content area */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            {currentStep === 1 && (
              <Step1Service
                language={language}
                onSelectService={(service) => {
                  setQuoteData({ ...quoteData, tipoServicio: service });
                }}
                selectedService={quoteData.tipoServicio}
              />
            )}

            {currentStep === 2 && (
              <Step2Equipment
                language={language}
                onSelectEquipment={(type) => {
                  setQuoteData({ ...quoteData, tipoEquipo: type });
                }}
                selectedEquipment={quoteData.tipoEquipo}
              />
            )}

            {currentStep === 3 && (
              <Step3Space
                language={language}
                onUpdate={(data) => {
                  setQuoteData({ ...quoteData, ...data });
                }}
              />
            )}

            {currentStep === 4 && (
              <Step4Models
                language={language}
                models={equipment}
                onSelectModel={(model) => {
                  setQuoteData({ ...quoteData, modeloSeleccionado: model });
                }}
                selectedModel={quoteData.modeloSeleccionado}
              />
            )}

            {currentStep === 5 && (
              <Step5Extras
                language={language}
                onUpdate={(data) => {
                  setQuoteData({ ...quoteData, andamio: data.andamio, urgencia72h: data.urgencia, metrosAdicionales: data.metrosAdicionalesCount });
                }}
              />
            )}

            {currentStep === 6 && quoteData.modeloSeleccionado && (
              <Step6Quote
                language={language}
                model={quoteData.modeloSeleccionado}
                precio={{
                  precioEquipo: quoteData.modeloSeleccionado.precio,
                  precioInstalacion,
                  precioAndamio: andamioPrice,
                  precioUrgencia: urgenciaPrice,
                  precioMetrosAdicionales: metrosPrice,
                  ...prices,
                }}
                onSubmit={handleQuoteSubmit}
              />
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4 justify-between max-w-4xl mx-auto">
            <button
              onClick={currentStep === 6 ? handleReset : handlePrevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {currentStep === 6 ? <HomeIcon className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {currentStep === 6 ? t('btn.volverInicio', language) : t('btn.volver', language)}
            </button>

            {currentStep < 6 && (
              <button
                onClick={handleNextStep}
                disabled={loading}
                className="px-8 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {t('btn.siguiente', language)}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer language={language} />
    </>
  );
}
