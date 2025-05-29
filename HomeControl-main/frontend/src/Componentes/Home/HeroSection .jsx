import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, -100]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.1]);

  return (
    <div className="relative isolate bg-gradient-to-b from-amber-50 via-white to-amber-100 overflow-hidden">
      <motion.div
        className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: `url('https://www.somfy.es/common/img/library///2000x600_cover/port-enery-winter.jpg')`,
          y: parallaxY,
          scale,
          backgroundBlendMode: "overlay",
          opacity: 0.9,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent" />
      </motion.div>
      <motion.div
        className="absolute left-4 sm:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full max-w-[90%] sm:max-w-md lg:max-w-lg border border-amber-200/50"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        role="complementary"
        aria-labelledby="hero-cta-title"
      >
        <h2 id="hero-cta-title" className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
          Ahorra energía con HomeControl
        </h2>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
          Transforma tu hogar con nuestras soluciones inteligentes. Controla luces, persianas y más para maximizar la eficiencia energética y el confort.
        </p>
        <motion.div
          className="mt-4 sm:mt-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/Mas-Informacion"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-amber-500 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-colors duration-200"
            aria-label="Obtener más información sobre HomeControl"
          >
            Más información
          </Link>
        </motion.div>
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl h-96">
        <div
          className="relative aspect-[1155/678] w-full bg-gradient-to-tr from-amber-300 to-amber-600 opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
};

export default HeroSection;