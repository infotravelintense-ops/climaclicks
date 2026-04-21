// Force rebuild v2
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://climaya.adsventas.es'),
  title: 'ClimayaMallorca | Aire acondicionado en Mallorca - Presupuesto online en 6 pasos',
  description:
    'Calcula tu presupuesto de aire acondicionado en Mallorca en 6 pasos: sustitución, instalación, reparación o proyecto. Empresa instaladora autorizada con más de 15 años de experiencia.',
  keywords: [
    'aire acondicionado Mallorca',
    'presupuesto aire acondicionado',
    'instalación aire acondicionado Mallorca',
    'climatización Mallorca',
    'split Mallorca',
    'multisplit Mallorca',
    'reparación aire acondicionado',
    'ClimayaMallorca',
  ],
  openGraph: {
    title: 'ClimayaMallorca | Aire acondicionado en Mallorca',
    description:
      'Presupuesto online en 6 pasos para aire acondicionado en Mallorca. Sustitución, nueva instalación, reparación y proyectos.',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ClimayaMallorca - Aire acondicionado en Mallorca',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClimayaMallorca | Aire acondicionado en Mallorca',
    description: 'Presupuesto online en 6 pasos para aire acondicionado en Mallorca.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 min-h-screen">
        {children}
      </body>
    </html>
  );
}
