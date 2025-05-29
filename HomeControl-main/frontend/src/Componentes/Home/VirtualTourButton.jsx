import React from 'react';
import { motion } from 'framer-motion';

const VirtualTourButton = () => (
  <section className="py-24 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 text-center relative overflow-hidden">
    {/* Fondo con efecto de partículas (simulado con gradiente radial) */}
    <div className="absolute inset-0">
      <div className="absolute w-96 h-96 bg-amber-300/20 rounded-full filter blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-amber-400/20 rounded-full filter blur-3xl top-1/4 left-1/4 animate-pulse delay-1000"></div>
    </div>

    <motion.div
      className="relative inline-block z-10"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    >
      <motion.div
        className="bg-white/85 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md mx-auto border-2 border-amber-300/40 hover:border-amber-500 transition-all duration-500"
        whileHover={{ scale: 1.1, rotateY: 10, boxShadow: '0 25px 50px rgba(217, 119, 6, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-amber-800 mb-6 tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        >
          Descubre el Futuro de tu Hogar
        </motion.h2>
        <p className="text-gray-700 text-lg mb-8 leading-relaxed max-w-sm mx-auto">
          Explora cómo HomeControl transforma tu vida con tecnología inteligente y sostenible.
        </p>
        <motion.div
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } }}
        >
          <a
            href="/contacto" // Enlace genérico a contacto o página de productos
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-amber-600 text-white font-semibold text-xl shadow-lg hover:bg-amber-700 transition-all duration-300"
            aria-label="Descubre más sobre HomeControl"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
            Descubre Más
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  </section>
);

export default VirtualTourButton;