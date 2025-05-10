import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../../hocs/layouts/layout';
import AccessControlComponents from './AccessControlComponents';

function AccessControlIndex() {
  // Scroll to top on component mount for consistent user experience
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        <title>Componentes de Control de Acceso - Seguridad Innovadora</title>
        <meta
          name="description"
          content="Explora los componentes de control de acceso que aseguran la protección de tu hogar con tecnología avanzada."
        />
        <meta name="keywords" content="control de acceso, componentes, seguridad, hogar inteligente" />
      </Helmet>

      <Layout>
        <main className="min-h-screen">
          <AccessControlComponents
            title="Nuestros Componentes de Control de Acceso"
            description="Conoce los elementos que ofrecen acceso seguro y eficiente."
          />
        </main>
      </Layout>
    </>
  );
}

export default AccessControlIndex;