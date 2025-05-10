import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Info } from 'lucide-react';

// Component data
const estoresComponents = [
  {
    id: 1,
    name: 'Tejido',
    src: 'https://www.somfy.es/common/img/library//500x370_cover/blinds-and-curtains.jpg',
    alt: 'Tejido de estores eléctricos para control de luz',
    link: '/components/tejido',
    description: 'Tejido personalizable para un control preciso de luz y privacidad.',
  },
  {
    id: 2,
    name: 'Tubo de Enrollamiento',
    src: 'https://www.somfy.es/common/img/library///500x370_cover/Connexoon_Window_Stephane_Rambaud_18_web2.jpg',
    alt: 'Tubo de enrollamiento para estores eléctricos',
    link: '/components/tubo',
    description: 'Tubo robusto que soporta el enrollado suave del tejido.',
  },
  {
    id: 3,
    name: 'Motor Eléctrico',
    src: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
    alt: 'Motor eléctrico para estores eléctricos',
    link: '/components/motor-estores',
    description: 'Motor silencioso para una automatización eficiente y sin esfuerzo.',
  },
  {
    id: 4,
    name: 'Rieles o Guías',
    src: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
    alt: 'Rieles o guías para estores eléctricos',
    link: '/components/rieles',
    description: 'Guías que aseguran un movimiento estable del tejido.',
  },
  {
    id: 5,
    name: 'Sistema de Control',
    src: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
    alt: 'Sistema de control para estores eléctricos',
    link: '/components/control-estores',
    description: 'Control inteligente para gestión remota y programable.',
  },
  {
    id: 6,
    name: 'Contrapeso',
    src: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
    alt: 'Contrapeso para estores eléctricos',
    link: '/components/contrapeso',
    description: 'Barra inferior que mantiene el tejido tenso y estético.',
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

const EstoresElectricosComponents = ({
  title = 'Componentes de Estores Eléctricos',
  description = 'Explora los elementos clave que hacen que nuestros estores eléctricos sean la elección perfecta para un hogar inteligente y moderno.',
}) => {
  const [hoveredComponent, setHoveredComponent] = useState(null);

  // Memoize components to prevent unnecessary re-renders
  const memoizedComponents = useMemo(() => estoresComponents, []);

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

export default EstoresElectricosComponents;