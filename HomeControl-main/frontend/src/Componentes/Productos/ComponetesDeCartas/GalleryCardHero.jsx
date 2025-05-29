import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Info } from 'lucide-react';

// Animation variants for the card
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: index * 0.15, ease: 'easeOut' },
  }),
};

const GalleryCardHero = ({ title, description, image, link, index, onHover, onLeave, isHovered }) => {
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 h-64 sm:h-72 w-full max-w-sm mx-auto"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      custom={index}
      viewport={{ once: true }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link to={link} aria-label={`Explorar ${title}`}>
        <div className="relative w-full h-full group">
          {/* Image with Zoom Effect */}
          <img
            src={image}
            alt={`${title} - Vista previa`}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 group-hover:from-black/80" />
          {/* Centered Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <div className="text-center">
              <h3
                className="text-lg sm:text-xl font-semibold text-white drop-shadow-lg"
              >
                {title}
              </h3>
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="mt-2 text-sm text-white/90 flex items-center justify-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Info size={16} />
                    <span>{description}</span>
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
        </div>
      </Link>
    </motion.div>
  );
};

export default GalleryCardHero;