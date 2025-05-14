import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ContactBanner = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleContactClick = () => {
    navigate("/contacto");
  };

  return (
    <motion.div
      className="relative bg-cover bg-center h-64 sm:h-80 md:h-96 flex items-center justify-end px-4 sm:px-8 md:px-12 rounded-2xl shadow-2xl overflow-hidden"
      style={{
        backgroundImage:
          isHovered
            ? `linear-gradient(to right, rgba(120, 53, 15, 0.5), rgba(120, 53, 15, 0.2)), url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
            : `linear-gradient(to right, rgba(120, 53, 15, 0.5), rgba(120, 53, 15, 0.2)), url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
        backgroundPosition: isHovered ? "center 60%" : "center 50%",
        transition: "background-position 0.5s ease-in-out",
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      role="banner"
      aria-label="Banner de contacto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex items-center space-x-4 sm:space-x-6 z-10 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
        <motion.div
          className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-400 rounded-full border-4 border-white flex items-center justify-center"
          animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 12 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </motion.div>
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            ¿Necesitas Ayuda?
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base text-white/90 max-w-xs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Contacta con nuestro equipo de soporte para resolver tus dudas.
          </motion.p>
          <motion.button
            onClick={handleContactClick}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-amber-400 text-white font-semibold rounded-lg shadow-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            aria-label="Ir al formulario de contacto"
          >
            Contáctanos
          </motion.button>
        </div>
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </motion.div>
  );
};

export default ContactBanner;