import React from 'react';
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: index * 0.1, ease: 'easeOut' },
  }),
};

const Features = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <motion.section
      className="py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Características Principales
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-300"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            custom={index}
            viewport={{ once: true }}
          >
            <span className="w-3 h-3 bg-amber-600 dark:bg-amber-400 rounded-full flex-shrink-0"></span>
            <p className="text-gray-800 dark:text-gray-200 text-base sm:text-lg">
              {feature}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Features;