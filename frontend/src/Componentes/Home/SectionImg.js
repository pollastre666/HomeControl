import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import GalleryCardHero from '../Productos/ComponetesDeCartas/GalleryCardHero'; 

// Gallery items data (exactly six items)
const galleryItems = [
  {
    id: 1,
    src: 'https://www.somfy.es/common/img/library///500x370_cover/Connexoon_Window_Stephane_Rambaud_18_web2.jpg',
    alt: 'Smart home control panel',
    title: 'Persianas',
    link: '/Persianas',
    description: 'Control de luz y privacidad con persianas motorizadas.',
  },
  {
    id: 2,
    src: 'https://www.somfy.es/common/img/library//500x370_cover/blinds-and-curtains.jpg',
    alt: 'Smart lighting system',
    title: 'Estores Eléctricos',
    link: '/Estores',
    description: 'Estores elegantes con automatización avanzada.',
  },
  {
    id: 3,
    src: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
    alt: 'Home automation hub',
    title: 'Automation Hub',
    link: '/automation-hub',
    description: 'Centraliza el control de tu hogar inteligente.',
  },
  {
    id: 4,
    src: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
    alt: 'Smart access control',
    title: 'Control de Acceso',
    link: '/access-control',
    description: 'Acceso seguro y simplificado para tu hogar.',
  },
  {
    id: 5,
    src: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
    alt: 'Advanced security interface',
    title: 'Seguridad Avanzada',
    link: '/advanced-security',
    description: 'Protección total con cámaras y alarmas inteligentes.',
  },
  {
    id: 6,
    src: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
    alt: 'Smart home automation',
    title: 'Smart Home Automatismos',
    link: '/smart-home-automation',
    description: 'Automatización completa para un hogar conectado.',
  },
];

// Animation variants for header
const headerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};

const GallerySection = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  // Memoize gallery items
  const memoizedItems = useMemo(() => galleryItems, []);

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-100 py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-amber-200/30 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-96 transform-gpu overflow-hidden blur-3xl">
        <div
          className="relative aspect-[1155/678] w-full bg-gradient-to-tr from-amber-300 to-amber-600 opacity-20"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Soluciones HomeControl
          </h1>
          <p className="mx-auto max-w-2xl sm:max-w-3xl text-base sm:text-lg leading-7 text-gray-600 font-medium">
            Transforma tu hogar con soluciones de automatización inteligentes y conectadas.
          </p>
        </motion.div>

        {/* Interactive Image Grid with GalleryCardHero */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {memoizedItems.map((item, index) => (
            <GalleryCardHero
              key={item.id}
              title={item.title}
              description={item.description}
              image={item.src}
              link={item.link}
              index={index}
              onHover={() => setHoveredItem(item.id)}
              onLeave={() => setHoveredItem(null)}
              isHovered={hoveredItem === item.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;