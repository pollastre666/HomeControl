import React, { useState } from 'react';
import { useAuth } from '../Autenticacion/AuthContext';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../../Assets/Logos/LogoH.png';

const BarraNavegacion = () => {
  const { user, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const cerrarMenu = () => setMenuAbierto(false);

  const handleLogout = () => {
    logout();
    cerrarMenu();
    window.location.href = '/login'; // Redirigir a la página de inicio de sesión después de cerrar sesión
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="w-full py-6 top-0 flex justify-between items-center transition duration-300 ease-in-out z-40 bg-blue-700 shadow-lg">
      {/* Contenedor principal */}
      <div className="px-4 sm:px-6 flex items-center justify-between w-full">
        {/* Logo y Nombre de la Marca */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="HomeControl Logo" className="h-12 w-auto transition-transform duration-300 hover:scale-105" />
          </Link>
          <Link to="/" className="text-2xl font-serif font-bold tracking-wide text-white hover:text-amber-200 transition-colors duration-300">
            HomeControl
          </Link>
        </div>

        {/* Menú Desktop */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavLink
            to="/"
            className="text-lg font-medium text-white hover:text-amber-200 transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-200 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full"
            onClick={cerrarMenu}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/Horarios"
            className="text-lg font-medium text-white hover:text-amber-200 transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-200 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full"
            onClick={cerrarMenu}
          >
            Horarios
          </NavLink>
         <NavLink
            to="/#"
            className="text-lg font-medium text-white hover:text-amber-200 transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-200 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full"
            onClick={cerrarMenu}
          >
            Tareas
          </NavLink> 
{/*         <NavLink
            to="/#"
            className="text-lg font-medium text-white hover:text-amber-200 transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-200 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full"
            onClick={cerrarMenu}
          >
            Control Doméstico
          </NavLink>*/}
          <NavLink
            to="/Asistencia"
            className="text-lg font-medium text-white hover:text-amber-200 transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-200 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full"
            onClick={cerrarMenu}
          >
            Asistencia
          </NavLink>
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-amber-600 hover:bg-amber-500 transition-colors duration-300"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            )}
          </button>

          {/* User Profile or Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline text-lg font-medium text-white">{user?.username || 'Usuario'}</span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-10 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-200">
                    {/*<p className="text-sm font-medium">Rol: {user?.role || 'Usuario'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'Sin'}</p>*/}
                  </div>
                  <button
                    onClick={() => {
                      window.location.href = '/user/profile'; // Adjust based on your routing needs
                      cerrarMenu();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-amber-100 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Perfil</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-amber-100 transition-colors duration-200 flex items-center space-x-2 text-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 text-base font-medium bg-amber-600 text-white rounded-md hover:bg-amber-500 transition-colors duration-300"
              onClick={cerrarMenu}
            >
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="lg:hidden text-white focus:outline-none"
          aria-label="Abrir menú"
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Menú móvil */}
      <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform duration-300 ${menuAbierto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-amber-800 w-64 h-full shadow-lg p-5 flex flex-col">
          <button onClick={cerrarMenu} className="self-end text-white text-2xl">×</button>

          <NavLink
            to="/"
            className="text-white py-2 hover:text-amber-200 transition-colors duration-300"
            onClick={cerrarMenu}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/Horarios"
            className="text-white py-2 hover:text-amber-200 transition-colors duration-300"
            onClick={cerrarMenu}
          >
            Horarios
          </NavLink>
          <NavLink
            to="/#"
            className="text-white py-2 hover:text-amber-200 transition-colors duration-300"
            onClick={cerrarMenu}
          >
            Tasques
          </NavLink>
         {/* <NavLink
            to="/#"
            className="text-white py-2 hover:text-amber-200 transition-colors duration-300"
            onClick={cerrarMenu}
          >
            Control Doméstico
          </NavLink>*/}
          <NavLink
            to="/#"
            className="text-lg font-medium text-white hover:text-amber-200 transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-200 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full"
            onClick={cerrarMenu}
          >
            Asistencia
          </NavLink> 
          {/* Theme Toggle in Mobile Menu */}
          <button
            onClick={toggleDarkMode}
            className="mt-4 flex items-center space-x-2 text-white py-2 hover:text-amber-200 transition-colors duration-300"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            )}
            <span>{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>

          {user ? (
            <>
              <div className="mt-4 flex items-center space-x-2 text-white py-2">
                <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span>{user?.username || 'Usuario'}</span>
              </div>
              <button
                onClick={() => {
                  window.location.href = '/profile'; // Adjust based on your routing needs
                  cerrarMenu();
                }}
                className="mt-2 text-white py-2 hover:text-amber-200 transition-colors duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Perfil</span>
              </button>
              <button
                onClick={handleLogout}
                className="mt-2 text-red-400 py-2 hover:text-red-300 transition-colors duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="mt-4 px-6 py-3 bg-amber-600 text-white text-center rounded-md hover:bg-amber-500 transition-colors duration-300"
              onClick={cerrarMenu}
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BarraNavegacion;