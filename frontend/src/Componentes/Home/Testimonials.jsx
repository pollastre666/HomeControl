import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  { name: "Ana G.", text: "HomeControl ha transformado mi hogar. ¡Es tan fácil de usar!", rating: 5 },
  { name: "Carlos M.", text: "Ahorro energía todos los días gracias a las persianas inteligentes.", rating: 4 },
  { name: "María P.", text: "La seguridad que ofrece es increíble. Lo recomiendo 100%.", rating: 5 },
];

const Testimonials = () => (
  <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-amber-50 via-white to-amber-100 overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h2
        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-700 mb-8 sm:mb-10 lg:mb-12 text-center tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Lo que Dicen Nuestros Clientes
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 border border-amber-200/50"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 bg-amber-400/20 rounded-full -translate-x-4 -translate-y-4" />
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 italic mb-3 sm:mb-4">"{testimonial.text}"</p>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="ml-2 sm:ml-3 text-sm sm:text-base lg:text-lg font-semibold text-amber-700">{testimonial.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;