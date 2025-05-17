import React, { useState, useEffect } from "react";
import { useAuth } from "../Autenticacion/AuthProvider";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../Assets/Logos/LogoH.png";
import VerticalMenu from "../Asistencia/Componentes/MenuVertical";
import MobileMenu from "./MobileMenu";

const NavBar = () => {
  const { user, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVerticalMenuOpen, setIsVerticalMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setMenuAbierto(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("No se pudo cerrar sesión. Intenta de nuevo.");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuAbierto) {
      document.body.style.overflow = "hidden";
      const firstLink = document.querySelector("#mobile-menu a");
      if (firstLink) firstLink.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  const toggleVerticalMenu = () => {
    setIsVerticalMenuOpen(!isVerticalMenuOpen);
    setMenuAbierto(false);
  };

  const PlaceholderLogo = () => (
    <svg
      className="h-8 sm:h-10 w-8 sm:w-10 text-amber-400"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
    </svg>
  );

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/Nosotros", label: "Nosotros" },
  ];

  if (user) {
    navLinks.splice(3, 0, { to: "/Tareas", label: "Tareas" });
    navLinks.splice(4, 0, { to: "/User/dashboard", label: "Dashboard" });
    navLinks.splice(5, 0, { to: "/schedules", label: "Horarios" });
  }

  return (
    <>
      <motion.nav
        role="navigation"
        className={`w-full fixed top-0 z-50 bg-amber-600 shadow-lg transition-all duration-300 ${isScrolled ? "py-2 sm:py-2" : "py-3 sm:py-4"} backdrop-blur-md border-b border-amber-400/50`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        aria-label="Navegación principal"
      >
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between max-w-7xl mx-auto flex-wrap">
          <motion.div
            className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="HomeControl Inicio"
            >
              <img
                src={Logo}
                alt="HomeControl Logo"
                className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain shadow-md rounded-sm"
                onError={(e) => (e.target.outerHTML = PlaceholderLogo().props.children)}
              />
            </Link>
            <Link
              to="/"
              className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-white hover:text-amber-400 transition-colors duration-200"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              HomeControl
            </Link>
          </motion.div>

          <div className="hidden lg:flex items-center space-x-4 sm:space-x-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm sm:text-base md:text-lg font-medium text-white transition-colors duration-200 relative ${isActive ? "text-amber-400" : "hover:text-amber-400"} after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-400 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full`
                }
                onClick={() => setMenuAbierto(false)}
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                {link.label}
              </NavLink>
            ))}
            <motion.button
              onClick={toggleVerticalMenu}
              className="text-sm sm:text-base md:text-lg font-medium text-white hover:text-amber-400 transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-400 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Abrir menú de asistencia"
              aria-expanded={isVerticalMenuOpen}
            >
              Asistencia
            </motion.button>

            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Menú de usuario ${user.username || "Usuario"}`}
                  aria-expanded={isDropdownOpen}
                >
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-amber-400 flex items-center justify-center text-white font-semibold shadow-md text-sm sm:text-base">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:inline text-sm sm:text-base font-medium text-white">
                    {user?.username || "Usuario"}
                  </span>
                  <svg
                    className={`w-3 sm:w-4 h-3 sm:h-4 text-white transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-1 sm:mt-2 w-36 sm:w-48 max-w-full bg-white/90 backdrop-blur-md rounded-lg shadow-xl py-1 sm:py-2 border border-amber-200/50 overflow-x-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={() => {
                          navigate("/user/profile");
                          setMenuAbierto(false);
                        }}
                        className="w-full text-left px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-gray-800 hover:bg-amber-100 transition-colors duration-200 flex items-center space-x-1 sm:space-x-2"
                      >
                        <svg
                          className="w-4 sm:w-5 h-4 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Perfil</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-red-600 hover:bg-amber-100 transition-colors duration-200 flex items-center space-x-1 sm:space-x-2"
                      >
                        <svg
                          className="w-4 sm:w-5 h-4 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Cerrar Sesión</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-medium bg-white text-amber-600 rounded-lg hover:bg-amber-50 transition-colors duration-200 shadow-md"
                  onClick={() => setMenuAbierto(false)}
                  aria-label="Iniciar Sesión"
                >
                  Iniciar Sesión
                </Link>
              </motion.div>
            )}
          </div>

          <motion.button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="lg:hidden text-white focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md p-2 min-w-[40px]"
            whileTap={{ scale: 0.9 }}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-controls="mobile-menu"
            aria-expanded={menuAbierto}
          >
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuAbierto ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </motion.button>
        </div>
      </motion.nav>

      <MobileMenu
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
        navLinks={navLinks}
        user={user}
        handleLogout={handleLogout}
        navigate={navigate}
        toggleVerticalMenu={toggleVerticalMenu}
      />

      <AnimatePresence>
        {isVerticalMenuOpen && (
          <VerticalMenu isOpen={isVerticalMenuOpen} setIsOpen={setIsVerticalMenuOpen} />
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;