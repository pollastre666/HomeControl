// src/Componentes/Home/SmartHomeTimeline.js
import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
  { year: '2018', title: 'Inicio de HomeControl', description: 'Lanzamos nuestra primera solución de automatización.' },
  { year: '2020', title: 'Seguridad Avanzada', description: 'Introdujimos sistemas de seguridad inteligentes.' },
  { year: '2023', title: 'Eficiencia Energética', description: 'Desarrollamos tecnologías para ahorrar energía.' },
  { year: '2025', title: 'IA Integrada', description: 'Incorporamos inteligencia artificial en nuestros productos.' },
];

const SmartHomeTimeline = () => (
  <section className="py-12 bg-gradient-to-br from-amber-50 to-amber-100">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-extrabold text-amber-700 mb-10 text-center tracking-tight">Nuestra Historia</h2>
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200/50" />
        {timelineData.map((item, index) => (
          <motion.div
            key={item.year}
            className="mb-12 flex items-center w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <div className="flex-shrink-0 w-1/2">
              <motion.div
                className="h-4 w-4 rounded-full bg-amber-500 absolute left-1/2 transform -translate-x-1/2 -translate-y-2"
                animate={{ scale: [1, 1.2, 1], transition: { duration: 1.5, repeat: Infinity } }}
              />
            </div>
            <div className="flex-shrink-0 w-1/2 pl-8">
              <h3 className="text-xl font-semibold text-gray-900">{item.year}</h3>
              <p className="mt-2 text-gray-600">{item.title}</p>
              <p className="mt-1 text-sm text-gray-500">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SmartHomeTimeline;