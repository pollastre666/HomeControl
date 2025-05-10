import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Info } from 'lucide-react';

// Component data
const smartHomeAutomationComponents = [
  {
    id: 1,
    name: 'Persianas Motorizadas',
    src: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
    alt: 'Persianas motorizadas',
    link: '/components/motorized-shutters',
    description: 'Control automático de persianas para comodidad y eficiencia.',
  },
  {
    id: 2,
    name: 'Iluminación Inteligente',
    src: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
    alt: 'Iluminación inteligente',
    link: '/components/smart-lighting',
    description: 'Luces ajustables con automatización y control remoto.',
  },
  {
    id: 3,
    name: 'Control de Clima',
    src: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
    alt: 'Control de clima',
    link: '/components/climate-control',
    description: 'Regulación automática de temperatura y ventilación.',
  },
  {
    id: 4,
    name: 'Enchufes Inteligentes',
    src: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
    alt: 'Enchufes inteligentes',
    link: '/components/smart-plugs',
    description: 'Controla dispositivos desde tu smartphone.',
  },
  {
    id: 5,
    name: 'Controlador de Automatización',
    src: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
    alt: 'Controlador de automatización',
    link: '/components/automation-controller',
    description: 'Centraliza la gestión de automatismos del hogar.',
  },
  {
    id: 6,
    name: 'Programador de Escenas',
    src: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
    alt: 'Programador de escenas',
    link: '/components/scene-scheduler',
    description: 'Automatiza rutinas diarias con escenas personalizadas.',
  },
];

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: index * 0.15, ease: 'easeOut' },
  }),
};

// Animation variants for header
const headerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};

const SmartHomeAutomationComponents = ({
  title = 'Componentes de Smart Home Automatismos',
  description = 'Automatiza tu hogar con los mejores componentes inteligentes.',
}) => {
  const [hoveredComponent, setHoveredComponent] = useState(null);

  // Memoize components to prevent unnecessary re-renders
  const memoizedComponents = useMemo(() => smartHomeAutomationComponents, []);

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-100 py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Background Effects */}
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
        {/* Header Section */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl sm:max-w-3xl text-base sm:text-lg leading-7 text-gray-600 font-medium">
            {description}
          </p>
        </motion.div>

        {/* Component Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {memoizedComponents.map((component, index) => (
            <motion.div
              key={component.id}
              className="relative rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 h-64 sm:h-72 w-full max-w-sm mx-auto"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true }}
              role="article"
              aria-labelledby={`component-${component.id}`}
              onMouseEnter={() => setHoveredComponent(component.id)}
              onMouseLeave={() => setHoveredComponent(null)}
            >
              <Link to={component.link} aria-label={`Explorar ${component.name}`}>
                <div className="relative w-full h-full group">
                  {/* Image with Zoom Effect */}
                  <img
                    src={component.src}
                    alt={component.alt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 group-hover:from-black/80" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h3
                      id={`component-${component.id}`}
                      className="text-lg sm:text-xl font-semibold text-white text-center"
                    >
                      {component.name}
                    </h3>
                    <AnimatePresence>
                      {hoveredComponent === component.id && (
                        <motion.div
                          className="mt-2 text-sm text-white/90 text-center flex items-center justify-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Info size={16} />
                          <span>{component.description}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.div
                      className="mt-3 flex justify-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-white text-sm font-medium flex items-center gap-1 hover:underline">
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
};

export default SmartHomeAutomationComponents;