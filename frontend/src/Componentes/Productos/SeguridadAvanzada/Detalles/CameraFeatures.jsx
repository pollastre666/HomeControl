import React from 'react';
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: index * 0.1 },
  }),
};

const CameraFeatures = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <motion.div
      className="mb-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Características Principales
      </h2>
      <ul className="max-w-2xl mx-auto space-y-3">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            className="flex items-center text-gray-800 dark:text-gray-200 text-base sm:text-lg"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            custom={index}
            viewport={{ once: true }}
          >
            <span className="w-3 h-3 bg-amber-600 dark:bg-amber-400 rounded-full mr-3"></span>
            {feature}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default CameraFeatures;