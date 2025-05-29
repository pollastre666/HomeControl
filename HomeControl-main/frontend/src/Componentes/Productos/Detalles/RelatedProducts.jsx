// src/Detalles/RelatedProducts.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { componentData as smartHomeAutomationData } from '../SmartHomeAutomatismos/smartHomeAutomationData';
import { componentData as advancedSecurityData } from '../SeguridadAvanzada/advancedSecurityData';
import { componentData as accessControlData } from '../ControlDeAcceso/accessControlData';
import { componentData as automationHubData } from '../Automatizacion/automationHubData';
import { componentData as estoresData } from '../Estores/estoresData'; // Asegúrate de que este archivo exista
import { componentData as componentDataDefault } from '../Persianas/persianasData'; // Asegúrate de que este archivo exista

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: index * 0.1, ease: 'easeOut' },
  }),
};

const RelatedSecurityProducts = ({ currentId, category }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        // Determinar el conjunto de datos según la categoría
        let dataSource;
        switch (category.toLowerCase()) {
          case 'smarthomeautomation':
            dataSource = smartHomeAutomationData;
            break;
          case 'advancedsecurity':
            dataSource = advancedSecurityData;
            break;
          case 'access-control':
            dataSource = accessControlData;
            break;
          case 'automation-hub':
            dataSource = automationHubData;
            break;
          case 'estores':
            dataSource = estoresData;
            break;
          case 'component':
          default:
            dataSource = componentDataDefault;
            break;
        }

        // Obtener todos los productos de la categoría, excluyendo el currentId
        const allProducts = Object.values(dataSource)
          .filter(product => product.id !== currentId)
          .map(product => ({
            id: product.id,
            name: product.name,
            src: product.image,
            alt: `${product.name} - Vista previa`,
            link: `/components/${product.id}`,
            description: product.description,
          }));

        // Limitar a 3 productos relacionados (puedes ajustar este número)
        const related = allProducts.slice(0, 3);

        setRelatedProducts(related);
      } catch (err) {
        console.error('Error loading related products:', err);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedProducts();
  }, [currentId, category]);

  if (loading) {
    return <div className="text-center text-gray-600 py-8">Cargando productos relacionados...</div>;
  }

  if (relatedProducts.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        No se encontraron productos relacionados.
      </div>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-2xl sm:text-3xl font-semibold text-amber-700 dark:text-amber-300 mb-8 text-center">
        Productos Relacionados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {relatedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            className="relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md transition-all duration-300 h-56 sm:h-64 w-full max-w-xs mx-auto"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            custom={index}
            viewport={{ once: true }}
            role="article"
            aria-labelledby={`related-product-${product.id}`}
          >
            <Link to={product.link} aria-label={`Explorar ${product.name}`}>
              <div className="relative w-full h-full group">
                <img
                  src={product.src}
                  alt={product.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-gray-900/20 to-transparent transition-opacity duration-300 group-hover:from-gray-900/60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3
                    id={`related-product-${product.id}`}
                    className="text-lg sm:text-xl font-bold text-white dark:text-gray-100 text-left mb-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-200 dark:text-gray-300 text-left mb-2">
                    {product.description}
                  </p>
                  <motion.div
                    className="flex items-center text-amber-400 hover:text-amber-500 transition-colors duration-200"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-sm font-medium">Ver más</span>
                    <ChevronRight size={16} className="ml-1" />
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedSecurityProducts;