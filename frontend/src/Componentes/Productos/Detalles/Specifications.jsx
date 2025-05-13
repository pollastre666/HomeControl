import React from 'react';
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: index * 0.1 },
  }),
};

const Specifications = ({ specs }) => {
  if (!specs || Object.keys(specs).length === 0) return null;

  return (
    <motion.section
      className="py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Especificaciones Técnicas
      </h2>
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {Object.entries(specs).map(([key, value], index) => (
          <motion.div
            key={index}
            className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            variants={rowVariants}
            initial="hidden"
            whileInView="visible"
            custom={index}
            viewport={{ once: true }}
          >
            <div className="w-1/3 bg-gray-50 dark:bg-gray-700 px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
              {key}
            </div>
            <div className="w-2/3 px-6 py-4 text-gray-700 dark:text-gray-300">
              {value}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Specifications;