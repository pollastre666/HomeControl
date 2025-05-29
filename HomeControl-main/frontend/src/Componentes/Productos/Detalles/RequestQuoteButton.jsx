import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

const RequestQuoteButton = () => {
  return (
    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
      <Link
        to="/solicitar-presupuesto"
        className="relative inline-block bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg overflow-hidden group"
        aria-label="Solicitar un presupuesto para el producto"
      >
        <span className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
        Solicitar Presupuesto
      </Link>
    </motion.div>
  );
};

export default RequestQuoteButton;