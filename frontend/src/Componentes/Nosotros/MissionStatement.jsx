// src/Componentes/Nosotros/MissionStatement.js
import React from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { Home } from 'lucide-react';

const MissionStatement = () => {
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, -100]);

  React.useEffect(() => {
    controls.start({
      background: [
        'radial-gradient(circle at 30% 40%, #f8d39a, #f9c8a2)', // Ámbar más suave
        'radial-gradient(circle at 70% 60%, #f9c8a2, #f8d39a)',
      ],
      transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
    });
  }, [controls]);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
  };

  return (
    <motion.section
      className="relative py-16 overflow-hidden"
      animate={controls}
      initial={{ background: 'radial-gradient(circle at 50% 50%, #f8d39a, #f9c8a2)' }}
    >
      {/* Imagen de fondo con parallax */}
      <motion.div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-15" // Opacidad reducida
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')`,
          y: parallaxY,
        }}
      />

      {/* Overlay para legibilidad */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-amber-800/30 to-transparent opacity-60" /> {/* Opacidad reducida */}

      {/* Elementos decorativos flotantes más sutiles */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-amber-200/15 rounded-full blur-xl" // Tamaño y opacidad reducidos
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-24 h-24 bg-amber-200/15 rounded-full blur-xl" // Tamaño y opacidad reducidos
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Contenido principal */}
      <div className="container mx-auto px-4 text-center relative z-10 text-white">
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={textVariants}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
          >
            Nuestra Misión
          </motion.h1>
          <motion.p
            variants={textVariants}
            className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto"
          >
            Innovar el futuro del hogar con soluciones inteligentes que combinen eficiencia energética, seguridad y confort, transformando la vida de nuestros clientes.
          </motion.p>
          <motion.div
            className="flex justify-center relative"
            variants={textVariants}
            animate={{ scale: [1, 1.05, 1], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }} // Movimiento más suave
          >
            <motion.div
              className="absolute w-14 h-14 bg-amber-200/20 rounded-full blur-md" // Tamaño y opacidad reducidos
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <Home className="w-12 h-12 text-amber-300 relative z-10" />
          </motion.div>
        </motion.div>
      </div>

      {/* Overlay decorativo en la parte inferior */}
      <motion.div
        className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl h-96"
        animate={{ opacity: [0.2, 0.3, 0.2] }} // Opacidad más baja
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="relative aspect-[1155/678] w-full bg-gradient-to-tr from-amber-200 to-amber-300 opacity-20" // Colores más suaves
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </motion.div>
    </motion.section>
  );
};

export default MissionStatement;