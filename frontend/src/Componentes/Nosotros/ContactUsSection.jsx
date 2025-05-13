// src/Componentes/Nosotros/ContactUsSection.js
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

const ContactUsSection = () => {
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center tracking-tight">Contáctanos</h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={formVariants}
          className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-amber-200/20"
        >
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                placeholder="tu@email.com"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-200 text-gray-900 font-semibold py-2 rounded-md hover:bg-amber-300 transition-colors duration-300"
            >
              Enviar Mensaje
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">O contáctanos directamente:</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="mailto:info@homecontrol.com" className="flex items-center text-gray-700 hover:text-amber-600">
                <Mail className="w-5 h-5 mr-1" /> info@homecontrol.com
              </a>
              <a href="tel:+1234567890" className="flex items-center text-gray-700 hover:text-amber-600">
                <Phone className="w-5 h-5 mr-1" /> +1 234 567 890
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUsSection;