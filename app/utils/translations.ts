'use client';

import type { Language } from '@/app/types';

type TranslationKey = string;

interface TranslationDict {
  [key: TranslationKey]: {
    es: string;
    en: string;
    de: string;
    it: string;
    hu: string;
  };
}

const translations: TranslationDict = {
  // Headers
  'app.title': { es: 'Calculadora de presupuestos', en: 'Quote Calculator', de: 'Angebotsrechner', it: 'Calcolatore di preventivi', hu: 'Árajánlat-számológép' },
  'app.step': { es: 'Paso', en: 'Step', de: 'Schritt', it: 'Fase', hu: 'Lépés' },
  'app.of': { es: 'de', en: 'of', de: 'von', it: 'di', hu: 'ból' },
  
  // Paso 1
  'paso1.title': { es: 'Selecciona el servicio que necesitas', en: 'Select the service you need', de: 'Wählen Sie den benötigten Service', it: 'Seleziona il servizio di cui hai bisogno', hu: 'Válassza ki a szükséges szolgáltatást' },
  'paso1.subtitle': { es: 'y calcula tu presupuesto de climatización en Mallorca', en: 'and calculate your air conditioning budget in Mallorca', de: 'und berechnen Sie Ihr Klimatisierungsbudget auf Mallorca', it: 'e calcola il tuo budget di climatizzazione a Maiorca', hu: 'és számítsa ki a Mallorcán lévő légkondicionálási költségvetést' },
  'paso1.sustitucion': { es: 'Sustitución', en: 'Replacement', de: 'Austausch', it: 'Sostituzione', hu: 'Csere' },
  'paso1.sustitucion.desc': { es: 'Sustitución de aire acondicionado en Mallorca', en: 'Replace air conditioning in Mallorca', de: 'Klimaanlage auf Mallorca ersetzen', it: 'Sostituire il condizionatore a Maiorca', hu: 'Légkondicionáló csere Mallorcán' },
  'paso1.instalacion': { es: 'Instalación Nueva', en: 'New Installation', de: 'Neuinstallation', it: 'Nuova installazione', hu: 'Új telepítés' },
  'paso1.instalacion.desc': { es: 'Nueva instalación de aire acondicionado en Mallorca', en: 'New air conditioning installation in Mallorca', de: 'Neue Klimaanlage auf Mallorca', it: 'Nuova installazione di aria condizionata a Maiorca', hu: 'Új légkondicionálás telepítése Mallorcán' },
  'paso1.reparacion': { es: 'Reparación', en: 'Repair', de: 'Reparatur', it: 'Riparazione', hu: 'Javítás' },
  'paso1.reparacion.desc': { es: 'Reparación de aire acondicionado en Mallorca', en: 'Air conditioning repair in Mallorca', de: 'Klimaanlage Reparatur auf Mallorca', it: 'Riparazione del condizionatore a Maiorca', hu: 'Légkondicionáló javítás Mallorcán' },
  'paso1.proyecto': { es: 'Proyecto', en: 'Project', de: 'Projekt', it: 'Progetto', hu: 'Projekt' },
  'paso1.proyecto.desc': { es: 'Petición de proyecto de climatización en Mallorca', en: 'Climate project request in Mallorca', de: 'Klimaprojektanfrage auf Mallorca', it: 'Richiesta di progetto climatico a Maiorca', hu: 'Klímaprojekt-kérelem Mallorcán' },
  
  // Paso 2
  'paso2.title': { es: '¿Qué tipo de aire necesitas?', en: 'What type of air conditioning do you need?', de: 'Welche Art von Klimaanlage benötigen Sie?', it: 'Che tipo di aria condizionata hai bisogno?', hu: 'Milyen típusú légkondicionálásra van szüksége?' },
  'paso2.subtitle': { es: 'Selecciona el sistema que mejor se adapte a tu espacio', en: 'Select the system that best fits your space', de: 'Wählen Sie das System, das am besten zu Ihrem Raum passt', it: 'Seleziona il sistema che si adatta meglio al tuo spazio', hu: 'Válassza ki az Ön helyére legjobban illő rendszert' },
  'tipo.split': { es: 'Split de Pared', en: 'Wall Split', de: 'Wandgerät', it: 'Split a parete', hu: 'Fali split' },
  'tipo.split.badge': { es: '1 estancia', en: '1 room', de: '1 Raum', it: '1 stanza', hu: '1 szoba' },
  'tipo.split.desc': { es: 'Una unidad interior y una exterior', en: 'One indoor and one outdoor unit', de: 'Eine Innen- und eine Außeneinheit', it: 'Un\'unità interna e una esterna', hu: 'Egy beltéri és egy kültéri egység' },
  'tipo.multisplit': { es: 'Multisplit', en: 'Multisplit', de: 'Multisplit', it: 'Multisplit', hu: 'Multisplit' },
  'tipo.multisplit.badge': { es: '2-5 estancias', en: '2-5 rooms', de: '2-5 Räume', it: '2-5 stanze', hu: '2-5 szoba' },
  'tipo.multisplit.desc': { es: 'Una unidad exterior con 2-5 interiores', en: 'One outdoor unit with 2-5 indoor units', de: 'Eine Außeneinheit mit 2-5 Inneneinheiten', it: 'Un\'unità esterna con 2-5 unità interne', hu: 'Egy kültéri egység 2-5 beltéri egységgel' },
  'tipo.conducto': { es: 'Conducto', en: 'Duct', de: 'Kanal', it: 'Canale', hu: 'Csatorna' },
  'tipo.conducto.badge': { es: '1 estancia', en: '1 room', de: '1 Raum', it: '1 stanza', hu: '1 szoba' },
  'tipo.conducto.desc': { es: 'Distribución de aire por conductos', en: 'Air distribution through ducts', de: 'Luftverteilung durch Kanäle', it: 'Distribuzione dell\'aria attraverso i condotti', hu: 'Levegő elosztása csatornákon keresztül' },
  'tipo.casete': { es: 'Casete', en: 'Cassette', de: 'Kassette', it: 'Cassetta', hu: 'Kazetta' },
  'tipo.casete.badge': { es: '1 estancia', en: '1 room', de: '1 Raum', it: '1 stanza', hu: '1 szoba' },
  'tipo.casete.desc': { es: 'Instalada en techo o pared', en: 'Installed in ceiling or wall', de: 'In Decke oder Wand eingebaut', it: 'Installato in soffitto o parete', hu: 'Mennyezetbe vagy falba szerelve' },
  'tipo.suelo-techo': { es: 'Suelo-Techo', en: 'Floor-Ceiling', de: 'Boden-Decke', it: 'Pavimento-Soffitto', hu: 'Padló-mennyezet' },
  'tipo.suelo-techo.badge': { es: '1 estancia', en: '1 room', de: '1 Raum', it: '1 stanza', hu: '1 szoba' },
  'tipo.suelo-techo.desc': { es: 'Una unidad en suelo y techo', en: 'One floor and one ceiling unit', de: 'Eine Boden- und eine Deckeneinheit', it: 'Un\'unità a pavimento e una a soffitto', hu: 'Egy padlói és egy mennyezetei egység' },
  'tipo.twin': { es: 'Twin Suelo-Techo', en: 'Twin Floor-Ceiling', de: 'Twin Boden-Decke', it: 'Twin Pavimento-Soffitto', hu: 'Twin Padló-mennyezet' },
  'tipo.twin.badge': { es: '2-4 estancias', en: '2-4 rooms', de: '2-4 Räume', it: '2-4 stanze', hu: '2-4 szoba' },
  'tipo.twin.desc': { es: 'Dos unidades con hasta 4 espacios', en: 'Two units with up to 4 spaces', de: 'Zwei Einheiten mit bis zu 4 Räumen', it: 'Due unità con fino a 4 spazi', hu: 'Két egység legfeljebb 4 térrel' },
  'tipo.multi-conducto': { es: 'Multiconducto', en: 'Multi Duct', de: 'Multi Kanal', it: 'Multi Canale', hu: 'Multi csatorna' },
  'tipo.multi-conducto.badge': { es: '2 estancias', en: '2 rooms', de: '2 Räume', it: '2 stanze', hu: '2 szoba' },
  'tipo.multi-conducto.desc': { es: 'Múltiples conductos para distribución', en: 'Multiple ducts for distribution', de: 'Mehrere Kanäle zur Verteilung', it: 'Più condotti per la distribuzione', hu: 'Több csatorna az elosztáshoz' },
  'tipo.multi-casete': { es: 'Multicasete', en: 'Multi Cassette', de: 'Multi Kassette', it: 'Multi Cassetta', hu: 'Multi kazetta' },
  'tipo.multi-casete.badge': { es: '2-4 estancias', en: '2-4 rooms', de: '2-4 Räume', it: '2-4 stanze', hu: '2-4 szoba' },
  'tipo.multi-casete.desc': { es: 'Múltiples unidades casete', en: 'Multiple cassette units', de: 'Mehrere Kassetteneinheiten', it: 'Più unità cassetta', hu: 'Több kazetta egység' },
  
  // Paso 3
  'paso3.title': { es: 'Características del espacio', en: 'Space characteristics', de: 'Raummerkmale', it: 'Caratteristiche dello spazio', hu: 'Tér jellemzői' },
  'paso3.subtitle': { es: 'Configura las dimensiones para calcular las frigorías necesarias', en: 'Configure the dimensions to calculate the required cooling capacity', de: 'Konfigurieren Sie die Abmessungen, um die erforderliche Kühlleistung zu berechnen', it: 'Configura le dimensioni per calcolare la capacità di raffreddamento richiesta', hu: 'Konfigurálja a méreteket a szükséges hűtőteljesítmény kiszámításához' },
  'paso3.metros': { es: 'Metros cuadrados', en: 'Square meters', de: 'Quadratmeter', it: 'Metri quadri', hu: 'Négyzetméter' },
  'paso3.altura': { es: 'Altura del techo', en: 'Ceiling height', de: 'Deckenhöhe', it: 'Altezza del soffitto', hu: 'Mennyezet magassága' },
  'paso3.altura.baja': { es: '2,5 m (normal)', en: '2.5 m (normal)', de: '2,5 m (normal)', it: '2,5 m (normale)', hu: '2,5 m (normál)' },
  'paso3.altura.media': { es: '3 m', en: '3 m', de: '3 m', it: '3 m', hu: '3 m' },
  'paso3.altura.alta': { es: '4 m', en: '4 m', de: '4 m', it: '4 m', hu: '4 m' },
  'paso3.exposicion': { es: 'Exposición solar', en: 'Sun exposure', de: 'Sonneneinstrahlung', it: 'Esposizione al sole', hu: 'Napsugárzás' },
  'paso3.exposicion.normal': { es: 'Normal', en: 'Normal', de: 'Normal', it: 'Normale', hu: 'Normál' },
  'paso3.exposicion.soleado': { es: 'Muy soleado', en: 'Very sunny', de: 'Sehr sonnig', it: 'Molto soleggiato', hu: 'Nagyon napsütötte' },
  'paso3.frigoriasCalculadas': { es: 'Frigorías necesarias', en: 'Required cooling capacity', de: 'Erforderliche Kühlleistung', it: 'Capacità di raffreddamento richiesta', hu: 'Szükséges hűtőteljesítmény' },
  'paso3.continuar': { es: 'Continuar', en: 'Continue', de: 'Fortfahren', it: 'Continua', hu: 'Folytatás' },
  
  // Paso 4
  'paso4.title': { es: 'Modelos recomendados', en: 'Recommended models', de: 'Empfohlene Modelle', it: 'Modelli consigliati', hu: 'Ajánlott modellek' },
  'paso4.subtitle': { es: 'Te mostramos las opciones que mejor encajan', en: 'We show you the best options', de: 'Wir zeigen Ihnen die besten Optionen', it: 'Vi mostriamo le opzioni migliori', hu: 'Megmutatjuk a legjobb lehetőségeket' },
  'paso4.badge.mejor': { es: 'La mejor opción', en: 'Best choice', de: 'Beste Wahl', it: 'La scelta migliore', hu: 'Legjobb választás' },
  'paso4.badge.garantia': { es: 'Con más garantía', en: 'More warranty', de: 'Mehr Garantie', it: 'Più garanzia', hu: 'Több garancia' },
  'paso4.badge.precio': { es: 'Relación calidad precio', en: 'Best value', de: 'Bestes Preis-Leistungs-Verhältnis', it: 'Miglior rapporto qualità-prezzo', hu: 'Legjobb ár-érték arány' },
  
  // Paso 5
  'paso5.title': { es: 'Extras de instalación', en: 'Installation extras', de: 'Installationszubehör', it: 'Extra di installazione', hu: 'Telepítési extrák' },
  'paso5.subtitle': { es: 'Selecciona los extras que necesitas', en: 'Select the extras you need', de: 'Wählen Sie das benötigte Zubehör', it: 'Seleziona gli extra che ti servono', hu: 'Válassza ki a szükséges extrák' },
  'paso5.metros': { es: 'Metros adicionales', en: 'Additional meters', de: 'Zusätzliche Meter', it: 'Metri aggiuntivi', hu: 'További méterek' },
  'paso5.metros.desc': { es: 'Hasta 15 metros adicionales', en: 'Up to 15 additional meters', de: 'Bis zu 15 zusätzliche Meter', it: 'Fino a 15 metri aggiuntivi', hu: 'Legfeljebb 15 további méter' },
  'paso5.metros.precio': { es: '80€ primer metro + 60€ siguientes', en: '€80 first meter + €60 following', de: '80€ erstes Meter + 60€ folgende', it: '€80 primo metro + €60 successivi', hu: '80€ első méter + 60€ következő' },
  'paso5.andamio': { es: 'Andamio', en: 'Scaffolding', de: 'Gerüst', it: 'Ponteggio', hu: 'Állványzat' },
  'paso5.andamio.desc': { es: 'Para alturas >3m o difícil acceso', en: 'For heights >3m or difficult access', de: 'Für Höhen >3m oder schwierigen Zugang', it: 'Per altezze >3m o accesso difficile', hu: '>3m magassághoz vagy nehéz hozzáféréshez' },
  'paso5.andamio.precio': { es: '120€', en: '€120', de: '120€', it: '120€', hu: '120€' },
  'paso5.urgencia': { es: 'Instalación urgente', en: 'Urgent installation', de: 'Dringende Installation', it: 'Installazione urgente', hu: 'Sürgős telepítés' },
  'paso5.urgencia.desc': { es: 'Menos de 72 horas desde la recepción', en: 'Less than 72 hours from receipt', de: 'Weniger als 72 Stunden nach Erhalt', it: 'Meno di 72 ore dal ricevimento', hu: 'Kevesebb mint 72 óra a bevételezéstől' },
  'paso5.urgencia.alta': { es: '250€ (temporada alta)', en: '€250 (high season)', de: '250€ (Hochsaison)', it: '250€ (alta stagione)', hu: '250€ (csúcsszezon)' },
  'paso5.urgencia.baja': { es: '150€ (temporada baja)', en: '€150 (low season)', de: '150€ (Nebensaison)', it: '150€ (bassa stagione)', hu: '150€ (alacsony szezon)' },
  'paso5.continuar': { es: 'Continuar al presupuesto', en: 'Continue to quote', de: 'Zum Angebot fortfahren', it: 'Continua al preventivo', hu: 'Folytatás az árajánlathoz' },
  
  // Paso 6
  'paso6.title': { es: 'Presupuesto final', en: 'Final quote', de: 'Endgültiges Angebot', it: 'Preventivo finale', hu: 'Végső árajánlat' },
  'paso6.resumen': { es: 'Resumen del presupuesto', en: 'Quote summary', de: 'Angebotszusammenfassung', it: 'Riepilogo del preventivo', hu: 'Árajánlat összefoglalása' },
  'paso6.suministro': { es: 'Suministro e instalación de', en: 'Supply and installation of', de: 'Lieferung und Installation von', it: 'Fornitura e installazione di', hu: 'Szállítás és telepítés' },
  'paso6.instalaIncluyeluye': { es: 'Incluye instalación', en: 'Includes installation', de: 'Einschließlich Installation', it: 'Include installazione', hu: 'Telepítés tartalmaz' },
  'paso6.subtotal': { es: 'Subtotal', en: 'Subtotal', de: 'Zwischensumme', it: 'Subtotale', hu: 'Részösszeg' },
  'paso6.iva': { es: 'IVA (21%)', en: 'VAT (21%)', de: 'MwSt. (21%)', it: 'IVA (21%)', hu: 'ÁFA (21%)' },
  'paso6.descuento': { es: 'Descuento', en: 'Discount', de: 'Rabatt', it: 'Sconto', hu: 'Kedvezmény' },
  'paso6.total': { es: 'Total', en: 'Total', de: 'Insgesamt', it: 'Totale', hu: 'Összesen' },
  'paso6.oferta': { es: 'de descuento durante', en: 'discount for', de: 'Rabatt für', it: 'sconto per', hu: 'kedvezmény' },
  'paso6.contrata': { es: 'Si contratas en los próximos', en: 'If you contract in the next', de: 'Wenn Sie in den nächsten buchen', it: 'Se contratti nei prossimi', hu: 'Ha a következő időszakban szerződtet' },
  'paso6.otrasOpciones': { es: 'Otras opciones compatibles', en: 'Other compatible options', de: 'Andere kompatible Optionen', it: 'Altre opzioni compatibili', hu: 'Egyéb kompatibilis opciók' },
  'paso6.formulario': { es: 'Datos del cliente', en: 'Customer details', de: 'Kundendetails', it: 'Dettagli cliente', hu: 'Ügyfél adatai' },
  'paso6.nombre': { es: 'Nombre completo', en: 'Full name', de: 'Vollständiger Name', it: 'Nome completo', hu: 'Teljes név' },
  'paso6.email': { es: 'Email', en: 'Email', de: 'E-Mail', it: 'Email', hu: 'Email' },
  'paso6.telefono': { es: 'Teléfono', en: 'Phone', de: 'Telefon', it: 'Telefono', hu: 'Telefonszám' },
  'paso6.direccion': { es: 'Dirección completa', en: 'Full address', de: 'Vollständige Adresse', it: 'Indirizzo completo', hu: 'Teljes cím' },
  'paso6.codigoPostal': { es: 'Código postal', en: 'Postal code', de: 'Postleitzahl', it: 'Codice postale', hu: 'Irányítószám' },
  'paso6.soloMallorca': { es: 'Solo trabajamos en Mallorca', en: 'We only work in Mallorca', de: 'Wir arbeiten nur auf Mallorca', it: 'Lavoriamo solo a Maiorca', hu: 'Csak Mallorcán dolgozunk' },
  'paso6.validoMallorca': { es: 'Código postal válido', en: 'Valid postal code', de: 'Gültige Postleitzahl', it: 'Codice postale valido', hu: 'Érvényes irányítószám' },
  'paso6.invalidoMallorca': { es: 'Lo sentimos, solo realizamos instalaciones en Mallorca', en: 'Sorry, we only install in Mallorca', de: 'Entschuldigung, wir installieren nur auf Mallorca', it: 'Scusa, installiamo solo a Maiorca', hu: 'Sajnos csak Mallorcán telepítünk' },
  'paso6.descargar': { es: 'Descargar ficha técnica', en: 'Download technical sheet', de: 'Technisches Datenblatt herunterladen', it: 'Scarica scheda tecnica', hu: 'Letöltés technikai adatlap' },
  'paso6.pagar': { es: 'Pagar', en: 'Pay', de: 'Zahlen', it: 'Paga', hu: 'Fizetés' },
  'paso6.tarjeta': { es: 'Pagar con tarjeta', en: 'Pay with card', de: 'Mit Karte bezahlen', it: 'Paga con carta', hu: 'Fizetés kártyával' },
  'paso6.paypal': { es: 'Pagar con PayPal', en: 'Pay with PayPal', de: 'Mit PayPal bezahlen', it: 'Paga con PayPal', hu: 'Fizetés PayPal-lal' },
  'paso6.applepay': { es: 'Pagar con Apple Pay', en: 'Pay with Apple Pay', de: 'Mit Apple Pay bezahlen', it: 'Paga con Apple Pay', hu: 'Fizetés Apple Pay-vel' },
  
  // Reparación
  'reparacion.title': { es: 'Presupuesto de reparación', en: 'Repair Quote', de: 'Reparaturangebot', it: 'Preventivo di riparazione', hu: 'Javítási árajánlat' },
  'reparacion.subtitle': { es: 'Localización de avería y reparación en Mallorca', en: 'Fault diagnosis and repair in Mallorca', de: 'Fehlerdiagnose und Reparatur auf Mallorca', it: 'Diagnosi dei guasti e riparazione a Maiorca', hu: 'Meghibásodás diagnosztika és javítás Mallorcán' },
  'reparacion.total': { es: 'Total', en: 'Total', de: 'Insgesamt', it: 'Totale', hu: 'Összesen' },
  'reparacion.empresa': { es: 'Su instalación la va a llevar a cabo', en: 'Your installation will be carried out by', de: 'Ihre Installation wird durchgeführt von', it: 'La vostra installazione sarà eseguita da', hu: 'Az Ön telepítését a' },
  'reparacion.aviso': { es: 'Solo trabajamos en Mallorca', en: 'We only work in Mallorca', de: 'Wir arbeiten nur auf Mallorca', it: 'Lavoriamo solo a Maiorca', hu: 'Csak Mallorcán dolgozunk' },
  'reparacion.descuento': { es: 'de descuento durante 5 minutos', en: 'discount for 5 minutes', de: 'Rabatt für 5 Minuten', it: 'sconto per 5 minuti', hu: '5 percig tartó kedvezmény' },
  'reparacion.contratar': { es: 'Si contratas en los próximos 04:30', en: 'If you book in the next 04:30', de: 'Wenn Sie in den nächsten 04:30 buchen', it: 'Se contratti nei prossimi 04:30', hu: 'Ha a következő 04:30 alatt szerződtet' },
  'reparacion.pagar': { es: 'Pagar con tarjeta', en: 'Pay with card', de: 'Mit Karte bezahlen', it: 'Paga con carta', hu: 'Fizetés kártyával' },
  'reparacion.paypal': { es: 'Pagar con PayPal', en: 'Pay with PayPal', de: 'Mit PayPal bezahlen', it: 'Paga con PayPal', hu: 'Fizetés PayPal-lal' },
  'reparacion.applepay': { es: 'Pagar con Apple Pay', en: 'Pay with Apple Pay', de: 'Mit Apple Pay bezahlen', it: 'Paga con Apple Pay', hu: 'Fizetés Apple Pay-vel' },
  'reparacion.nombre': { es: 'Nombre', en: 'Name', de: 'Name', it: 'Nome', hu: 'Név' },
  'reparacion.telefono': { es: 'Teléfono', en: 'Phone', de: 'Telefon', it: 'Telefono', hu: 'Telefonszám' },
  'reparacion.codigoPostal': { es: 'Código postal', en: 'Postal code', de: 'Postleitzahl', it: 'Codice postale', hu: 'Irányítószám' },
  'reparacion.direccion': { es: 'Dirección', en: 'Address', de: 'Adresse', it: 'Indirizzo', hu: 'Cím' },
  'reparacion.email': { es: 'Email', en: 'Email', de: 'E-Mail', it: 'Email', hu: 'Email' },
  
  // Proyecto
  'proyecto.title': { es: 'Cuéntanos tu proyecto', en: 'Tell us about your project', de: 'Erzählen Sie uns von Ihrem Projekt', it: 'Raccontaci il tuo progetto', hu: 'Mesélj el a projekted' },
  'proyecto.tipoProyecto': { es: 'Tipo de proyecto', en: 'Project type', de: 'Projekttyp', it: 'Tipo di progetto', hu: 'Projektípus' },
  'proyecto.aeroTermia': { es: 'Aerotermia', en: 'Air source heat pump', de: 'Luftwärmepumpe', it: 'Pompa di calore ad aria', hu: 'Levegős hőszivattyú' },
  'proyecto.multiconducor': { es: 'Multiconducor', en: 'Multiduct', de: 'Mehrkanal', it: 'Multidotto', hu: 'Multicsatorna' },
  'proyecto.evaporativo': { es: 'Evaporativo', en: 'Evaporative', de: 'Verdunstung', it: 'Evaporativo', hu: 'Evaporatív' },
  'proyecto.vrf': { es: 'VRF', en: 'VRF', de: 'VRF', it: 'VRF', hu: 'VRF' },
  'proyecto.chiller': { es: 'Chiller', en: 'Chiller', de: 'Chiller', it: 'Chiller', hu: 'Chiller' },
  'proyecto.otro': { es: 'Otro', en: 'Other', de: 'Sonstiges', it: 'Altro', hu: 'Egyéb' },
  'proyecto.tieneIngeniero': { es: '¿Tienes proyecto de un ingeniero o arquitecto?', en: 'Do you have a project from an engineer or architect?', de: 'Haben Sie ein Projekt von einem Ingenieur oder Architekten?', it: 'Hai un progetto di un ingegnere o architetto?', hu: 'Van-e mérnök vagy építész projektje?' },
  'proyecto.si': { es: 'Sí', en: 'Yes', de: 'Ja', it: 'Sì', hu: 'Igen' },
  'proyecto.no': { es: 'No', en: 'No', de: 'Nein', it: 'No', hu: 'Nem' },
  'proyecto.codigoPostal': { es: 'Código postal', en: 'Postal code', de: 'Postleitzahl', it: 'Codice postale', hu: 'Irányítószám' },
  'proyecto.nombre': { es: 'Nombre', en: 'Name', de: 'Name', it: 'Nome', hu: 'Név' },
  'proyecto.apellido': { es: 'Apellido', en: 'Last name', de: 'Nachname', it: 'Cognome', hu: 'Vezetéknév' },
  'proyecto.telefono': { es: 'Teléfono', en: 'Phone', de: 'Telefon', it: 'Telefono', hu: 'Telefonszám' },
  'proyecto.direccion': { es: 'Dirección', en: 'Address', de: 'Adresse', it: 'Indirizzo', hu: 'Cím' },
  'proyecto.email': { es: 'Email', en: 'Email', de: 'E-Mail', it: 'Email', hu: 'Email' },
  'proyecto.comentarios': { es: 'Comentarios', en: 'Comments', de: 'Kommentare', it: 'Commenti', hu: 'Megjegyzések' },
  'proyecto.subirArchivo': { es: 'Subir archivo', en: 'Upload file', de: 'Datei hochladen', it: 'Carica file', hu: 'Fájl feltöltése' },
  'proyecto.soloMallorca': { es: 'Servicio de climatización disponible en Mallorca', en: 'Air conditioning service available in Mallorca', de: 'Klimatisierungsservice auf Mallorca verfügbar', it: 'Servizio di climatizzazione disponibile a Maiorca', hu: 'Légkondicionálási szolgáltatás Mallorcán elérhető' },
  'proyecto.enviar': { es: 'Enviar solicitud', en: 'Submit request', de: 'Anfrage absenden', it: 'Invia richiesta', hu: 'Kérelem beküldése' },

  // Botones generales
  'btn.volver': { es: 'Volver', en: 'Back', de: 'Zurück', it: 'Indietro', hu: 'Vissza' },
  'btn.volverInicio': { es: 'Volver al inicio', en: 'Back to start', de: 'Zurück zum Anfang', it: 'Torna all\'inizio', hu: 'Vissza az elejére' },
  'btn.siguiente': { es: 'Siguiente', en: 'Next', de: 'Weiter', it: 'Avanti', hu: 'Tovább' },
};

export function t(key: TranslationKey, language: Language): string {
  return translations[key]?.[language] ?? translations[key]?.['es'] ?? key;
}

export function getTranslations(language: Language) {
  return (key: TranslationKey) => t(key, language);
}