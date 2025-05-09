import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../../hocs/layouts/layout';
import PersianasComponents from './PersianasComponents';

function PersianasIndex() {
  // Scroll to top on component mount for consistent user experience
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        <title>Componentes de Persianas - Innovación y Estilo</title>
        <meta
          name="description"
          content="Explora los componentes esenciales de nuestras persianas motorizadas, diseñados para ofrecer funcionalidad y estilo de vanguardia."
        />
        <meta name="keywords" content="persianas, componentes, motorizadas, hogar inteligente, automatización" />
      </Helmet>

      <Layout>
        <main className="min-h-screen">
          <PersianasComponents
            title="Nuestros Componentes de Persianas"
            description="Conoce los elementos que combinan tecnología avanzada y diseño elegante para transformar tus espacios."
          />
        </main>
      </Layout>
    </>
  );
}

export default PersianasIndex;