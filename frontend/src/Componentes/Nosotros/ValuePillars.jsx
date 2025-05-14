// src/Componentes/Nosotros/ValuePillars.js
import React from 'react';
import { motion } from 'framer-motion';

const values = [
  { title: 'Innovación', description: 'Desarrollamos tecnología de vanguardia para el hogar del futuro.' },
  { title: 'Sostenibilidad', description: 'Promovemos un estilo de vida ecológico y eficiente.' },
  { title: 'Confianza', description: 'Construimos relaciones duraderas con nuestros clientes.' },
];

const ValuePillars = () => (
  <section className="py-16 bg-gradient-to-t from-amber-50 to-amber-100">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-extrabold text-amber-700 mb-12 text-center tracking-tight">Nuestros Pilares</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center border border-amber-200/50"
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: 'auto', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.8, ease: 'easeOut' }}
          >
            <h3 className="text-xl font-semibold text-amber-700 mb-3">{value.title}</h3>
            <p className="text-gray-600">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ValuePillars;