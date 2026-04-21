'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Language, ServiceType, EquipmentType, Equipment } from '@/app/types';
import { t } from '@/app/utils/translations';
import {
  calculatePrice,
  getUrgenciaPrice,
  isHighSeason,
  calculateMetrosAdicionalesPrice,
  BASE_INSTALLATION_PRICE,
  ANDAMIO_PRICE,
} from '@/app/utils/calculations';
import { Header, Footer, WhatsAppButton } from '@/app/_components/header';
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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<Language>('es');
  // Recomendados Giatsu (Sakura / Aroma 3 / Aroma Plus) mostrados en paso 4
  const [recomendados, setRecomendados] = useState<Equipment[]>([]);
  // Otras marcas (INFINITION, HTW) mostradas como alternativas en paso 6
  const [otrasMarcas, setOtrasMarcas] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  const [quoteData, setQuoteData] = useState({
    language: 'es' as Language,
    tipoServicio: null as ServiceType | null,
    tipoEquipo: null as EquipmentType | null,
    estancia: 'Salon',
    metrosCuadrados: 20,
    altura: 2.5,
    exposicionSolar: 1.0,
    frigoriasCalculadas: 2500,
    modeloSeleccionado: null as Equipment | null,
    andamio: false,
    urgencia72h: false,
    metrosAdicionales: 0,
    conduutoUnidadesInteriores: 0,
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
        `/api/equipment?type=${quoteData.tipoEquipo}&frigorias=${quoteData.frigoriasCalculadas}`
      );
      const data = await response.json();
      setRecomendados(data.recomendados || []);
      setOtrasMarcas(data.otrasMarcas || []);
    } catch (error) {
      console.error('Error loading equipment:', error);
      setRecomendados([]);
      setOtrasMarcas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    // Validaciones básicas
    if (currentStep === 1 && !quoteData.tipoServicio) return;
    if (currentStep === 2 && !quoteData.tipoEquipo) return;
    if (currentStep === 4 && !quoteData.modeloSeleccionado) return;

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Avance automático al seleccionar servicio en Paso 1
  const handleServiceSelect = (service: ServiceType) => {
    setQuoteData({ ...quoteData, tipoServicio: service });
    if (service === 'reparacion') {
      router.push('/pago-reparacion');
      return;
    }
    if (service === 'proyecto') {
      router.push('/proyecto');
      return;
    }
    setTimeout(() => {
      setCurrentStep(2);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 250);
  };

  // Avance automático al seleccionar tipo de equipo en Paso 2
  const handleEquipmentSelect = (type: EquipmentType) => {
    setQuoteData({ ...quoteData, tipoEquipo: type });
    setTimeout(() => {
      setCurrentStep(3);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 250);
  };

  // Avance automático al seleccionar modelo en Paso 4
  const handleModelSelect = (model: Equipment) => {
    setQuoteData({ ...quoteData, modeloSeleccionado: model });
    setTimeout(() => {
      setCurrentStep(5);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 250);
  };

  // Selección de alternativa en Paso 6 (intercambio en caliente)
  const handleSelectAlternative = (model: Equipment) => {
    setQuoteData({ ...quoteData, modeloSeleccionado: model });
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setQuoteData({
      language,
      tipoServicio: null,
      tipoEquipo: null,
      estancia: 'Salon',
      metrosCuadrados: 20,
      altura: 2.5,
      exposicionSolar: 1.0,
      frigoriasCalculadas: 2500,
      modeloSeleccionado: null,
      andamio: false,
      urgencia72h: false,
      metrosAdicionales: 0,
      conduutoUnidadesInteriores: 0,
      nombreCliente: '',
      emailCliente: '',
      telefonoCliente: '',
      direccionCliente: '',
      codigoPostalCliente: '',
    });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuoteSubmit = async (formData: any) => {
    try {
      const urgenciaPrice = quoteData.urgencia72h ? getUrgenciaPrice(isHighSeason(new Date())) : 0;
      const andamioPrice = quoteData.andamio ? ANDAMIO_PRICE : 0;
      const metrosPrice = calculateMetrosAdicionalesPrice(quoteData.metrosAdicionales);
      
      // Precios para conductos: 1x1=600€, 2x1=1000€, 3x1=1400€, 4x1=1800€
      const conductoPrecios: Record<number, number> = {
        0: 0, 1: 600, 2: 1000, 3: 1400, 4: 1800,
      };
      const conductoPrice = conductoPrecios[quoteData.conduutoUnidadesInteriores] || 0;

      const prices = calculatePrice(
        quoteData.modeloSeleccionado?.precio || 0,
        BASE_INSTALLATION_PRICE,
        quoteData.andamio,
        andamioPrice,
        quoteData.urgencia72h,
        urgenciaPrice,
        quoteData.metrosAdicionales,
        metrosPrice,
        conductoPrice
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
          conductoUnidadesInteriores: quoteData.conduutoUnidadesInteriores,
          conductoPrice,
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

  const urgenciaPrice = quoteData.urgencia72h ? getUrgenciaPrice(isHighSeason(new Date())) : 0;
  const andamioPrice = quoteData.andamio ? ANDAMIO_PRICE : 0;
  const metrosPrice = calculateMetrosAdicionalesPrice(quoteData.metrosAdicionales);
  
  // Precios para conductos: 1x1=600€, 2x1=1000€, 3x1=1400€, 4x1=1800€
  const conductoPrecios: Record<number, number> = {
    0: 0, 1: 600, 2: 1000, 3: 1400, 4: 1800,
  };
  const conductoPrice = conductoPrecios[quoteData.conduutoUnidadesInteriores] || 0;
  
  const prices = calculatePrice(
    quoteData.modeloSeleccionado?.precio || 0,
    BASE_INSTALLATION_PRICE,
    quoteData.andamio,
    andamioPrice,
    quoteData.urgencia72h,
    urgenciaPrice,
    quoteData.metrosAdicionales,
    metrosPrice,
    conductoPrice
  );

  // Construye lista de alternativas para Paso 6 ordenadas según Canvas:
  //   1) INFINITION (la más económica)
  //   2) HTW (opción alternativa)
  //   3) Aroma 3  (con más garantía)   — sólo si no está ya seleccionada
  //   4) Aroma Plus (la mejor opción) — sólo si no está ya seleccionada
  // Las filas excluyen el modelo que el cliente ha seleccionado en el Paso 4.
  const infinition = otrasMarcas.filter((m) => (m.marca || '').toLowerCase() === 'infinition');
  const htw = otrasMarcas.filter((m) => (m.marca || '').toLowerCase() === 'htw');
  const otrasMarcasRestantes = otrasMarcas.filter((m) => {
    const mk = (m.marca || '').toLowerCase();
    return mk !== 'infinition' && mk !== 'htw';
  });

  // Giatsu: recomendados incluye SAKURA / AR3 / ARPLUS. Filtrar el seleccionado.
  const giatsuFiltrados = recomendados.filter(
    (m) => !quoteData.modeloSeleccionado || m.modelo !== quoteData.modeloSeleccionado.modelo
  );
  // Ordenar: AR3 (con más garantía) antes que ARPLUS (mejor opción)
  const giatsuOrdenados = [...giatsuFiltrados].sort((a, b) => {
    const rank = (modelo: string) => {
      const m = modelo.toUpperCase();
      if (m.includes('SAKU')) return 1;
      if (m.includes('AR3')) return 2;
      if (m.includes('ARPLUS')) return 3;
      return 9;
    };
    return rank(a.modelo) - rank(b.modelo);
  });

  const alternativeModels: Equipment[] = [
    ...infinition,
    ...htw,
    ...otrasMarcasRestantes,
    ...giatsuOrdenados,
  ];

  return (
    <>
      <Header
        language={language}
        currentStep={currentStep}
        stepNames={STEP_NAMES[language]}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          setQuoteData({ ...quoteData, language: lang });
        }}
      />

      <main id="presupuesto" className="min-h-screen pb-16 px-4 scroll-mt-32 pt-6 md:pt-10">
        <div className="max-w-6xl mx-auto">
          {/* Título compacto visible solo en paso 1 */}
          {currentStep === 1 && (
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                Calcula tu presupuesto de{' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  aire acondicionado
                </span>
              </h1>
              <p className="text-slate-600 text-sm md:text-base">
                6 pasos · presupuesto cerrado · sin compromiso
              </p>
            </div>
          )}

          {/* Content area */}
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-10 mb-8">
            {currentStep === 1 && (
              <Step1Service
                language={language}
                onSelectService={handleServiceSelect}
                selectedService={quoteData.tipoServicio}
              />
            )}

            {currentStep === 2 && (
              <Step2Equipment
                language={language}
                onSelectEquipment={handleEquipmentSelect}
                selectedEquipment={quoteData.tipoEquipo}
              />
            )}

            {currentStep === 3 && (
              <Step3Space
                language={language}
                equipmentType={quoteData.tipoEquipo}
                onUpdate={(data) => {
                  setQuoteData({ ...quoteData, ...data });
                }}
              />
            )}

            {currentStep === 4 && (
              <Step4Models
                language={language}
                models={recomendados}
                onSelectModel={handleModelSelect}
                selectedModel={quoteData.modeloSeleccionado}
                frigoriasCalculadas={quoteData.frigoriasCalculadas}
              />
            )}

            {currentStep === 5 && (
              <Step5Extras
                language={language}
                tipoEquipo={quoteData.tipoEquipo}
                onUpdate={(data) => {
                  setQuoteData({
                    ...quoteData,
                    andamio: data.andamio,
                    urgencia72h: data.urgencia,
                    metrosAdicionales: data.metrosAdicionalesCount,
                    conduutoUnidadesInteriores: data.conductoUnidadesInteriores || 0,
                  });
                }}
              />
            )}

            {currentStep === 6 && quoteData.modeloSeleccionado && (
              <Step6Quote
                language={language}
                model={quoteData.modeloSeleccionado}
                serviceType={quoteData.tipoServicio}
                alternativeModels={alternativeModels}
                precio={{
                  precioEquipo: quoteData.modeloSeleccionado.precio,
                  precioInstalacion: BASE_INSTALLATION_PRICE,
                  precioAndamio: andamioPrice,
                  precioUrgencia: urgenciaPrice,
                  precioMetrosAdicionales: metrosPrice,
                  precioConducto: conductoPrice,
                  ...prices,
                }}
                onSubmit={handleQuoteSubmit}
                onSelectAlternative={handleSelectAlternative}
              />
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4 justify-between items-center max-w-4xl mx-auto">
            {currentStep > 1 ? (
              <button
                onClick={currentStep === 6 ? handleReset : handlePrevStep}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-2 shadow-sm"
              >
                {currentStep === 6 ? <HomeIcon className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {currentStep === 6 ? t('btn.volverInicio', language) : t('btn.volver', language)}
              </button>
            ) : (
              <div className="flex-1 text-sm text-gray-400 italic">
                👆 Haz clic en un servicio para avanzar
              </div>
            )}

            {(currentStep === 3 || currentStep === 5) && (
              <button
                onClick={handleNextStep}
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {t('btn.siguiente', language)}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {(currentStep === 2 || currentStep === 4) && (
              <div className="text-sm text-gray-400 italic">
                👆 Selecciona para avanzar automáticamente
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer language={language} />
      <WhatsAppButton />
    </>
  );
}
