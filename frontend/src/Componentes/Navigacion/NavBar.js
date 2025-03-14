import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from '../../Assets/Logos/LogoH.png';

const BarraNavegacion = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="w-full py-6 top-0 transition duration-300 ease-in-out z-40 fixed bg-[#F8F6F5] shadow-md dark:bg-oscuro">
      <div className="px-4 sm:px-6">
        <div className="-ml-4 -mt-2 hidden lg:flex flex-wrap items-center justify-between sm:flex-nowrap md:px-14 px-2">
          {/* Logo */}
          <Link to="/" className="ml-4 mt-2">
            <img src={Logo} width={130} height={130} alt="Logo" />
          </Link>

          {/* Menú de navegación */}
          <div className="ml-4 mt-2 flex-shrink-0">
            <NavLink
              to="/"
              className="text-lg inline-flex font-medium leading-6 text-gray-900 border-b-2 border-transparent hover:border-primary hover:text-primary transition duration-300 ease-in-out mx-4"
            >
              Inicio
            </NavLink>
            <NavLink
              to="/Horarios"
              className="text-lg inline-flex font-medium leading-6 text-gray-900 border-b-2 border-transparent hover:border-primary hover:text-primary transition duration-300 ease-in-out mx-4"
            >
              Horarios
            </NavLink>
            <NavLink
              to="/Horarios"
              className="text-lg inline-flex font-medium leading-6 text-gray-900 border-b-2 border-transparent hover:border-primary hover:text-primary transition duration-300 ease-in-out mx-4"
            >
              Control Doméstico
            </NavLink>
            <NavLink
              to="/blog"
              className="text-lg inline-flex font-medium leading-6 text-gray-900 border-b-2 border-transparent hover:border-primary hover:text-primary transition duration-300 ease-in-out mx-4"
            >
              PP
            </NavLink>

            {/* Botón Login */}
            <Link
              to="/login"
              className="inline-flex ml-12 items-center rounded-md border bg-blue border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-900 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`lg:hidden ${menuAbierto ? 'block' : 'hidden'}`}>
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 px-3 py-2 text-white"
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white my-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
        <div className="bg-gray-800 p-4">
          <NavLink
            to="/"
            className="block text-white py-2 px-4 hover:bg-primary"
            onClick={cerrarMenu}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/Horarios"
            className="block text-white py-2 px-4 hover:bg-primary"
            onClick={cerrarMenu}
          >
            Horarios
          </NavLink>
          <NavLink
            to="/control-domestico"
            className="block text-white py-2 px-4 hover:bg-primary"
            onClick={cerrarMenu}
          >
            Control Doméstico
          </NavLink>
          <NavLink
            to="/blog"
            className="block text-white py-2 px-4 hover:bg-primary"
            onClick={cerrarMenu}
          >
            PP
          </NavLink>
          <Link
            to="/login"
            className="px-7 py-3 text-base font-medium text-dark hover:text-primary dark:text-white"
            aria-label="Iniciar sesión"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BarraNavegacion;
