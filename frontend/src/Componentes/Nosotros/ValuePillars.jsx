import React from 'react';
import { motion } from 'framer-motion';

const values = [
  { title: 'Innovación', description: 'Desarrollamos tecnología de vanguardia para el hogar del futuro.' },
  { title: 'Sostenibilidad', description: 'Promovemos un estilo de vida ecológico y eficiente.' },
  { title: 'Confianza', description: 'Construimos relaciones duraderas con nuestros clientes.' },
];

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
};

const ValuePillars = () => (
  <section
    className="py-20 bg-gradient-to-t from-amber-50 to-amber-100"
    aria-label="Our Core Values"
  >
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-800 mb-12 text-center tracking-tight">
        Nuestros Pilares
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {values.map((value, index) => (
          <motion.article
            key={value.title}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center border border-amber-200/50"
            variants={cardVariants}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)' }}
            aria-labelledby={`value-title-${index}`}
          >
            <h3
              id={`value-title-${index}`}
              className="text-xl font-semibold text-amber-800 mb-3"
            >
              {value.title}
            </h3>
            <p className="text-lg sm:text-xl text-gray-600">{value.description}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default React.memo(ValuePillars);