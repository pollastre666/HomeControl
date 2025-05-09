import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const galleryItems = [
  {
    id: 1,
    src: 'https://www.somfy.es/common/img/library///500x370_cover/Connexoon_Window_Stephane_Rambaud_18_web2.jpg',
    alt: 'Smart home control panel',
    title: 'Persianas',
    link: '/Persianas'
  },
  {
    id: 2,
    src: 'https://www.somfy.es/common/img/library//500x370_cover/blinds-and-curtains.jpg',
    alt: 'Smart lighting system',
    title: 'Estores Eléctricos',
    link: '/products/estores-electricos'
  },
  {
    id: 3,
    src: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
    alt: 'Home automation hub',
    title: 'Automation Hub',
    link: '/products/automation-hub'
  },
  {
    id: 4,
    src: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
    alt: 'Smart thermostat',
    title: 'Sistemas de Control de Acceso',
    link: '/products/control-de-acceso'
  },
  {
    id: 5,
    src: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
    alt: 'Security camera interface',
    title: 'Seguridad Avanzada',
    link: '/products/seguridad-avanzada'
  },
  {
    id: 6,
    src: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
    alt: 'Voice assistant integration',
    title: 'Smart Home y Automatismos',
    link: '/products/smart-home-automatismos'
  }
];

const GallerySection = () => {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -150]);

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
            <motion.div
              key={item.id}
              className="relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 h-48 w-full max-w-[300px] mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
              viewport={{ once: true }}
              role="article"
              aria-labelledby={`gallery-item-${item.id}`}
            >
              <Link to={item.link} aria-label={`Learn more about ${item.title}`}>
                <div className="relative w-full h-full group">
                  {/* Image with Zoom Effect */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 group-hover:from-black/75" />
                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3
                      id={`gallery-item-${item.id}`}
                      className="text-xl font-semibold text-white text-center"
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
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