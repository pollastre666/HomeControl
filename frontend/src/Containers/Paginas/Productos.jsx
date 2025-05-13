// src/Containers/Paginas/Productos.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, SortAsc, SortDesc } from 'lucide-react';
import CheckoutModal from '../../Componentes/Productos/Detalles/CheckoutModal';
import {
  componentData as smartHomeAutomationData,
  getCompatibilityMessage as getSmartHomeCompatibility,
} from '../../Componentes/Productos/SmartHomeAutomatismos/smartHomeAutomationData';
import {
  componentData as advancedSecurityData,
  getCompatibilityMessage as getAdvancedSecurityCompatibility,
} from '../../Componentes/Productos/SeguridadAvanzada/advancedSecurityData';
import {
  componentData as accessControlData,
  getCompatibilityMessage as getAccessControlCompatibility,
} from '../../Componentes//Productos/ControlDeAcceso/accessControlData';
import {
  componentData as automationHubData,
  getCompatibilityMessage as getAutomationHubCompatibility,
} from '../../Componentes/Productos/Automatizacion/automationHubData';
import {
  componentData as estoresData,
  getCompatibilityMessage as getEstoresCompatibility,
} from '../../Componentes/Productos/Estores/estoresData';
import {
  componentData as componentDataDefault,
  getCompatibilityMessage as getComponentCompatibility,
} from '../../Componentes/Productos/Persianas/persianasData';

// Animation Variants
const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeOut' } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: index * 0.15, ease: 'easeOut' },
  }),
};

const cardHoverVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.5 } },
};

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.3 } },
};

const indicatorVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3 } },
  pulse: { scale: 1.1, opacity: 0.7, transition: { duration: 0.7, yoyo: Infinity } },
};

// Definición de categorías y sus datos
const categories = [
  {
    id: 'smarthomeautomation',
    name: 'Automatismos para el Hogar Inteligente',
    description: 'Soluciones avanzadas para automatizar tu hogar.',
    data: smartHomeAutomationData,
    getCompatibility: getSmartHomeCompatibility,
  },
  {
    id: 'advancedsecurity',
    name: 'Seguridad Avanzada',
    description: 'Protege tu hogar con tecnología de vanguardia.',
    data: advancedSecurityData,
    getCompatibility: getAdvancedSecurityCompatibility,
  },
  {
    id: 'access-control',
    name: 'Control de Acceso',
    description: 'Sistemas seguros para gestionar accesos.',
    data: accessControlData,
    getCompatibility: getAccessControlCompatibility,
  },
  {
    id: 'automation-hub',
    name: 'Hub de Automatización',
    description: 'Centraliza el control de tus dispositivos.',
    data: automationHubData,
    getCompatibility: getAutomationHubCompatibility,
  },
  {
    id: 'estores',
    name: 'Estores Inteligentes',
    description: 'Estores motorizados para mayor comodidad.',
    data: estoresData,
    getCompatibility: getEstoresCompatibility,
  },
  {
    id: 'component',
    name: 'Componentes Generales',
    description: 'Componentes esenciales para tu sistema.',
    data: componentDataDefault,
    getCompatibility: getComponentCompatibility,
  },
];

