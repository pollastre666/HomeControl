import React from 'react';
import { motion } from 'framer-motion';

const Spinner = () => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: 'linear',
      },
    },
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background dark:bg-gray-900" aria-label="Cargando">
      <motion.div
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        variants={spinnerVariants}
        animate="animate"
        role="status"
        aria-live="polite"
      />
    </div>
  );
};

export default Spinner;