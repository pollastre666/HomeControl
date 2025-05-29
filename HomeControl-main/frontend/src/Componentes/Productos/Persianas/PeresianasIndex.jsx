import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PersianasComponents from './PersianasComponents';
import PersianasHeroSection from '../ComponetesDeCartas/PersianasHeroSection';

function PersianasIndex() {
  // Scroll to top on component mount
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
          content="Descubre nuestras persianas motorizadas con control inteligente y diseños personalizables, diseñados para transformar tus espacios."
        />
        <meta name="keywords" content="persianas, componentes, motorizadas, hogar inteligente, automatización, diseño" />
      </Helmet>

      <div>
        <main className="min-h-screen pt-16 sm:pt-20 md:pt-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
          <PersianasHeroSection />
          <PersianasComponents
            title="Nuestros Componentes de Persianas"
            description="Conoce los elementos que combinan tecnología avanzada y diseño elegante para transformar tus espacios."
          />
        </main>
      </div>
    </>
  );
}

export default PersianasIndex;