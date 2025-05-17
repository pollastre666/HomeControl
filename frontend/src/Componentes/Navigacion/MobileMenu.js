import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from "react-router-dom";

const MobileMenu = ({ menuAbierto, setMenuAbierto, navLinks, user, handleLogout, navigate, toggleVerticalMenu }) => {
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <AnimatePresence>
      {menuAbierto && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={cerrarMenu}
            aria-hidden="true"
          />
          <motion.div
            id="mobile-menu"
            className="fixed top-0 left-0 h-full w-[90%] max-w-[350px] bg-amber-700 z-50 shadow-2xl overflow-y-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col h-full p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" onClick={cerrarMenu} aria-label="HomeControl Inicio">
                  <img
                    src="/Assets/Logos/LogoH.png"
                    alt="HomeControl Logo"
                    className="h-12 sm:h-14 w-auto shadow-md rounded-sm"
                    onError={(e) => (e.target.outerHTML = <svg className="h-12 sm:h-14 w-12 sm:w-14 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" /></svg>)}
                  />
                </Link>
                <motion.button
                  onClick={cerrarMenu}
                  className="text-white text-3xl sm:text-4xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Cerrar menú"
                >
                  ×
                </motion.button>
              </div>
              <nav aria-label="Menú de navegación móvil">
                <ul className="space-y-6">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `block text-xl sm:text-2xl font-semibold text-white py-4 px-6 rounded-lg transition-colors duration-200 ${isActive ? "bg-amber-800 text-amber-300" : "hover:bg-amber-800 hover:text-amber-300"}`
                        }
                        onClick={cerrarMenu}
                        aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                      >
                        {link.label}
                      </NavLink>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: navLinks.length * 0.1 }}
                  >
                    <button
                      onClick={toggleVerticalMenu}
                      className="block text-xl sm:text-2xl font-semibold text-white py-4 px-6 rounded-lg hover:bg-amber-800 hover:text-amber-300 transition-colors duration-200 w-full text-left"
                      aria-label="Abrir menú de asistencia"
                    >
                      Asistencia
                    </button>
                  </motion.li>
                </ul>
              </nav>
              <div className="mt-10 border-t border-amber-400/50 pt-6">
                {user ? (
                  <>
                    <motion.div
                      className="flex items-center space-x-4 mb-6 px-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (navLinks.length + 1) * 0.1 }}
                    >
                      <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                        {user.username.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="text-xl sm:text-2xl font-semibold text-white truncate">
                        {user?.username || "Usuario"}
                      </span>
                    </motion.div>
                    <motion.button
                      onClick={() => {
                        navigate("/user/profile");
                        cerrarMenu();
                      }}
                      className="block text-xl sm:text-2xl font-semibold text-white py-4 px-6 rounded-lg hover:bg-amber-800 hover:text-amber-300 transition-colors duration-200 w-full text-left flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (navLinks.length + 2) * 0.1 }}
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Perfil</span>
                    </motion.button>
                    <motion.button
                      onClick={handleLogout}
                      className="block text-xl sm:text-2xl font-semibold text-red-400 py-4 px-6 rounded-lg hover:bg-amber-800 hover:text-red-300 transition-colors duration-200 w-full text-left flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (navLinks.length + 3) * 0.1 }}
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Cerrar Sesión</span>
                    </motion.button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (navLinks.length + 1) * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/login"
                      className="block px-6 py-3 text-xl sm:text-2xl font-semibold bg-white text-amber-700 text-center rounded-lg hover:bg-amber-100 transition-colors duration-200 shadow-md"
                      onClick={cerrarMenu}
                      aria-label="Iniciar Sesión"
                    >
                      Iniciar Sesión
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;