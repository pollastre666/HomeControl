import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Features from './Detalles/Features';
import Specifications from './Detalles/Specifications';
import InstallationTipsToggle from './Detalles/InstallationTipsToggle';
import RequestQuoteButton from './Detalles/RequestQuoteButton';
import RelatedProducts from './Detalles/RelatedProducts';
import CheckoutModal from './Detalles/CheckoutModal';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Animation variants
const heroVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, delay: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } },
};

const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.5 } },
  hover: { scale: 1.03, transition: { duration: 0.3 } },
};

const ProductDetailPage = () => {
  const { componentId } = useParams();
  const [component, setComponent] = useState(null);
  const [category, setCategory] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [compatibilityMessage, setCompatibilityMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const determineCategory = async () => {
      console.log('Determining category for componentId:', componentId);
      const categoryMap = {
        lamasAluminio: 'persianas',
        cajonPVC: 'persianas',
        ejeAcero: 'persianas',
        motorSmart: 'persianas',
        guiasLaterales: 'persianas',
        controlRemoto: 'persianas',
        tejidoLigero: 'estores',
        tuboAluminio: 'estores',
        motorEstores: 'estores',
        rieles: 'estores',
        controlEstores: 'estores',
        contrapeso: 'estores',
        'central-unit': 'automation-hub',
        'connectivity-module': 'automation-hub',
      };

      const detectedCategory = categoryMap[componentId] || 'unknown';
      setCategory(detectedCategory);
      console.log('Detected category:', detectedCategory);

      try {
        let module;
        switch (detectedCategory) {
          case 'persianas':
            console.log('Importing ./Persianas/persianasData');
            module = await import('./Persianas/persianasData');
            break;
          case 'estores':
            console.log('Importing ./Estores/estoresData');
            try {
              module = await import('./Estores/estoresData');
            } catch (importError) {
              console.error('Failed to import estoresData:', importError);
              module = { componentData: {}, getCompatibilityMessage: () => '' };
            }
            break;
          case 'automation-hub':
            console.log('Importing ./Automatizacion/automationHubData');
            module = await import('./Automatizacion/automationHubData');
            break;
          default:
            throw new Error(`Categoría no soportada: ${detectedCategory}`);
        }
        console.log('Module loaded:', module);

        const componentData = module.componentData?.[componentId];
        if (!componentData) {
          throw new Error(`Componente ${componentId} no encontrado en ${detectedCategory}`);
        }
        setComponent(componentData);
        if (module.getCompatibilityMessage) {
          setCompatibilityMessage(module.getCompatibilityMessage(componentId));
        }
      } catch (err) {
        console.error('Error loading component data:', err);
        setError(err.message);
        setComponent(null);
      }
    };

    determineCategory();
  }, [componentId]);

  if (error) {
    return (
      <div className="text-center text-red-600 py-20 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!component) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-20 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        Cargando... o componente no encontrado
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/10 min-h-screen overflow-hidden">
      {/* Dynamic Background with Particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 via-amber-50/10 to-transparent dark:from-amber-900/10 dark:via-amber-800/5 dark:to-transparent animate-gradient-x" />
        <svg className="absolute inset-0 w-full h-full opacity-15 dark:opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,193,7,0.05)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <g className="particles">
            {[...Array(25)].map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 100 + '%'}
                cy={Math.random() * 100 + '%'}
                r={Math.random() * 3 + 1}
                fill="rgba(255,193,7,0.25)"
                className="animate-float"
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Enhanced Hero Section */}
      <motion.section
        className="relative h-[400px] sm:h-[450px] lg:h-[500px] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <motion.div className="relative z-10 max-w-5xl" variants={textVariants}>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-6 sm:p-8 lg:p-10 rounded-3xl border-2 border-amber-200/50 dark:border-amber-900/50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-amber-700 dark:text-amber-300 drop-shadow-lg tracking-wide leading-tight"
              variants={textVariants}
            >
              {component.name}
            </motion.h1>
            <motion.p
              className="mt-4 sm:mt-6 text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto drop-shadow-md leading-relaxed"
              variants={textVariants}
            >
              {component.description}
            </motion.p>
            <motion.button
              className="mt-6 sm:mt-8 inline-block bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCheckoutOpen(true)}
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle, rgba(255,193,7,0.2), transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 font-semibold text-base sm:text-lg">Explorar Producto</span>
            </motion.button>
          </div>
        </motion.div>
        <div className="absolute inset-0 border-4 border-[rgba(255,193,7,0.1)] dark:border-[rgba(255,193,7,0.05)] rounded-3xl overflow-hidden shadow-[0_0_15px_rgba(255,193,7,0.1)] animate-pulse-slow" />
      </motion.section>

      {/* Product Details with Image on Right */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-200/20 dark:border-gray-700/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Product Info (Left) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-600 dark:text-amber-400 drop-shadow-md">
                  ${component.price} USD
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
                    Stock: {component.stock} unidades
                  </p>
                  {component.stock <= 5 && component.stock > 0 && (
                    <span className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md animate-pulse-slow">
                      Últimas unidades
                    </span>
                  )}
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < Math.ceil((component.stock / 10) * 5) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {component.stock > 0 ? (
                  <motion.button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="relative bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="absolute inset-0 bg-[radial-gradient(circle, rgba(255,193,7,0.2), transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 font-semibold text-base sm:text-lg">Comprar Ahora</span>
                  </motion.button>
                ) : (
                  <p className="text-red-600 font-semibold text-lg sm:text-xl">Producto agotado</p>
                )}
                <RequestQuoteButton />
              </div>
              {compatibilityMessage && (
                <p className="text-gray-600 dark:text-gray-400 italic text-sm sm:text-base">
                  {compatibilityMessage}
                </p>
              )}
            </div>

            {/* Product Image (Right) */}
            <motion.div
              className="relative overflow-hidden rounded-2xl shadow-xl border-4 border-amber-200/50 dark:border-amber-900/50"
              variants={imageVariants}
              whileHover="hover"
            >
              <div className="relative w-full h-64 sm:h-80 md:h-96">
                <img
                  src={component.image}
                  alt={component.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 dark:from-amber-900/10 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right, rgba(255,193,7,0.15), transparent)]" />
                <div className="absolute inset-0 animate-glow" style={{ boxShadow: '0 0 15px rgba(255,193,7,0.3)' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Additional Sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24 space-y-16 sm:space-y-20">
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <Features features={component.features} />
        </motion.div>
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <Specifications specs={component.specs} />
        </motion.div>
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <InstallationTipsToggle tips={component.installationTips} />
        </motion.div>
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <RelatedProducts currentId={componentId} category={category} />
        </motion.div>
      </div>

      {/* Checkout Modal with Stripe Elements */}
      <Elements stripe={stripePromise}>
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          component={component}
        />
      </Elements>
    </div>
  );
};

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
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 8s ease-in-out infinite;
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 10px rgba(255,193,7,0.2); }
    50% { box-shadow: 0 0 25px rgba(255,193,7,0.5); }
  }
  .animate-glow {
    animation: glow 5s ease-in-out infinite;
  }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default ProductDetailPage;