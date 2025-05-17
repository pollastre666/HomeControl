import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
  { year: '2018', title: 'Inicio de HomeControl', description: 'Lanzamos nuestra primera solución de automatización.' },
  { year: '2020', title: 'Seguridad Avanzada', description: 'Introdujimos sistemas de seguridad inteligentes.' },
  { year: '2023', title: 'Eficiencia Energética', description: 'Desarrollamos tecnologías para ahorrar energía.' },
  { year: '2025', title: 'IA Integrada', description: 'Incorporamos inteligencia artificial en nuestros productos.' },
];

const SmartHomeTimeline = () => (
  <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-amber-50 to-amber-100">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-700 mb-8 sm:mb-10 lg:mb-12 text-center tracking-tight">Nuestra Historia</h2>
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200/50 hidden sm:block" />
        {timelineData.map((item, index) => (
          <motion.div
            key={item.year}
            className="mb-8 sm:mb-12 flex flex-col sm:flex-row items-center w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <div className="flex-shrink-0 w-full sm:w-1/2 text-center sm:text-right pr-0 sm:pr-8 mb-4 sm:mb-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{item.year}</h3>
              <p className="mt-1 text-sm sm:text-base lg:text-lg text-gray-600">{item.title}</p>
              <p className="mt-1 text-xs sm:text-sm lg:text-base text-gray-500">{item.description}</p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-1/2 pl-0 sm:pl-8 text-center sm:text-left">
              <motion.div
                className="h-4 w-4 rounded-full bg-amber-500 absolute left-1/2 transform -translate-x-1/2 -translate-y-2 sm:block hidden"
                animate={{ scale: [1, 1.2, 1], transition: { duration: 1.5, repeat: Infinity } }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SmartHomeTimeline;