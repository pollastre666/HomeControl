import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

// Animation variants for the title and subtitle
const textVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
  }),
};

const PersianasHeroSection = () => {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, -150]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.15]);

  // Categories with images and links
  const categories = [
    {
      name: "Volets roulants",
      image: "https://www.somfy.es/common/img/library///500x370_cover/Connexoon_Window_Stephane_Rambaud_18_web2.jpg",
      //link: "/blinds-components/volets-roulants",
    },
    {
      name: "Volets battants",
      image: "https://www.somfy.es/common/img/library//500x370_cover/blinds-and-curtains.jpg",
      //link: "/blinds-components/volets-battants",
    },
    {
      name: "Brise-soleil orientables",
      image: "https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg",
      //link: "/blinds-components/brise-soleil",
    },
    {
      name: "Stores extérieurs",
      image: "https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg",
      //link: "/blinds-components/stores-exterieurs",
    },
  ];

  const [activeImage, setActiveImage] = useState(categories[0].image);

  return (
    <div className="relative isolate bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div
        className="relative w-full h-[700px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${activeImage})`,
          y: parallaxY,
          scale,
          backgroundBlendMode: "overlay",
          opacity: 0.85,
        }}
      >
        {/* Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </motion.div>

      {/* Centered Title and Subtitle */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center px-4 w-full max-w-4xl">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-wide drop-shadow-lg"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Persianas y Estores Motorizados
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-md"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Automatiza tu hogar con elegancia y tecnología avanzada: controla la luz, la privacidad y el confort con un solo gesto.
        </motion.p>
      </div>

      {/* Grid of Categories */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to={category.link}
                onClick={() => setActiveImage(category.image)}
                className="block w-full h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.image})` }}
                aria-label={`Cambiar imagen a ${category.name} y explorar`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow-lg">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl h-96">
        <div
          className="relative aspect-[1155/678] w-full bg-gradient-to-tr from-gray-300 to-gray-600 opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
};

export default PersianasHeroSection;