// Componente para mostrar los productos de una categoría
const CategorySection = ({ category, products, onBuyNow }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [products, sortOrder]);

  if (products.length === 0) return null;

  const getCompatibilityMessage = (product) => {
    return category.getCompatibility ? category.getCompatibility(product) : 'Compatibilidad no disponible';
  };

  return (
    <motion.section
      className="py-16"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      id={category.id}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
              {category.name}
            </h2>
            <p className="text-base sm:text-lg text-gray-600">{category.description}</p>
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="mt-4 sm:mt-0 flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            aria-label={`Ordenar ${category.name} ${sortOrder === 'asc' ? 'Z-A' : 'A-Z'}`}
          >
            Ordenar {sortOrder === 'asc' ? 'Z-A' : 'A-Z'}
            {sortOrder === 'asc' ? <SortAsc className="ml-2" size={16} /> : <SortDesc className="ml-2" size={16} />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="relative rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 h-64 w-full max-w-sm mx-auto border border-gray-200"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true }}
              whileHover="hover"
              animate="initial"
              role="article"
              aria-labelledby={`product-${product.id}`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link to={product.link} aria-label={`Explorar ${product.name}`}>
                <motion.div className="relative w-full h-full group" variants={cardHoverVariants}>
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-32 object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent rounded-t-xl transition-opacity duration-300 group-hover:from-gray-900/50" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3
                      id={`product-${product.id}`}
                      className="text-xl font-bold text-white mb-1 line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <AnimatePresence>
                      {hoveredProduct === product.id && (
                        <motion.div
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <p className="text-sm text-gray-200 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <p className="text-lg font-semibold text-amber-400 mb-1">
                            ${product.price} USD
                          </p>
                          {product.stock === 0 ? (
                            <p className="text-red-500 font-semibold text-sm mt-1">
                              Agotado
                            </p>
                          ) : (
                            <motion.button
                              onClick={(e) => {
                                e.preventDefault();
                                onBuyNow(product);
                              }}
                              className="mt-2 bg-amber-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-amber-300 transition-colors duration-300 text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Comprar Ahora
                            </motion.button>
                          )}
                          <p className="text-xs text-gray-300 mt-1">
                            Compatibilidad: {getCompatibilityMessage(product)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <AnimatePresence>
                      {hoveredProduct === product.id && (
                        <motion.div
                          className="absolute bottom-4 left-4 w-2 h-2 bg-amber-200 rounded-full"
                          variants={indicatorVariants}
                          initial="hidden"
                          animate={['visible', 'pulse']}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// Componente principal con Hero Section y Índice
const Productos = ({ title = 'Nuestros Productos', description = 'Transforma tu hogar con las soluciones más innovadoras.' }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [categorizedProducts, setCategorizedProducts] = useState({});
  const navigate = useNavigate();

  // Cargar productos al montar el componente
  useEffect(() => {
    try {
      const allCategories = {
        smarthomeautomation: smartHomeAutomationData,
        advancedsecurity: advancedSecurityData,
        'access-control': accessControlData,
        'automation-hub': automationHubData,
        estores: estoresData,
        component: componentDataDefault,
      };

      const categorized = Object.entries(allCategories).reduce((acc, [category, data]) => {
        acc[category] = Object.values(data).map(product => ({
          ...product,
          category,
          link: `/components/${product.id}?category=${category}`,
        }));
        return acc;
      }, {});

      setCategorizedProducts(categorized);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('No se pudieron cargar los productos. Intenta de nuevo más tarde.');
    }
  }, []);

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  if (error) {
    return <div className="text-center text-red-600 py-16">{error}</div>;
  }

  return (
    <section className="relative min-h-[60vh] bg-gradient-to-br from-amber-50 via-gray-100 to-white overflow-hidden">
      {/* Hero Section */}
      <motion.div
        className="relative h-full w-full bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')" }}
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center text-center py-24">
          <motion.div
            className="text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              {title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-6">
              {description}
            </p>
            <motion.a
              href="#productos"
              onClick={(e) => {
                e.preventDefault();
                navigate('#productos', { behavior: 'smooth' });
              }}
              className="inline-block bg-amber-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-amber-300 transition-colors duration-300 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Explorar productos con desplazamiento suave"
            >
              Explora Ahora
              <span className="absolute -top-2 -right-2 bg-amber-300 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                ?
              </span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Índice de Categorías */}
      <div className="sticky top-0 bg-white py-4 shadow-md z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Categorías</h3>
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(category.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-amber-600 hover:text-amber-800 font-medium transition-colors duration-200"
                aria-label={`Ir a ${category.name}`}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido de categorías */}
      <div id="productos" className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-amber-50/20 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <div key={category.id} id={category.id}>
              <CategorySection
                category={category}
                products={categorizedProducts[category.id] || []}
                onBuyNow={handleBuyNow}
              />
            </div>
          ))}
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setSelectedProduct(null);
        }}
        component={selectedProduct}
      />
    </section>
  );
};

export default Productos;