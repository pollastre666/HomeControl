import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FeatureSection = () => {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 800], [0, -100]);

  return (
    <section className="relative bg-gradient-to-b from-amber-50 via-white to-amber-100 py-24 overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-15"
        style={{
          backgroundImage: `url('https://www.somfy.es/common/img/library///2000x600_cover/port-enery-winter.jpg')`,
          y: parallaxY
        }}
      />

      {/* Ambient Light Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-amber-200/30 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:items-center md:gap-12">
          {/* Text Content */}
          <motion.div
            className="md:col-span-1 bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-amber-200/50"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            role="region"
            aria-labelledby="about-us-heading"
          >
            <div className="max-w-lg md:max-w-none">
              <h2
                id="about-us-heading"
                className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4"
              >
                About HomeControl
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At HomeControl, we’re dedicated to revolutionizing the way you live with state-of-the-art smart home solutions. Our expert team combines innovation and passion to deliver seamless automation, enhancing comfort, security, and efficiency for every home.
              </p>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src="https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg"
              alt="HomeControl team showcasing smart home technology"
              className="w-full h-auto rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-amber-200/30"
            />
          </motion.div>
        </div>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl h-96">
        <div
          className="relative aspect-[1155/678] w-full bg-gradient-to-tr from-amber-300 to-amber-600 opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
          }}
        />
      </div>
    </section>
  );
};

export default FeatureSection;