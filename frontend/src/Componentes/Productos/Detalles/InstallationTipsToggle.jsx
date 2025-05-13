import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

// Variantes de animación
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] },
  },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95, transition: { duration: 0.2 } },
};

const contentVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    marginTop: 24,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

const InstallationTipsToggle = ({ tips }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const toggleId = `tips-toggle-${Date.now()}`;
  const controls = useAnimation();

  if (!tips) return null;

  // Convertir tips en una lista si es un string
  const tipsList = typeof tips === 'string' ? tips.split('. ').filter(Boolean) : tips;

  // Copiar consejos al portapapeles
  const handleCopy = async () => {
    await navigator.clipboard.writeText(tipsList.join('. '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      className="relative py-16 bg-gradient-to-br from-gray-50 to-amber-50/30 dark:from-gray-900 dark:to-amber-900/10 rounded-3xl overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
    >
      {/* Fondo decorativo */}
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

      {/* Contenido principal */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-amber-700 dark:text-amber-300 mb-10 text-center tracking-wide drop-shadow-md">
          Consejos de Instalación
        </h2>
        <motion.button
          onClick={() => {
            setShowDetails(!showDetails);
            controls.start(showDetails ? 'hidden' : 'visible');
          }}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white px-6 py-4 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg flex items-center justify-center space-x-3 group"
          aria-expanded={showDetails}
          aria-controls={toggleId}
          aria-label={showDetails ? 'Ocultar consejos de instalación' : 'Mostrar consejos de instalación'}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span className="font-semibold text-lg">
            {showDetails ? 'Ocultar Detalles' : 'Mostrar Detalles'}
          </span>
          <motion.div
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            {showDetails ? (
              <ChevronUp className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            )}
          </motion.div>
        </motion.button>
        <motion.div
          id={toggleId}
          initial="hidden"
          animate={showDetails ? 'visible' : 'hidden'}
          variants={contentVariants}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8 text-gray-700 dark:text-gray-300 text-lg leading-relaxed border border-gray-200/30 dark:border-gray-700/30"
        >
          <ul className="list-disc list-inside space-y-4">
            {tipsList.map((tip, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300">
                {tip}{tip.endsWith('.') ? '' : '.'}
              </li>
            ))}
          </ul>
          <motion.button
            onClick={handleCopy}
            className="mt-6 flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={copied ? 'Consejos copiados' : 'Copiar consejos al portapapeles'}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copiar Consejos</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Botón de Contacto */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-2xl sm:text-3xl font-semibold text-amber-700 dark:text-amber-300 mb-6">
            ¿Necesitas Ayuda con la Instalación?
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
      </div>
    </motion.section>
  );
};

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

export default InstallationTipsToggle;