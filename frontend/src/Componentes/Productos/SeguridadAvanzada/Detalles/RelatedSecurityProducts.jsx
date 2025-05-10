import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const componentData = {
  'alarm-system': { name: 'Sistema de Alarma', image: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg' },
  'motion-detector': { name: 'Detector de Movimiento', image: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg' },
  'smart-lock': { name: 'Cerradura Inteligente', image: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg' },
};

const relatedProducts = [
  { id: 'alarm-system', name: 'Sistema de Alarma', link: '/components/alarm-system' },
  { id: 'motion-detector', name: 'Detector de Movimiento', link: '/components/motion-detector' },
  { id: 'smart-lock', name: 'Cerradura Inteligente', link: '/components/smart-lock' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const RelatedSecurityProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % relatedProducts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + relatedProducts.length) % relatedProducts.length);
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Productos Relacionados
      </h2>
      <div className="relative max-w-6xl mx-auto">
        {/* Mobile Carousel */}
        <div className="block lg:hidden overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {relatedProducts.map((product) => (
              <div key={product.id} className="min-w-full px-4">
                <Link
                  to={product.link}
                  className="group relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 hover:shadow-lg dark:hover:shadow-gray-600 transition-shadow duration-300 h-64"
                >
                  <img
                    src={componentData[product.id].image}
                    alt={`${product.name} - Vista previa`}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent dark:from-gray-900/60 transition-opacity duration-300 group-hover:from-black/75 dark:group-hover:from-gray-900/75" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-white dark:text-gray-100">
                      {product.name}
                    </h3>
                    <div className="mt-4 flex justify-center">
                      <span className="text-white dark:text-gray-200 text-sm font-medium flex items-center gap-1 hover:underline">
                        Ver más
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts.map((product) => (
            <Link
              key={product.id}
              to={product.link}
              className="group relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 hover:shadow-lg dark:hover:shadow-gray-600 transition-shadow duration-300 h-64 sm:h-72"
            >
              <img
                src={componentData[product.id].image}
                alt={`${product.name} - Vista previa`}
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent dark:from-gray-900/60 transition-opacity duration-300 group-hover:from-black/75 dark:group-hover:from-gray-900/75" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-white dark:text-gray-100">
                  {product.name}
                </h3>
                <div className="mt-4 flex justify-center">
                  <span className="text-white dark:text-gray-200 text-sm font-medium flex items-center gap-1 hover:underline">
                    Ver más
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RelatedSecurityProducts;