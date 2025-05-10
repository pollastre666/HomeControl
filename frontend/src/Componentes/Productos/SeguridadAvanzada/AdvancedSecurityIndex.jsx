import { useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
//import Layout from '../../../hocs/layouts/layout';
import AdvancedSecurityComponents from './AdvancedSecurityComponents';

function AdvancedSecurityIndex() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Detect system dark mode preference (already implemented, retained for context)
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    document.documentElement.classList.toggle('dark', darkModeMediaQuery.matches);
    const handleChange = (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <>
      <Helmet>
        <title>Componentes de Seguridad Avanzada - Protección Total</title>
        <meta
          name="description"
          content="Descubre los componentes de seguridad avanzada que protegen tu hogar con tecnología de vanguardia."
        />
        <meta name="keywords" content="seguridad avanzada, componentes, cámaras, alarmas, hogar inteligente" />
      </Helmet>


        <main className="min-h-screen">
          <Suspense
            fallback={
              <div className="text-center py-16">
                <div className="animate-pulse text-gray-600 dark:text-gray-300 text-lg">Cargando componentes de seguridad...</div>
              </div>
            }
          >
            <AdvancedSecurityComponents
              title="Nuestros Componentes de Seguridad Avanzada"
              description="Explora los elementos que ofrecen protección total para tu hogar."
            />
          </Suspense>
        </main>

    </>
  );
}

export default AdvancedSecurityIndex;