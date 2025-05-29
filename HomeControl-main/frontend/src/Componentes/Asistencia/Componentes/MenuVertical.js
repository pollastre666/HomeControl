import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const VerticalMenu = ({ isOpen, setIsOpen }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const handleClose = () => setIsOpen(false);
const menuItems = [

  {
    label: "Contacto",
    to: "/contacto",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className="fixed top-0 right-0 w-80 sm:w-96 h-full bg-white/80 backdrop-blur-lg border-l border-amber-200 shadow-2xl z-50 rounded-l-2xl"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          role="navigation"
          aria-label="Menú de asistencia"
        >
          <div className="flex justify-end p-4">
            <motion.button
              onClick={handleClose}
              className="text-amber-700 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-full p-2 transition-colors duration-200"
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Cerrar menú de asistencia"
              title="Cerrar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>

          <div className="px-6 py-4">
            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-1 tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Asistencia
            </motion.h2>
            <motion.p
              className="text-sm text-gray-700 mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
            
            </motion.p>

            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={item.to}
                    className="flex items-center text-lg text-amber-700 hover:text-amber-900 hover:bg-amber-100/60 transition-all duration-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-300 focus:outline-none"
                    onClick={handleClose}
                    aria-current={item.to === window.location.pathname ? "page" : undefined}
                  >
                    <motion.div
                      className="mr-3"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.icon}
                    </motion.div>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerticalMenu;
