import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import EstoresFeatures from '../Detalles/Features';
import EstoresSpecifications from '../Detalles/Specifications';
import InstallationTipsToggle from '../Detalles/InstallationTipsToggle';
import RequestQuoteButton from '../Detalles/RequestQuoteButton';
import RelatedEstoresProducts from '../Detalles/RelatedProducts';
import Breadcrumbs from '../ComponetesDeCartas/Breadcrumbs';
import CheckoutModal from '../Detalles/CheckoutModal';
import * as estoresDataModule from './estoresData';

// Variantes de animación
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.2 } },
};

function EstoresComponentDetail() {
  const { componentId } = useParams();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const module = await import('../Estores/estoresData');
        const componentData = module.componentData[componentId];
        if (!componentData) {
          throw new Error(`Componente ${componentId} no encontrado en estores`);
        }
        setComponent(componentData);
      } catch (err) {
        console.error('Error loading component data:', err);
        setComponent(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [componentId]);

  if (loading) {
    return <div className="text-center text-gray-600 py-16">Cargando...</div>;
  }

  if (!component) {
    return <div className="text-center text-red-600 py-16">Componente no encontrado</div>;
  }

  const getCompatibilityMessage = () => {
    const compatible = estoresDataModule.getCompatibilityMessage(componentId);
    return compatible;
  };

  return (
    <>
      <Helmet>
        <title>{component.name} - Detalles del Componente</title>
        <meta name="description" content={component.description} />
        <meta property="og:title" content={component.name} />
        <meta property="og:description" content={component.description} />
        <meta property="og:image" content={component.image} />
      </Helmet>
      <motion.section
        className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/20 animate-gradient-x" />
          <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,193,7,0.1)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs />

          <Link
            to="/Estores"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 mb-6 transition-colors duration-200"
            aria-label="Volver a la página de estores"
          >
            <ArrowLeft className="mr-2" size={20} />
            Volver a Estores
          </Link>

          <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-amber-700 dark:text-amber-300 mb-4 tracking-wide drop-shadow-md text-center lg:text-left">
                {component.name}
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-prose leading-relaxed text-center lg:text-left">
                {component.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                <p className="text-3xl lg:text-4xl font-extrabold text-amber-600 dark:text-amber-400">
                  ${component.price} USD
                </p>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Stock: {component.stock} unidades
                  </p>
                  {component.stock <= 5 && component.stock > 0 && (
                    <span className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                      Últimas unidades
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {component.stock > 0 ? (
                  <motion.button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="relative bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="absolute inset-0 bg-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 font-semibold text-lg">Comprar Ahora</span>
                  </motion.button>
                ) : (
                  <p className="text-red-600 font-semibold text-lg">Producto agotado</p>
                )}
                <RequestQuoteButton />
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic text-base sm:text-lg">
                {getCompatibilityMessage()}
              </p>
            </div>

            <motion.div
              className="flex-1 relative overflow-hidden rounded-2xl shadow-xl border-4 border-amber-200/40 dark:border-amber-900/40"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-full h-80 sm:h-96">
                <img
                  src={component.image}
                  alt={`${component.name} - Vista previa`}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right, rgba(255,193,7,0.15), transparent)]" />
                <div className="absolute inset-0 animate-glow" style={{ boxShadow: '0 0 20px rgba(255,193,7,0.3)' }} />
              </div>
            </motion.div>
          </div>

          {component.features && <EstoresFeatures features={component.features} />}
          {component.specs && <EstoresSpecifications specs={component.specs} />}
          {component.installationTips && <InstallationTipsToggle tips={component.installationTips} />}
          <RelatedEstoresProducts currentId={componentId} category="estores" />

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl sm:text-3xl font-semibold text-amber-700 dark:text-amber-300 mb-6">
              ¿Tienes alguna pregunta?
            </h3>
            <a
              href="http://localhost:3000/contacto-atencion-cliente"
              className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg relative overflow-hidden group"
              aria-label="Contactar con atención al cliente"
            >
              <span className="absolute inset-0 bg-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 font-semibold text-lg">Contactar con Atención al Cliente</span>
            </a>
          </motion.div>
        </div>
      </motion.section>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        component={component}
      />
    </>
  );
}

// Animaciones CSS personalizadas
const styles = `
  @keyframes gradient-x {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 15s ease infinite;
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 10px rgba(255,193,7,0.2); }
    50% { box-shadow: 0 0 20px rgba(255,193,7,0.4); }
  }
  .animate-glow {
    animation: glow 4s ease-in-out infinite;
  }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default EstoresComponentDetail;