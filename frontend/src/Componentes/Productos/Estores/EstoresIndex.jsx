import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import EstoresElectricosComponents from './EstoresElectricosComponents';
import EstoresHeroSection from '../ComponetesDeCartas/EstoresHeroSection';

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

function EstoresIndex() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      className="relative bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/10 min-h-screen overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Helmet>
        <title>Componentes de Estores - Elegancia y Funcionalidad</title>
        <meta
          name="description"
          content="Explora nuestros estores con componentes innovadores, diseñados para ofrecer estilo y control en tu hogar."
        />
        <meta name="keywords" content="estores, componentes, motorizados, hogar moderno, diseño" />
      </Helmet>

      {/* Fondo dinámico */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-transparent dark:from-amber-900/10 dark:to-transparent animate-gradient-x" />
        <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,193,7,0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <main className="relative z-10">
        <EstoresHeroSection />
        <EstoresElectricosComponents
          title="Nuestros Componentes de Estores"
          description="Descubre los elementos que combinan tecnología avanzada y diseño elegante para tus estores."
        />
        {/* Botón de contacto */}
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl sm:text-3xl font-semibold text-amber-700 dark:text-amber-300 mb-6">
            ¿Tienes alguna pregunta?
          </h3>
          <a
            href="http://localhost:3000/contacto-atencion-cliente"
            className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg relative overflow-hidden group"
            aria-label="Contactar con atención al cliente"
          >
            <span className="absolute inset-0 bg-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 font-semibold text-lg">Contactar con Atención al Cliente</span>
          </a>
        </motion.div>
      </main>
    </motion.div>
  );
}

// Animaciones CSS personalizadas
const styles = `
  @keyframes gradient-x {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 15s ease infinite;
  }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default EstoresIndex;
