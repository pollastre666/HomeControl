import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWindowMaximize, FaBlender, FaTv } from "react-icons/fa";

// Animation variants for the title and image
const contentVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

// Animation variants for the buttons
const buttonVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: index * 0.3, ease: "easeOut" },
  }),
};

// Animation variant for the description text
const descriptionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const PersianasHeroSection = () => {
const categories = [
  {
    name: "Estores enrollables eléctricos",
    image: "https://www.somfy.es/common/img/library///850x650_cover/1-motorized-roller-shutters.png",
    description: "Disfruta de luz natural con solo un clic y olvídate de subir o bajar estores manualmente.",
    icon: <FaWindowMaximize className="mr-3 text-xl text-white" />,
  },
  {
    name: "Cortinas con motor",
    image: "https://www.somfy.es/common/img/library///850x650_cover/2-motorized-swing-shutters.png",
    description: "Abre tus cortinas desde el sofá o programa su apertura diaria al amanecer.",
    icon: <FaBlender className="mr-3 text-xl text-white" />,
  },
  {
    name: "Pantallas de proyección motorizadas",
    image: "https://www.somfy.es/common/img/library///850x650_cover/4-motorzied-external-venetian-blinds.png",
    description: "Crea tu cine en casa con pantallas que se despliegan automáticamente cuando lo necesitas.",
    icon: <FaTv className="mr-3 text-xl text-white" />,
  },
];


  const [activeImage, setActiveImage] = useState(categories[0].image);
  const [activeDescription, setActiveDescription] = useState(categories[0].description);

  const handleCategoryClick = (category) => {
    setActiveImage(category.image);
    setActiveDescription(category.description);
  };

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-100 py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-16">
          {/* Image and description */}
          <motion.div
            className="w-full lg:w-1/2 flex flex-col gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={contentVariants}
          >
            <div className="p-4 bg-white/95 rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
              <motion.img
                src={activeImage}
                alt="Vista destacada de cortinas por HomeControl"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg transition-opacity duration-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                loading="lazy"
              />
            </div>
            <motion.p
              key={activeDescription}
              className="text-amber-700 text-lg font-medium leading-relaxed text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={descriptionVariants}
            >
              {activeDescription}
            </motion.p>
          </motion.div>

          {/* Title and buttons */}
          <motion.div
            className="w-full lg:w-1/2 flex flex-col items-end gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-amber-800 leading-relaxed text-center lg:text-right tracking-wide"
              variants={contentVariants}
            >
              Persianas que te dan confort, estilo y control
            </motion.h2>
            <div className="flex flex-col items-end gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  variants={buttonVariants}
                  custom={index}
                  className="w-full max-w-md"
                >
                  <Link
                    to={category.link || "#"}
                    onClick={() => handleCategoryClick(category)}
                    className="flex items-center justify-center w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl py-4 px-6 shadow-lg hover:from-amber-600 hover:to-amber-700 hover:shadow-xl transition-all duration-300"
                    aria-label={`Explorar ${category.name} con HomeControl`}
                  >
                    {category.icon}
                    <span className="text-lg">{category.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PersianasHeroSection;
