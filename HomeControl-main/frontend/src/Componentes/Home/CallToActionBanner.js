import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const CallToActionBanner = () => {
  const controls = useAnimation();

  React.useEffect(() => {
    const animateBackground = async () => {
      while (true) {
        await controls.start({
          background: [
            'radial-gradient(circle at 20% 30%, #f5be34, #f59e42, #f5be34)',
            'radial-gradient(circle at 80% 70%, #f59e42, #f5be34, #f59e42)',
          ],
          transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        });
      }
    };
    animateBackground();
  }, [controls]);

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
    breathe: {
      scale: [1, 1.02, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.1 } },
  };

  return (
    <motion.section
      className="py-12 sm:py-16 lg:py-20 relative overflow-hidden"
      animate={controls}
      initial={{ background: 'radial-gradient(circle at 50% 50%, #f5be34, #f59e42)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent opacity-70" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-white"
        >
          <motion.h2
            variants={textVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 sm:mb-6"
          >
            ¡Transforma tu hogar ahora!
          </motion.h2>
          <motion.p
            variants={textVariants}
            className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto"
          >
            Ahorra energía, mejora tu seguridad y vive con mayor confort. Explora nuestras soluciones inteligentes hoy mismo.
          </motion.p>
          <motion.div variants={textVariants}>
            <motion.div
              variants={buttonVariants}
              animate="breathe"
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/productos"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white text-amber-700 text-sm sm:text-base font-bold shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all duration-300"
                aria-label="Explorar productos de HomeControl"
              >
                Descubre Más
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ChevronRight className="ml-2 w-5 sm:w-6 h-5 sm:h-6" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-amber-300/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.section>
  );
};

export default CallToActionBanner;