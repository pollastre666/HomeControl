import React from "react";
import { Link } from "react-router-dom";
import Logo from '../../Assets/Logos/LogoH.png';
import Checkbox1 from "../Checkbox"; // Asegúrate de que el componente Checkbox esté bien importado

const Footer = () => {
  const añoActual = new Date().getFullYear();
  const redesSociales = [
    {
      nombre: "Facebook",
      url: "https://facebook.com",
      icono: (
        <svg width="8" height="16" viewBox="0 0 8 16" className="fill-current">
          <path d="M7.43902 6.4H6.19918H5.75639V5.88387V4.28387V3.76774H6.19918H7.12906C7.3726 3.76774 7.57186 3.56129 7.57186 3.25161V0.516129C7.57186 0.232258 7.39474 0 7.12906 0H5.51285C3.76379 0 2.54609 1.44516 2.54609 3.5871V5.83226V6.34839H2.10329H0.597778C0.287819 6.34839 0 6.63226 0 7.04516V8.90323C0 9.26452 0.243539 9.6 0.597778 9.6H2.05902H2.50181V10.1161V15.3032C2.50181 15.6645 2.74535 16 3.09959 16H5.18075C5.31359 16 5.42429 15.9226 5.51285 15.8194C5.60141 15.7161 5.66783 15.5355 5.66783 15.3806V10.1419V9.62581H6.13276H7.12906C7.41688 9.62581 7.63828 9.41935 7.68256 9.10968V9.08387V9.05806L7.99252 7.27742C8.01466 7.09677 7.99252 6.89032 7.85968 6.68387C7.8154 6.55484 7.61614 6.42581 7.43902 6.4Z" />
        </svg>
      )
    },
    // Agregar otras redes sociales aquí
  ];

  return (
    <footer className="relative z-10 bg-[#E8E0D1] pb-10 pt-20 dark:bg-dark-800 lg:pb-20 lg:pt-[120px]">
      <div className="container mx-auto px-4">
        <div className="-mx-4 flex flex-wrap items-start justify-between">
          {/* Sección Información */}
          <div className="mb-12 w-full px-4 sm:w-2/3 lg:mb-0 lg:w-4/12">
            <Link 
              to="/" 
              className="mb-8 inline-block max-w-[160px] transition-opacity hover:opacity-80"
              aria-label="Ir al inicio"
            >
              <img src={Logo} alt="Logotipo principal" className="dark:hidden" />

              <img
                src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-white.svg"
                alt="Versión clara del logotipo"
                className="hidden max-w-full dark:block"
                loading="lazy"
              />
            </Link>
            
            <address className="not-italic">
              <div className="flex items-center text-sm font-medium text-dark-700 dark:text-gray-300">
                <span className="mr-3 text-primary-500" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    {/* Icono de teléfono */}
                  </svg>
                </span>
                <span role="group" aria-label="Número de teléfono">
                  +++++++++++++++++++++++++++
                </span>
              </div>
            </address>
          </div>

          {/* Sección Enlaces */}
          <GrupoEnlaces titulo="Recursos">
            <EnlaceFooter to="/desarrollo-saas">******************+</EnlaceFooter>
          </GrupoEnlaces>

          <GrupoEnlaces titulo="Empresa">
            <EnlaceFooter to="/nosotros">Sobre nosotros</EnlaceFooter>
          </GrupoEnlaces>

          {/* Redes Sociales */}
          <div className="w-full px-4 sm:w-1/2 lg:w-4/12">
            <h4 className="mb-6 text-lg font-semibold text-dark-900 dark:text-white">
              Síguenos
            </h4>
            <div className="mb-8 flex space-x-4">
              {redesSociales.map((red, index) => (
                <a
                  key={index}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 text-dark-700 transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-white dark:border-dark-700 dark:text-gray-300 dark:hover:border-primary-500"
                  aria-label={`Visitar nuestro ${red.nombre}`}
                >
                  {red.icono}
                </a>
              ))}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {añoActual} Home Control.{" "}
              <span className="sr-only">Todos los derechos reservados</span>
            </p>

            {/* Checkbox en el footer */}
            <div className="mt-6 border-black border-gray-200 dark:border-dark-700 pt-6">
              <Checkbox1 />
              <label htmlFor="checkbox" className="ml-2 text-sm text-gray-600 border-black dark:text-gray-400">
                Acepto los términos y condiciones
              </label>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const GrupoEnlaces = ({ titulo, children }) => (
  <div className="mb-12 w-full px-4 sm:w-1/2 lg:mb-0 lg:w-2/12">
    <h5 className="mb-6 text-lg font-semibold text-dark-900 dark:text-white">
      {titulo}
    </h5>
    <nav aria-label={`Enlaces de ${titulo.toLowerCase()}`}>
      <ul className="space-y-3">{children}</ul>
    </nav>
  </div>
);

const EnlaceFooter = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-base text-gray-600 transition-colors hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
    >
      {children}
    </Link>
  </li>
);

export default Footer;
