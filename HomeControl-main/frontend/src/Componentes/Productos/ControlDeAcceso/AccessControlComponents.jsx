import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Camera, Bell, Radio, Lock, Smartphone, Mail,
  ChevronRight, SortAsc, SortDesc
} from 'lucide-react';
import { componentData } from './accessControlData';
import CheckoutModal from '../Detalles/CheckoutModal';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: index * 0.1, ease: 'easeOut' },
  }),
};

const cardHoverVariants = {
  initial: { rotateZ: 0, scale: 1 },
  hover: { rotateZ: 3, scale: 1.03, transition: { duration: 0.4 } },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const indicatorVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.2 } },
  pulse: { scale: 1.2, opacity: 0.8, transition: { duration: 0.5, yoyo: Infinity } },
};

const headerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};

// Mapeo de íconos para componentes de control de acceso
const getIconById = (id) => {
  const iconMap = {
    keypad: <Camera size={16} />,
    'rfid-reader': <Bell size={16} />,
    'door-lock': <Radio size={16} />,
    intercom: <Lock size={16} />,
    'mobile-access': <Smartphone size={16} />,
    'security-panel': <Mail size={16} />,
  };
  return iconMap[id] || <ChevronRight size={16} />;
};

const AccessControlComponents = React.memo(({ title = 'Componentes de Control de Acceso', description = 'Protege tu hogar con los mejores componentes de control de acceso.' }) => {
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dynamicComponents = Object.values(componentData).map((product) => ({
          id: product.id,
          name: product.name,
          src: product.image,
          alt: `${product.name} - Vista previa`,
          link: `/components/${product.id}`,
          description: product.description,
          icon: getIconById(product.id),
          stock: product.stock,
        }));
        setComponents(dynamicComponents);
      } catch (err) {
        console.error('Error loading access control data:', err);
        setError('No se pudieron cargar los componentes. Intenta de nuevo más tarde.');
      }
    };
    loadData();
  }, []);

  const sortedComponents = useMemo(() => {
    return [...components].sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [components, sortOrder]);

  const handleBuyNow = (component) => {
    setSelectedComponent(component);
    setIsCheckoutOpen(true);
  };

  if (error) {
    return <div className="text-center text-red-600 py-16">{error}</div>;
  }

  return (
    <>
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-100 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-amber-200/30 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-96 transform-gpu overflow-hidden blur-3xl">
          <div
            className="relative aspect-[1155/678] w-full bg-gradient-to-tr from-amber-300 to-amber-600 opacity-20"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
              {title}
            </h1>
            <p className="mx-auto max-w-xl sm:max-w-2xl text-sm sm:text-base leading-6 text-gray-600 dark:text-gray-300 font-medium">
              {description}
            </p>
          </motion.div>

          <div className="flex justify-end mb-6">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center bg-amber-600 dark:bg-amber-500 text-white dark:text-gray-100 px-4 py-2 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-all duration-200"
            >
              Ordenar {sortOrder === 'asc' ? 'Z-A' : 'A-Z'}
              {sortOrder === 'asc' ? <SortAsc className="ml-2" size={16} /> : <SortDesc className="ml-2" size={16} />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {components.length > 0 ? (
              sortedComponents.map((component, index) => (
                <div key={component.id} className="relative">
                  <motion.div
                    className="relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md transition-all duration-300 h-56 sm:h-64 w-full max-w-xs mx-auto"
                    style={{ perspective: 500 }}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    custom={index}
                    viewport={{ once: true }}
                    whileHover="hover"
                    animate="initial"
                    role="article"
                    aria-labelledby={`component-${component.id}`}
                    onMouseEnter={() => setHoveredComponent(component.id)}
                    onMouseLeave={() => setHoveredComponent(null)}
                  >
                    <Link to={component.link} aria-label={`Explorar ${component.name}`}>
                      <motion.div className="relative w-full h-full group" variants={cardHoverVariants}>
                        <div className="absolute top-3 right-3 z-10 bg-amber-600 dark:bg-amber-500 text-white p-1.5 rounded-full shadow-sm group-hover:bg-amber-700 dark:group-hover:bg-amber-600 transition-colors duration-300">
                          {component.icon}
                        </div>
                        <img
                          src={component.src}
                          alt={component.alt}
                          loading="lazy"
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-gray-900/20 to-transparent transition-opacity duration-300 group-hover:from-gray-900/60" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 id={`component-${component.id}`} className="text-lg sm:text-xl font-bold text-white dark:text-gray-100 text-left mb-1">
                            {component.name}
                          </h3>
                          <AnimatePresence>
                            {hoveredComponent === component.id && (
                              <motion.div
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                              >
                                <motion.p
                                  className="text-xs sm:text-sm text-gray-200 dark:text-gray-300 text-left mb-2"
                                >
                                  {component.description}
                                </motion.p>
                                {component.stock === 0 ? (
                                  <motion.p
                                    className="text-red-600 font-semibold text-sm"
                                  >
                                    Producto agotado
                                  </motion.p>
                                ) : (
                                  <motion.button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleBuyNow(component);
                                    }}
                                    className="bg-amber-600 text-white px-2 py-1 rounded-lg hover:bg-amber-700 transition-colors duration-200 text-xs sm:text-sm font-semibold"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Comprar Ahora
                                  </motion.button>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <AnimatePresence>
                          {hoveredComponent === component.id && (
                            <motion.div
                              className="absolute bottom-4 left-4 w-2 h-2 bg-amber-600 rounded-full"
                              variants={indicatorVariants}
                              initial="hidden"
                              animate={['visible', 'pulse']}
                            />
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  </motion.div>
                  <div className="relative w-full mt-2">
                    <div className="absolute inset-x-0 h-6 bg-gradient-to-r from-amber-200/50 via-amber-400/70 to-amber-200/50 dark:from-amber-700/50 dark:via-amber-900/70 dark:to-amber-700/50 shadow-md rounded-sm flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-medium text-white dark:text-gray-100 tracking-wide">
                        {component.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 py-16">Cargando componentes...</div>
            )}
          </div>
        </div>
      </section>

      {/* Modal de Checkout */}
      {CheckoutModal && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setSelectedComponent(null);
          }}
          component={selectedComponent}
        />
      )}
    </>
  );
});

AccessControlComponents.displayName = 'AccessControlComponents';
export default AccessControlComponents;