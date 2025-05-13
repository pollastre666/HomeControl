import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SupportCard = ({ title, description, icon, buttonText, route, ariaLabel }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 flex flex-col items-start"
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="flex items-center mb-4">
        <motion.div
          className="w-8 h-8 text-amber-600 mr-3"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 tracking-tight">
          {title}
        </h3>
      </div>
      {description && <p className="text-gray-600 text-sm sm:text-base mb-6">{description}</p>}
      <motion.button
        onClick={() => navigate(route)}
        className="bg-amber-400 text-gray-800 font-semibold py-2 px-4 rounded-full hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={ariaLabel}
      >
        {buttonText}
      </motion.button>
    </motion.div>
  );
};

export default SupportCard;