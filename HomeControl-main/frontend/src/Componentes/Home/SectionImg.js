import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import galleryItems from './galleryItems.json';

// Carga diferida de GalleryCardHero
const GalleryCardHero = lazy(() => import('../Productos/ComponetesDeCartas/GalleryCardHero'));

const headerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};

const svgVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 0.2,
    transition: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' },
  },
};

const categories = ['Todos', 'Control de Luz', 'Seguridad', 'Automatización'];

const GallerySection = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const memoizedItems = useMemo(() => galleryItems, []);

  // Efecto parallax en el header
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const headerY = useTransform(scrollY, [0, 200], [0, -50]);

  // Filtrar items según la categoría seleccionada
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Todos') return memoizedItems;
    return memoizedItems.filter(item => item.category === selectedCategory);
  }, [selectedCategory, memoizedItems]);

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 sm:py-16 lg:py-24 overflow-hidden">
      {/* Fondo SVG dinámico */}
      <motion.svg
        className="absolute inset-x-0 bottom-0 -z-10 h-96 w-full"
        viewBox="0 0 1155 678"
        initial="hidden"
        animate="visible"
      >
        <motion.path
          d="M74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%"
          fill="url(#gradient)"
          variants={svgVariants}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FF9800', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#F57C00', stopOpacity: 0.1 }} />
          </linearGradient>
        </defs>
      </motion.svg>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con efecto parallax */}
        <motion.div
          className="text-center mb-10 sm:mb-12 lg:mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 tracking-tight">
            Soluciones HomeControl
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base lg:text-lg leading-7 text-gray-600 dark:text-gray-300 font-medium">
            Transforma tu hogar con soluciones de automatización inteligentes y conectadas.
          </p>
        </motion.div>

        {/* Filtros de categorías */}
        <div className="flex justify-center mb-8 space-x-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-amber-300 dark:hover:bg-amber-600'
              }`}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          <Suspense fallback={<div className="text-center text-gray-500">Cargando...</div>}>
            {filteredItems.map((item, index) => (
              <GalleryCardHero
                key={item.id}
                title={item.title}
                description={item.description}
                image={item.src}
                link={item.link}
                index={index}
                onHover={() => setHoveredItem(item.id)}
                onLeave={() => setHoveredItem(null)}
                isHovered={hoveredItem === item.id}
              />
            ))}
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;