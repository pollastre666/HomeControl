// src/Componentes/Home/InteractiveDemo.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const InteractiveDemo = () => (
  <section className="py-12 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold text-amber-700 mb-4">Prueba Nuestra Tecnología</h2>
      <p className="text-lg text-gray-600 mb-6">Descubre cómo funciona HomeControl con una demo interactiva.</p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/demo"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-amber-500 text-base font-semibold text-white shadow-sm hover:bg-amber-600"
        >
          Probar Demo
        </Link>
      </motion.div>
    </motion.div>
  </section>
);

export default InteractiveDemo;