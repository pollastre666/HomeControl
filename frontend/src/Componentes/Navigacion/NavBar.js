import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from '../../Assets/Logos/LogoH.png';

const BarraNavegacion = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="w-full py-6 top-0 flex justify-between items-center transition duration-300 ease-in-out z-40 bg-[#2a6f97] shadow-md dark:bg-oscuro">
      {/* Contenedor principal */}
      <div className="px-4 sm:px-6 flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} width={130} height={130} alt="Logo" />
        </Link>

        {/* Menú Desktop */}
        <div className="hidden lg:flex space-x-6">
          <NavLink to="/" className="text-lg font-medium text-white hover:text-gray-300 transition">Inicio</NavLink>
          <NavLink to="/Horarios" className="text-lg font-medium text-white hover:text-gray-300 transition">Horarios</NavLink>
          <NavLink to="/#" className="text-lg font-medium text-white hover:text-gray-300 transition">Tasques</NavLink>
          <NavLink to="/#" className="text-lg font-medium text-white hover:text-gray-300 transition">Control Doméstico</NavLink>

          {/* Botón Login */}
          <Link to="/login" className="px-6 py-2 text-base font-medium bg-black text-white rounded-md hover:bg-gray-700 transition">
            Iniciar sesión
          </Link>
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
      <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform duration-300 ${menuAbierto ? "translate-x-0" : "translate-x-full"}`}>
        <div className="bg-gray-800 w-64 h-full shadow-lg p-5 flex flex-col">
          <button onClick={cerrarMenu} className="self-end text-white text-2xl">&times;</button>

          <NavLink to="/" className="text-white py-2" onClick={cerrarMenu}>Inicio</NavLink>
          <NavLink to="/Horarios" className="text-white py-2" onClick={cerrarMenu}>Horarios</NavLink>
          <NavLink to="/#" className="text-white py-2" onClick={cerrarMenu}>Tasques</NavLink>
          <NavLink to="/#" className="text-white py-2" onClick={cerrarMenu}>Control Doméstico</NavLink>

          <Link to="/login" className="mt-4 px-6 py-3 bg-blue-600 text-white text-center rounded-md hover:bg-blue-500 transition" onClick={cerrarMenu}>
            Iniciar sesión
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BarraNavegacion;
