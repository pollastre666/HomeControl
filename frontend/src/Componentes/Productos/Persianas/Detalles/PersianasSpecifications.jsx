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

const PersianasSpecifications = ({ specs }) => {
  if (!specs || Object.keys(specs).length === 0) return null;

  return (
    <motion.div
      className="mb-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Especificaciones Técnicas
      </h2>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <tbody>
            {Object.entries(specs).map(([key, value], index) => (
              <motion.tr
                key={index}
                className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}
                variants={rowVariants}
                initial="hidden"
                whileInView="visible"
                custom={index}
                viewport={{ once: true }}
              >
                <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600" scope="row">
                  {key}
                </th>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                  {value}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default PersianasSpecifications;