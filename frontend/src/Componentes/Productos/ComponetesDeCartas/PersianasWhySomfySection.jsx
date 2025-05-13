import React from "react";
import { motion } from "framer-motion";

// Animation variants for the title
const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

// Animation variants for the cards
const cardVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: index * 0.2, ease: "easeOut" },
  }),
};

const PersianasWhySomfySection = () => {
  const cards = [
    { text: "Estores enrollables eléctricos" },
    { text: "Cortinas con motor" },
    { text: "Pantallas de proyección motorizadas"},
  ];

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://www.somfy.es/common/img/library///500x370_cover/Connexoon_Window_Stephane_Rambaud_18_web2.jpg"
          alt="Interior con cortinas"
          className="w-full h-full object-cover opacity-80"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Title */}
          <motion.div
            className="lg:w-1/2 text-center lg:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={titleVariants}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-lg">
              Descubre por qué tener cortinas eléctricas y estores automatizados con Somfy
            </h2>
          </motion.div>

          {/* Cards */}
          <div className="lg:w-1/2 flex flex-col items-center lg:items-end gap-4">
            {cards.map((card, index) => (
              <motion.a
                key={card.text}
                href={card.link}
                className="w-full max-w-xs bg-white/90 rounded-full py-3 px-6 text-center text-gray-800 font-semibold shadow-md hover:bg-white hover:shadow-lg transition-all duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                custom={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {card.text}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersianasWhySomfySection;