import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SeccionFeatures = () => {
  const features = [
    {
      title: "Control Inteligente",
      description:
        "Gestiona luces, persianas y electrodomésticos desde tu móvil con nuestra app intuitiva, optimizando el confort y la eficiencia en tu hogar.",
      icon: (
        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Ahorro Energético",
      description:
        "Automatiza el uso de energía con horarios personalizados y sensores, reduciendo tu factura eléctrica y cuidando el medio ambiente.",
      icon: (
        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Seguridad Avanzada",
      description:
        "Protege tu hogar con alarmas inteligentes y cámaras integradas, recibiendo alertas en tiempo real desde cualquier lugar.",
      icon: (
        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-2.76-2.24-5-5-5S2 8.24 2 11v8h10v-8zm0 0c0-2.76 2.24-5 5-5s5 2.24 5 5v8H12v-8z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-gradient-to-b from-amber-50 to-white py-12 sm:py-16">
      <div className="container px-6 mx-auto max-w-7xl">
        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-12 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Características de HomeControl
        </motion.h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-amber-200/50 transition-all duration-300 hover:shadow-xl hover:border-amber-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              role="article"
              aria-labelledby={`feature-title-${index}`}
            >
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 id={`feature-title-${index}`} className="ml-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/Mas-Informacin"
                  className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors duration-200"
                  aria-label={`Más información sobre ${feature.title}`}
                >
                  Saber más
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeccionFeatures;