import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../../hocs/layouts/layout';
import SmartHomeAutomationComponents from './SmartHomeAutomationComponents';

function SmartHomeAutomationIndex() {
  // Scroll to top on component mount for consistent user experience
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        <title>Componentes de Smart Home Automatismos - Confort Inteligente</title>
        <meta
          name="description"
          content="Descubre los componentes de automatismos que transforman tu hogar en un espacio inteligente y cómodo."
        />
        <meta name="keywords" content="smart home, automatismos, componentes, hogar inteligente" />
      </Helmet>

      <Layout>
        <main className="min-h-screen">
          <SmartHomeAutomationComponents
            title="Nuestros Componentes de Smart Home Automatismos"
            description="Explora los elementos que automatizan tu hogar para mayor comodidad."
          />
        </main>
      </Layout>
    </>
  );
}

export default SmartHomeAutomationIndex;