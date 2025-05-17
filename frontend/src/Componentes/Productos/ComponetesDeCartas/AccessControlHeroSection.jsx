import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaCamera, FaKey } from "react-icons/fa";

const contentVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } } };
const buttonVariants = { hidden: { opacity: 0, x: 40 }, visible: (index) => ({ opacity: 1, x: 0, transition: { duration: 0.7, delay: index * 0.3, ease: "easeOut" } }) };
const descriptionVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

const AccessControlHeroSection = () => {
  const categories = [
    { name: "Cerraduras Inteligentes", image: "https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg", description: "Accede a tu hogar de forma segura con nuestras cerraduras inteligentes.", icon: <FaLock className="mr-3 text-xl text-white" /> },
    { name: "Videoporteros", image: "https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg", description: "Visualiza y comunica con tus visitantes desde cualquier lugar.", icon: <FaCamera className="mr-3 text-xl text-white" /> },
    { name: "Control de Llaves", image: "https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg", description: "Gestiona el acceso de tu hogar con sistemas de control de llaves avanzados.", icon: <FaKey className="mr-3 text-xl text-white" /> },
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
          <motion.div className="w-full lg:w-1/2 flex flex-col gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={contentVariants}>
            <div className="p-4 bg-white/95 rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
              <motion.img src={activeImage} alt="Vista destacada de control de acceso por HomeControl" className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg transition-opacity duration-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} loading="lazy" />
            </div>
            <motion.p key={activeDescription} className="text-amber-700 text-lg font-medium leading-relaxed text-center lg:text-left" initial="hidden" animate="visible" variants={descriptionVariants}>
              {activeDescription}
            </motion.p>
          </motion.div>
          <motion.div className="w-full lg:w-1/2 flex flex-col items-end gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-amber-800 leading-relaxed text-center lg:text-right tracking-wide" variants={contentVariants}>
              Simplifica tu seguridad con el Control de Acceso de HomeControl
            </motion.h2>
            <div className="flex flex-col items-end gap-6">
              {categories.map((category, index) => (
                <motion.div key={category.name} variants={buttonVariants} custom={index} className="w-full max-w-md">
                  <Link to={category.link || "#"} onClick={() => handleCategoryClick(category)} className="flex items-center justify-center w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl py-4 px-6 shadow-lg hover:from-amber-600 hover:to-amber-700 hover:shadow-xl transition-all duration-300" aria-label={`Explorar ${category.name} con HomeControl`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
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

export default AccessControlHeroSection;