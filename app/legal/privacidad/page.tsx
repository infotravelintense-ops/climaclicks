import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad · ClimaClicks',
  description: 'Política de privacidad y tratamiento de datos personales de ClimaClicks — Manteniments Costa Nord S.L.',
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-card p-8 md:p-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8">Política de privacidad</h1>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-5">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Responsable del tratamiento</h2>
            <p>
              El responsable del tratamiento de los datos personales recogidos a través de este
              sitio web es <strong>Manteniments Costa Nord S.L.</strong>, con domicilio en Av. Golf 23,
              Bajo Izquierda, 07458 Can Picafort, Illes Balears, España. Puede ponerse en contacto
              con nosotros en <strong>contabilidad@grupocostanord.com</strong> o en el teléfono
              <strong> 657 12 94 74</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Finalidad del tratamiento</h2>
            <p>
              Los datos personales facilitados se tratarán con las siguientes finalidades:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Elaborar el presupuesto de climatización solicitado.</li>
              <li>Contactar al usuario para concretar fecha de instalación o aclarar dudas técnicas.</li>
              <li>Enviar, si procede, documentación técnica y facturas.</li>
              <li>Cumplir con las obligaciones legales aplicables.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Legitimación</h2>
            <p>
              La base legal para el tratamiento de los datos es la ejecución de un contrato o la
              aplicación de medidas precontractuales a solicitud del interesado (elaboración del
              presupuesto), así como el consentimiento libremente otorgado por el usuario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Conservación de los datos</h2>
            <p>
              Los datos se conservarán durante el tiempo necesario para cumplir con la finalidad para
              la que se recabaron y para determinar las posibles responsabilidades derivadas de la
              relación comercial. Finalizado este plazo, los datos podrán conservarse debidamente
              bloqueados durante los plazos legales aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">5. Destinatarios</h2>
            <p>
              No se cederán los datos a terceros salvo obligación legal, o a proveedores de servicios
              (por ejemplo, pasarelas de pago) estrictamente necesarios para la prestación del
              servicio contratado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">6. Derechos del usuario</h2>
            <p>
              El usuario puede ejercer los derechos de acceso, rectificación, supresión, oposición,
              limitación del tratamiento y portabilidad, así como revocar el consentimiento prestado,
              enviando un escrito a <strong>contabilidad@grupocostanord.com</strong> o a la
              dirección postal indicada en el apartado 1. Asimismo, podrá presentar una reclamación
              ante la Agencia Española de Protección de Datos (www.aepd.es).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">7. Medidas de seguridad</h2>
            <p>
              Manteniments Costa Nord S.L. ha adoptado los niveles de seguridad de protección de los
              datos personales legalmente requeridos y ha instalado todos los medios y medidas
              técnicas a su alcance para evitar la pérdida, mal uso, alteración, acceso no autorizado
              y robo de los datos facilitados por el usuario.
            </p>
          </section>

          <p className="text-sm text-slate-500 mt-8">Última actualización: 2026</p>
        </div>
      </div>
    </main>
  );
}
