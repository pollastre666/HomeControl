import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../../hocs/layouts/layout';
import EstoresElectricosComponents from './EstoresElectricosComponents';

function EstoresIndex() {
  // Scroll to top on component mount for consistent user experience
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        <title>Componentes de Estores Eléctricos - Innovación y Estilo</title>
        <meta
          name="description"
          content="Explora los componentes esenciales de nuestros estores eléctricos, diseñados para ofrecer funcionalidad y estilo de vanguardia."
        />
        <meta name="keywords" content="estores eléctricos, componentes, motorizados, hogar inteligente, automatización" />
      </Helmet>

      <Layout>
        <main className="min-h-screen">
          <EstoresElectricosComponents
            title="Nuestros Componentes de Estores Eléctricos"
            description="Conoce los elementos que combinan tecnología avanzada y diseño elegante para transformar tus espacios."
          />
        </main>
      </Layout>
    </>
  );
}

export default EstoresIndex;