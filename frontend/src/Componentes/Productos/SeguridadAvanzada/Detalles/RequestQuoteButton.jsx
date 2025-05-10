import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

const RequestQuoteButton = () => {
  return (
    <motion.div
      className="mb-12 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
    >
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Link
          to="/solicitar-presupuesto"
          className="inline-block bg-amber-600 dark:bg-amber-500 text-white dark:text-gray-100 px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 dark:hover:bg-amber-600 transition-all duration-200"
        >
          Solicitar Presupuesto
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default RequestQuoteButton;