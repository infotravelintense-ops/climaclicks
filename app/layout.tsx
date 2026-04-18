import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Calculadora de Presupuestos - ClimaMallorca',
  description: 'Aire acondicionado en Mallorca: presupuesto online en 6 pasos',
  openGraph: {
    title: 'Calculadora de Presupuestos - ClimaMallorca',
    description: 'Aire acondicionado en Mallorca: presupuesto online en 6 pasos',
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
      <body className="bg-yellow-50">
        {children}
      </body>
    </html>
  );
}
