import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const buttonVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
};

const InstallationTipsToggle = ({ tips }) => {
  const [showDetails, setShowDetails] = useState(false);
  const toggleId = `tips-toggle-${Date.now()}`;

  if (!tips) return null;

  return (
    <motion.div
      className="mb-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Consejos de Instalación
      </h2>
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center justify-center w-full max-w-md mx-auto bg-amber-600 dark:bg-amber-500 text-white dark:text-gray-100 px-6 py-3 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-all duration-200"
        aria-expanded={showDetails}
        aria-controls={toggleId}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {showDetails ? 'Ocultar Detalles' : 'Mostrar Detalles'}
        {showDetails ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
      </motion.button>
      <motion.div
        id={toggleId}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showDetails ? 1 : 0, height: showDetails ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="mt-4 max-w-2xl mx-auto text-gray-700 dark:text-gray-300 text-base sm:text-lg text-center"
      >
        {tips}
      </motion.div>
    </motion.div>
  );
};

export default InstallationTipsToggle;