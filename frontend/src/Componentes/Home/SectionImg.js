import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Tilt } from 'react-tilt';

const galleryItems = [
  {
    id: 1,
    src: 'https://www.somfy.es/common/img/library///500x370_cover/Connexoon_Window_Stephane_Rambaud_18_web2.jpg',
    alt: 'Smart home control panel',
    title: 'Persianas',
    description: 'Persianas, contraventanas y estores exteriores motorizados.',
    link: '/products/persianas'
  },
  {
    id: 2,
    src: 'https://www.somfy.es/common/img/library//500x370_cover/blinds-and-curtains.jpg',
    alt: 'Smart lighting system',
    title: 'Estores Eléctricos',
    description: 'Estores eléctricos y cortinas motorizadas para un hogar inteligente.',
    link: '/products/estores-electricos'
  },
  {
    id: 3,
    src: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
    alt: 'Home automation hub',
    title: 'Automation Hub',
    description: 'Conecta y automatiza tus dispositivos inteligentes de forma fluida.',
    link: '/products/automation-hub'
  },
  {
    id: 4,
    src: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
    alt: 'Smart thermostat',
    title: 'Sistemas de Control de Acceso',
    description: 'Cámaras, alarmas y sistemas de seguridad para tu hogar.',
    link: '/products/control-de-acceso'
  },
  {
    id: 5,
    src: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
    alt: 'Security camera interface',
    title: 'Seguridad Avanzada',
    description: 'Monitoriza tu hogar con sistemas de seguridad en tiempo real.',
    link: '/products/seguridad-avanzada'
  },
  {
    id: 6,
    src: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
    alt: 'Voice assistant integration',
    title: 'Smart Home y Automatismos',
    description: 'Controla tu hogar con asistentes de voz y automatismos avanzados.',
    link: '/products/smart-home-automatismos'
  }
];

const GallerySection = () => {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -150]);
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <section className="relative bg-gradient-to-b from-amber-50 via-white to-amber-100 py-32 overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-15"
        style={{
          backgroundImage: `url('https://www.somfy.es/common/img/library///2000x600_cover/port-enery-winter.jpg')`,
          y: parallaxY
        }}
      />

      {/* Ambient Light Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-amber-200/20 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8">
        {/* Header Section with Animation */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Home Control Solutions
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-600 font-medium">
            Transform your home with HomeControl, your trusted partner for seamless smart home automation and connectivity.
          </p>
        </motion.div>

        {/* Interactive Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {galleryItems.map((item, index) => (
            <Tilt
              key={item.id}
              options={{ max: 15, scale: 1.05, speed: 400 }}
              className="w-full"
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                role="article"
                aria-labelledby={`gallery-item-${item.id}`}
              >
                <a href={item.link} aria-label={`Learn more about ${item.title}`}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-72 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </a>
                {/* Overlay with Info */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-amber-900/85 via-amber-900/50 to-transparent flex flex-col justify-end p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: hoveredItem === item.id ? 1 : 0, y: hoveredItem === item.id ? 0 : 20 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <h3 id={`gallery-item-${item.id}`} className="text-2xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-amber-100 leading-relaxed">
                    {item.description}
                  </p>
                  <a
                    href={item.link}
                    className="mt-4 inline-block text-sm font-semibold text-amber-300 hover:text-amber-100 transition-colors duration-200"
                    aria-label={`Learn more about ${item.title}`}
                  >
                    Ver Mas →
                  </a>
                </motion.div>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl h-96">
        <div
          className="relative aspect-[1155/678] w-full bg-gradient-to-tr from-amber-300 to-amber-600 opacity-25"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
          }}
        />
      </div>
    </section>
  );
};

export default GallerySection;