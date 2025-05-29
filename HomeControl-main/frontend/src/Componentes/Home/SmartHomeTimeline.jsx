import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
  { year: '2018', title: 'Inicio de HomeControl', description: 'Lanzamos nuestra primera solución de automatización doméstica.' },
  { year: '2020', title: 'Seguridad Avanzada', description: 'Introdujimos sistemas de seguridad inteligentes de última generación.' },
  { year: '2023', title: 'Eficiencia Energética', description: 'Desarrollamos tecnologías innovadoras para ahorrar energía.' },
  { year: '2026', title: 'Expansión Internacional', description: 'Llevaremos nuestras soluciones de automatización a mercados globales, empezando por Europa y Asia.' }, // Nuevo evento
];

const SmartHomeTimeline = () => (
  <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-light-100 via-light-50 to-amber-100 dark:from-dark-900 dark:via-dark-800 dark:to-amber-900/20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-700 dark:text-amber-300 mb-8 sm:mb-10 lg:mb-12 text-center tracking-tight" role="heading" aria-level="2">
        Nuestra Historia
      </h2>
      <div className="relative">
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200/50 dark:bg-amber-800/50"
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {timelineData.map((item, index) => (
          <motion.div
            key={item.year}
            className="mb-8 sm:mb-12 flex flex-col sm:flex-row items-center w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <div className={`flex-shrink-0 w-full sm:w-1/2 ${index % 2 === 0 ? 'text-center sm:text-right pr-0 sm:pr-8' : 'text-center sm:text-left pl-0 sm:pl-8'} mb-4 sm:mb-0`}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-dark-900 dark:text-light-100">{item.year}</h3>
              <p className="mt-1 text-sm sm:text-base lg:text-lg text-dark-600 dark:text-light-300">{item.title}</p>
              <p className="mt-1 text-xs sm:text-sm lg:text-base text-dark-500 dark:text-light-400">{item.description}</p>
            </div>
            <motion.div
              className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-500 dark:bg-amber-400 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1], transition: { duration: 1.5, repeat: Infinity } }}
              aria-hidden="true"
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SmartHomeTimeline;