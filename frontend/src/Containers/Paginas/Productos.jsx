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
} from '../../Componentes/Productos/ControlDeAcceso/accessControlData';
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
      className="py-12 bg-gray-50 rounded-lg my-8"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      id={category.id}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {category.name}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">{category.description}</p>
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="mt-4 sm:mt-0 flex items-center bg-amber-500 text-white px-4 py-2 rounded-full hover:bg-amber-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label={`Ordenar ${category.name} ${sortOrder === 'asc' ? 'Z-A' : 'A-Z'}`}
          >
            Ordenar {sortOrder === 'asc' ? 'Z-A' : 'A-Z'}
            {sortOrder === 'asc' ? <SortAsc className="ml-2" size={16} /> : <SortDesc className="ml-2" size={16} />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="relative rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden h-[360px] flex flex-col"
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
                <motion.div className="relative w-full h-48 group" variants={cardHoverVariants}>
                  <img
                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent rounded-t-xl transition-opacity duration-300 group-hover:from-gray-900/70" />
                </motion.div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3
                    id={`product-${product.id}`}
                    className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1"
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
                        className="flex flex-col flex-grow"
                      >
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-lg font-bold text-amber-600 mb-2">
                          ${product.price} USD
                        </p>
                        {product.stock === 0 ? (
                          <p className="text-red-600 font-medium text-sm">
                            Agotado
                          </p>
                        ) : (
                          <motion.button
                            onClick={(e) => {
                              e.preventDefault();
                              onBuyNow(product);
                            }}
                            className="mt-auto bg-amber-500 text-white px-4 py-2 rounded-full hover:bg-amber-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Comprar ${product.name}`}
                          >
                            Comprar Ahora
                          </motion.button>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Compatibilidad: {getCompatibilityMessage(product)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {hoveredProduct === product.id && (
                    <motion.div
                      className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full"
                      variants={indicatorVariants}
                      initial="hidden"
                      animate={['visible', 'pulse']}
                    />
                  )}
                </div>
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
    <section className="relative min-h-screen bg-gradient-to-br from-amber-50 via-gray-100 to-white overflow-hidden">
      {/* Hero Section */}
      <motion.div
        className="relative h-[60vh] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')" }}
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center text-center">
          <motion.div
            className="text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              {title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-6">
              {description}
            </p>
            <motion.a
              href="#productos"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-block bg-amber-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Explorar productos"
            >
              Explora Ahora
              <ChevronRight className="inline ml-2" size={20} />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Índice de Categorías */}
      <div className="sticky top-0 bg-white py-4 shadow-lg z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto whitespace-nowrap">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Categorías</h3>
          <div className="flex gap-4">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(category.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-amber-600 hover:text-amber-800 font-medium transition-colors duration-200 px-3 py-1 rounded-full hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label={`Ir a ${category.name}`}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido de categorías */}
      <div id="productos" className="relative py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              products={categorizedProducts[category.id] || []}
              onBuyNow={handleBuyNow}
            />
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