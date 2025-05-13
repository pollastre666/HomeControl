import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scissors, Settings, Plug, AlignJustify, Smartphone, Weight, ChevronRight } from 'lucide-react';
import { componentData } from '../Estores/estoresData'; // Asegúrate de que la ruta sea correcta

// Variantes de animación
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

const EstoresElectricosComponents = ({
  title = 'Componentes de Estores',
  description = 'Explora los componentes esenciales que combinan tecnología y diseño para tus estores.',
}) => {
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const memoizedComponents = useMemo(() => Object.values(componentData), []);

  return (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {memoizedComponents.map((component, index) => (
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
                <Link to={`/components/${component.id}`} aria-label={`Explorar ${component.name}`}>
                  <motion.div className="relative w-full h-full group" variants={cardHoverVariants}>
                    <div className="absolute top-3 right-3 z-10 bg-amber-600 dark:bg-amber-500 text-white p-1.5 rounded-full shadow-sm group-hover:bg-amber-700 dark:group-hover:bg-amber-600 transition-colors duration-300">
                      {getIconById(component.id)}
                    </div>
                    <img
                      src={component.image}
                      alt={component.alt || `${component.name} - Vista previa`}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500x370?text=Imagen+no+disponible';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-gray-900/20 to-transparent transition-opacity duration-300 group-hover:from-gray-900/60" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 id={`component-${component.id}`} className="text-lg sm:text-xl font-bold text-white dark:text-gray-100 text-left mb-1">
                        {component.name}
                      </h3>
                      <AnimatePresence>
                        {hoveredComponent === component.id && (
                          <motion.p
                            className="text-xs sm:text-sm text-gray-200 dark:text-gray-300 text-left"
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            {component.description}
                          </motion.p>
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
          ))}
        </div>
      </div>
    </section>
  );

  function getIconById(id) {
    const iconMap = {
      tejido: <Scissors size={16} />,
      tubo: <Settings size={16} />,
      'motor-estores': <Plug size={16} />,
      rieles: <AlignJustify size={16} />,
      'control-estores': <Smartphone size={16} />,
      contrapeso: <Weight size={16} />,
    };
    return iconMap[id] || <ChevronRight size={16} />;
  }
};

export default EstoresElectricosComponents;
