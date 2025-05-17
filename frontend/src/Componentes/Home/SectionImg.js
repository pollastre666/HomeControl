import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import GalleryCardHero from '../Productos/ComponetesDeCartas/GalleryCardHero'; 

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

const headerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};

const GallerySection = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const memoizedItems = useMemo(() => galleryItems, []);

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-100 py-12 sm:py-16 lg:py-24 overflow-hidden">
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
        <motion.div
          className="text-center mb-10 sm:mb-12 lg:mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Soluciones HomeControl
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base lg:text-lg leading-7 text-gray-600 font-medium">
            Transforma tu hogar con soluciones de automatización inteligentes y conectadas.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
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