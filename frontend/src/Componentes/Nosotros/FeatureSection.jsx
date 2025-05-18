import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } },
};

const FeatureSection = () => {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 800], [0, -150]);
  const lightPosition = useTransform(scrollY, [0, 800], [0, 100]);

  const benefits = [
    'Automatización avanzada para tu hogar',
    'Eficiencia energética hasta un 30%',
    'Seguridad mejorada con IA',
    'Control remoto desde cualquier dispositivo',
  ];

  return (
    <section
      className="relative bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 py-32 overflow-hidden"
      aria-label="HomeControl Features"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://www.somfy.es/common/img/library///2000x600_cover/port-enery-winter.jpg')`,
          y: parallaxY,
        }}
      />

      {/* Dynamic Light Effect */}
      <motion.div
        className="absolute inset-0 -z-10 bg-amber-400/10 rounded-full blur-3xl"
        style={{ x: lightPosition, y: lightPosition }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
          {/* Text and Benefits */}
          <motion.article
            className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-amber-200/50"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)' }}
            role="region"
            aria-labelledby="about-us-heading"
          >
            <h2
              id="about-us-heading"
              className="text-3xl sm:text-4xl font-extrabold text-amber-800 tracking-tight mb-6"
            >
              ¿Por qué elegir HomeControl?
            </h2>
            <p className="text-lg text-gray-800 leading-relaxed mb-6" aria-describedby="about-us-heading">
              En HomeControl, combinamos innovación y pasión para transformar tu hogar con soluciones inteligentes.
            </p>
            <ul className="space-y-4" role="list">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={benefit}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-center text-gray-600 before:content-['✓'] before:text-amber-500 before:mr-2"
                  role="listitem"
                >
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </motion.article>

          {/* Interactive Image */}
          <motion.figure
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg"
              alt="HomeControl showcasing smart home technology"
              className="w-full h-auto rounded-2xl shadow-xl border border-amber-200/30 object-cover"
              loading="lazy"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-transparent rounded-2xl"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.figure>
        </div>
      </div>

      {/* Decorative Overlay */}
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl h-96">
        <div
          className="relative aspect-[1155/678] w-full bg-gradient-to-tr from-amber-300 to-amber-600 opacity-40"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </section>
  );
};

export default React.memo(FeatureSection);