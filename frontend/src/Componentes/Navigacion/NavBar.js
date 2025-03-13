import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from '../../Assets/Logos/LogoH.png';

const BarraNavegacion = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="flex w-full items-center bg-white dark:bg-oscuro">
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          {/* Logo */}
          <div className="w-60 max-w-full px-4">
            <Link to="/" className="block w-full py-5" aria-label="Inicio">
              <img src={Logo} alt="Logotipo principal" className="dark:hidden" />
              <img src={Logo} alt="Logotipo principal" className="hidden dark:block" />
            </Link>
          </div>

          {/* Contenedor principal de navegación */}
          <div className="flex w-full items-center justify-between px-4">
            <div>
              {/* Botón menú móvil */}
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                aria-label="Alternar menú de navegación"
                aria-expanded={menuAbierto}
                aria-controls="menuNavegacion"
                className={`${
                  menuAbierto && "navbarTogglerActive"
                } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
              >
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
              </button>

              {/* Menú de navegación */}
              <nav
                id="menuNavegacion"
                aria-label="Navegación principal"
                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none lg:dark:bg-transparent ${
                  !menuAbierto && "hidden"
                }`}
              >
                <ul className="block lg:flex">
                  <ElementoLista navLink="/" onClick={cerrarMenu}>Inicio</ElementoLista>
                  <ElementoLista navLink="/pagos" onClick={cerrarMenu}>Horarios</ElementoLista>
                  <ElementoLista navLink="/control-domestico" onClick={cerrarMenu}>Control Doméstico</ElementoLista>
                  <ElementoLista navLink="/blog" onClick={cerrarMenu}>Blog</ElementoLista>
                </ul>
              </nav>
            </div>

            {/* Botones de acceso */}
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <Link
                to="/login"
                className="px-7 py-3 text-base font-medium text-dark hover:text-primary dark:text-white"
                aria-label="Iniciar sesión"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/registro"
                className="rounded-md bg-primary px-7 py-3 text-base font-medium text-white hover:bg-primary/90"
                aria-label="Registrarse"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Componente ElementoLista mejorado
const ElementoLista = ({ children, navLink, onClick }) => {
  return (
    <li>
      <Link
        to={navLink}
        onClick={onClick}
        className="flex py-2 text-base font-medium text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white lg:ml-12 lg:inline-flex"
        aria-current={window.location.pathname === navLink ? "page" : undefined}
      >
        {children}
      </Link>
    </li>
  );
};

export default BarraNavegacion; 
