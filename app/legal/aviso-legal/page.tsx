import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Aviso Legal · ClimaClicks',
  description: 'Aviso legal y condiciones de uso del sitio web de ClimaClicks — Manteniments Costa Nord S.L.',
};

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-card p-8 md:p-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8">Aviso legal</h1>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-5">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Datos identificativos</h2>
            <p>
              De conformidad con lo dispuesto en el artículo 10 de la Ley 34/2002 de Servicios de la
              Sociedad de la Información y Comercio Electrónico, se informa al usuario de los siguientes
              datos:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Titular:</strong> Manteniments Costa Nord S.L.</li>
              <li><strong>Domicilio social:</strong> Av. Golf 23, Bajo Izquierda, 07458 Can Picafort, Illes Balears, España</li>
              <li><strong>Teléfono:</strong> 657 12 94 74</li>
              <li><strong>Email:</strong> contabilidad@grupocostanord.com</li>
              <li><strong>Sitio web:</strong> www.mantenimentscostanord.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Objeto</h2>
            <p>
              El presente aviso legal regula el uso del sitio web de la calculadora de presupuestos
              ClimaClicks, propiedad de Manteniments Costa Nord S.L. El acceso y/o uso del sitio web
              atribuye la condición de usuario, que acepta, desde dicho acceso y/o uso, las
              condiciones generales aquí reflejadas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Condiciones de uso</h2>
            <p>
              El usuario se compromete a hacer un uso adecuado de los contenidos y servicios ofrecidos
              a través del sitio web y a no emplearlos para incurrir en actividades ilícitas o
              contrarias a la buena fe y al ordenamiento jurídico.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Propiedad intelectual</h2>
            <p>
              Todos los contenidos del sitio web (textos, fotografías, gráficos, imágenes, iconos,
              tecnología, software, enlaces y demás contenidos audiovisuales o sonoros, así como su
              diseño gráfico y códigos fuente) son propiedad intelectual de Manteniments Costa Nord
              S.L. o de terceros, sin que puedan entenderse cedidos al usuario ninguno de los
              derechos de explotación reconocidos por la normativa vigente en materia de propiedad
              intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">5. Modificaciones</h2>
            <p>
              Manteniments Costa Nord S.L. se reserva el derecho de efectuar, sin previo aviso, las
              modificaciones que considere oportunas en su sitio web, pudiendo cambiar, suprimir o
              añadir tanto los contenidos y servicios que se presten a través de la misma como la
              forma en la que éstos aparezcan presentados o localizados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">6. Legislación aplicable</h2>
            <p>
              La relación entre Manteniments Costa Nord S.L. y el usuario se regirá por la normativa
              española vigente. Ambas partes se someten, para la resolución de las controversias,
              a los Juzgados y Tribunales de Palma de Mallorca.
            </p>
          </section>

          <p className="text-sm text-slate-500 mt-8">Última actualización: 2026</p>
        </div>
      </div>
    </main>
  );
}
