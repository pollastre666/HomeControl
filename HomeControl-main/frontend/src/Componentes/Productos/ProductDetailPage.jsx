import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Carga diferida de componentes pesados
const Features = lazy(() => import('./Detalles/Features'));
const Specifications = lazy(() => import('./Detalles/Specifications'));
const InstallationTipsToggle = lazy(() => import('./Detalles/InstallationTipsToggle'));
const RequestQuoteButton = lazy(() => import('./Detalles/RequestQuoteButton'));
const RelatedProducts = lazy(() => import('./Detalles/RelatedProducts'));
const CheckoutModal = lazy(() => import('./Detalles/CheckoutModal'));

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Variantes de animación
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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: 0.5, ease: 'easeOut' },
  },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const ProductDetailPage = () => {
  const { componentId } = useParams();
  const [component, setComponent] = useState(null);
  const [category, setCategory] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [compatibilityMessage, setCompatibilityMessage] = useState('');
  const [error, setError] = useState(null);

  // Efecto parallax para el fondo del hero
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const heroY = useTransform(scrollY, [0, 300], [0, 50]);

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
            module = await import('./Estores/estoresData');
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

  // Calcular el porcentaje de stock para la barra de progreso
  const stockPercentage = useMemo(() => {
    if (!component) return 0;
    return Math.min((component.stock / 10) * 100, 100);
  }, [component]);

  if (error) {
    return (
      <div className="text-center text-red-600 py-20 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <p role="alert">{error}</p>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-20 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <p>Cargando... o componente no encontrado</p>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/10 min-h-screen overflow-hidden">
      {/* Fondo dinámico */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 via-amber-50/10 to-transparent dark:from-amber-900/10 dark:via-amber-800/5 dark:to-transparent animate-gradient-x" />
        <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,193,7,0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <g className="particles">
            {[...Array(20)].map((_, i) => (
              <motion.circle
                key={i}
                cx={Math.random() * 100 + '%'}
                cy={Math.random() * 100 + '%'}
                r={Math.random() * 2 + 1}
                fill="rgba(255,193,7,0.3)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [-10, 10] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.2 }}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative h-[450px] sm:h-[500px] lg:h-[600px] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        style={{ opacity: heroOpacity, y: heroY }}
      >
        <motion.div className="relative z-10 max-w-5xl" variants={textVariants}>
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg p-6 sm:p-8 lg:p-12 rounded-3xl border border-amber-200/30 dark:border-amber-900/30 shadow-2xl">
            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight"
              variants={textVariants}
            >
              {component.name}
            </motion.h1>
            <motion.p
              className="mt-4 text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
              variants={textVariants}
            >
              {component.description}
            </motion.p>
            <motion.button
              className="mt-6 bg-amber-600 dark:bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCheckoutOpen(true)}
              aria-label={`Explorar ${component.name}`}
            >
              Explorar Producto
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          className="absolute inset-0 border-4 border-amber-200/20 dark:border-amber-900/20 rounded-3xl animate-pulse-slow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        />
      </motion.section>

      {/* Detalles del Producto */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-200/20 dark:border-gray-700/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Detalles de Precio y Stock */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-600 dark:text-amber-400">
                  ${component.price} USD
                </p>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    Stock: {component.stock} unidades
                  </p>
                  {/* Barra de progreso para el stock */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-amber-600 dark:bg-amber-500 h-2.5 rounded-full"
                      style={{ width: `${stockPercentage}%` }}
                    />
                  </div>
                  {component.stock <= 5 && component.stock > 0 && (
                    <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Últimas unidades
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {component.stock > 0 ? (
                  <motion.button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="bg-amber-600 dark:bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Comprar ${component.name}`}
                  >
                    Comprar Ahora
                  </motion.button>
                ) : (
                  <p className="text-red-600 font-semibold text-base sm:text-lg">Producto agotado</p>
                )}
                <Suspense fallback={<div>Cargando...</div>}>
                  <RequestQuoteButton />
                </Suspense>
              </div>
              {compatibilityMessage && (
                <p className="text-gray-600 dark:text-gray-400 italic text-sm">
                  {compatibilityMessage}
                </p>
              )}
            </div>

            {/* Imagen del Producto */}
            <motion.div
              className="relative overflow-hidden rounded-2xl shadow-lg border border-amber-200/50 dark:border-amber-900/50"
              variants={imageVariants}
              whileHover="hover"
            >
              <img
                src={component.image}
                alt={`Imagen de ${component.name}, un producto de la categoría ${category}`}
                loading="lazy"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Secciones Adicionales */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24 space-y-16 sm:space-y-20">
        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Suspense fallback={<div>Cargando características...</div>}>
            <Features features={component.features} />
          </Suspense>
        </motion.div>
        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Suspense fallback={<div>Cargando especificaciones...</div>}>
            <Specifications specs={component.specs} />
          </Suspense>
        </motion.div>
        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Suspense fallback={<div>Cargando consejos de instalación...</div>}>
            <InstallationTipsToggle tips={component.installationTips} />
          </Suspense>
        </motion.div>
        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Suspense fallback={<div>Cargando productos relacionados...</div>}>
            <RelatedProducts currentId={componentId} category={category} />
          </Suspense>
        </motion.div>
      </div>

      {/* Modal de Checkout */}
      <Suspense fallback={<div>Cargando modal de pago...</div>}>
        <Elements stripe={stripePromise}>
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            component={component}
          />
        </Elements>
      </Suspense>
    </div>
  );
};

export default ProductDetailPage;