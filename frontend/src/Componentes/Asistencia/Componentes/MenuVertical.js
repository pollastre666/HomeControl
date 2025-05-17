import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const VerticalMenu = ({ isOpen, setIsOpen }) => {
  const menuRef = useRef(null);

  // Handle click outside to close menu
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

  if (!isOpen) return null;

  const menuItems = [
    {
      label: "Productos",
      to: "/productos",
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
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      label: "Preguntas Frecuentes",
      to: "/faq",
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
            d="M8 12h.01M12 12h.01M16 12h.01M9 16h6m-7 4h8a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "Videos Tutoriales",
      to: "/tutoriales",
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
            d="M14.752 11.168l-3.197-2.2A1 1 0 0010 9.768v4.464a1 1 0 001.555.832l3.197-2.2a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
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
          className="fixed top-0 right-0 w-80 sm:w-96 h-full bg-gradient-to-b from-amber-50 to-amber-100 shadow-2xl z-50 rounded-l-xl backdrop-blur-md border-l border-amber-200/50"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
          role="navigation"
          aria-label="Menú de asistencia"
        >
          <div className="flex justify-end p-4">
            <motion.button
              onClick={handleClose}
              className="text-amber-600 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full p-1 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Cerrar menú de asistencia"
            >
              <svg
                className="w-7 h-7"
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
              className="text-2xl font-semibold text-gray-800 mb-2 tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Asistencia
            </motion.h2>
            <motion.p
              className="text-sm text-gray-600 mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Obtén ayuda con tu sistema HomeControl
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
                    className="flex items-center text-amber-600 hover:text-amber-800 hover:bg-amber-100/50 text-lg font-medium transition-all duration-200 rounded-md px-3 py-2"
                    onClick={handleClose}
                    aria-current={item.to === window.location.pathname ? "page" : undefined}
                  >
                    <motion.div
                      className="mr-3"
                      whileHover={{ scale: 1.2 }}
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