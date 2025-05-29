import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

// Animation variants
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const inputVariants = {
  initial: { scale: 1 },
  focus: { scale: 1.02, borderColor: '#f59e0b', transition: { duration: 0.3 } },
};

const ContactUsSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = { name: '', email: '' };
    if (!formData.name) newErrors.name = 'El nombre es obligatorio';
    if (!formData.email) newErrors.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    
    setErrors(newErrors);
    if (!newErrors.name && !newErrors.email) {
      console.log('Form submitted:', formData); // Replace with actual submission logic
      setFormData({ name: '', email: '' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: '' });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-amber-100" aria-label="Contact Us">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-800 mb-12 text-center tracking-tight">
          Contáctanos
        </h2>
        <motion.form
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={formVariants}
          className="max-w-full sm:max-w-lg mx-auto bg-white/95 backdrop-blur-md rounded-xl p-8 shadow-lg border border-amber-200/20"
          onSubmit={handleSubmit}
          aria-label="Contact Form"
        >
          <div className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <motion.input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                aria-required="true"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                placeholder="Tu nombre"
                variants={inputVariants}
                initial="initial"
                whileFocus="focus"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <motion.input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                placeholder="tu@email.com"
                variants={inputVariants}
                initial="initial"
                whileFocus="focus"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <motion.button
              type="submit"
              className="w-full bg-amber-500 text-white font-semibold py-3 rounded-md hover:bg-amber-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enviar Mensaje
            </motion.button>
          </div>
        </motion.form>
        <address className="mt-8 text-center not-italic">
          <p className="text-gray-600">O contáctanos directamente:</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-4">
            <a
              href="mailto:info@homecontrol.com"
              className="flex items-center text-gray-700 hover:text-amber-600"
              aria-label="Email us at info@homecontrol.com"
            >
              <Mail className="w-5 h-5 mr-2" /> info@homecontrol.com
            </a>
            <a
              href="tel:+1234567890"
              className="flex items-center text-gray-700 hover:text-amber-600"
              aria-label="Call us at +1 234 567 890"
            >
              <Phone className="w-5 h-5 mr-2" /> +1 234 567 890
            </a>
          </div>
        </address>
      </div>
    </section>
  );
};

export default React.memo(ContactUsSection);