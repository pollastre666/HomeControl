import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Info, SortAsc, SortDesc } from 'lucide-react';

const advancedSecurityComponents = [
  { id: 1, name: 'Cámara', src: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg', alt: 'Cámara de seguridad', link: '/components/camera', description: 'Vigilancia en alta definición con visión nocturna.' },
  { id: 2, name: 'Sistema de Alarma', src: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg', alt: 'Sistema de alarma', link: '/components/alarm-system', description: 'Alerta inmediata ante intrusos con notificaciones en tiempo real.' },
  { id: 3, name: 'Detector de Movimiento', src: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg', alt: 'Detector de movimiento', link: '/components/motion-detector', description: 'Sensores avanzados para detectar actividad no autorizada.' },
  { id: 4, name: 'Cerradura Inteligente', src: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg', alt: 'Cerradura inteligente', link: '/components/smart-lock', description: 'Cerradura con acceso remoto y control por app.' },
  { id: 5, name: 'App de Control', src: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg', alt: 'App de control de seguridad', link: '/components/control-app', description: 'Gestiona tu seguridad desde cualquier lugar.' },
  { id: 6, name: 'Sistema de Notificaciones', src: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg', alt: 'Sistema de notificaciones', link: '/components/notification-system', description: 'Alertas personalizadas para eventos de seguridad.' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: index * 0.15, ease: 'easeOut' },
  }),
};

const headerVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

const AdvancedSecurityComponents = React.memo(({ title = 'Componentes de Seguridad Avanzada', description = 'Protege tu hogar con los mejores componentes de seguridad.' }) => {
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate image loading
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const sortedComponents = useMemo(() => {
    const components = [...advancedSecurityComponents];
    return components.sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [sortOrder]);

  const getCardBackground = (index) => {
    const colors = [
      'bg-white dark:bg-gray-800',
      'bg-gray-50 dark:bg-gray-700',
      'bg-amber-50 dark:bg-gray-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-100 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-amber-200/30 to-transparent dark:from-gray-700/30 dark:to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl sm:max-w-3xl text-base sm:text-lg leading-7 text-gray-600 dark:text-gray-300 font-medium">
            {description}
          </p>
        </motion.div>

        {/* Sort Filter */}
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
          {sortedComponents.map((component, index) => (
            <motion.div
              key={component.id}
              className={`relative rounded-xl overflow-hidden ${getCardBackground(index)} shadow-md dark:shadow-gray-700 hover:shadow-lg dark:hover:shadow-gray-600 transition-all duration-300 h-64 sm:h-72 w-full max-w-sm mx-auto ${index === 0 ? 'ring-2 ring-amber-500 scale-105' : ''}`}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredComponent(component.id)}
              onMouseLeave={() => setHoveredComponent(null)}
            >
              <Link to={component.link}>
                <div className="relative w-full h-full group">
                  {!isLoaded ? (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-600 animate-pulse" />
                  ) : (
                    <img
                      src={component.src}
                      alt={component.alt}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent dark:from-gray-900/60 transition-opacity duration-300 group-hover:from-black/75 dark:group-hover:from-gray-900/75" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <div className="flex items-center justify-center mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-white dark:text-gray-100 text-center">
                        {component.name}
                      </h3>
                      <div className="relative group/info ml-2">
                        <Info size={16} className="text-white dark:text-gray-300 cursor-pointer" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/info:block">
                          <div className="bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-200 text-xs rounded py-1 px-2 whitespace-nowrap">
                            {component.description}
                          </div>
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {hoveredComponent === component.id && (
                        <motion.div
                          className="mt-2 text-sm text-white/90 dark:text-gray-200 text-center flex items-center justify-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span>{component.description}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.div
                      className="mt-3 flex justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-white dark:text-gray-200 text-sm font-medium flex items-center gap-1 hover:underline">
                        Ver más <ChevronRight size={16} />
                      </span>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

AdvancedSecurityComponents.displayName = 'AdvancedSecurityComponents';
export default AdvancedSecurityComponents;