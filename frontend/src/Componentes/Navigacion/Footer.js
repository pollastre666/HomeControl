import React from "react";
import { Link } from "react-router-dom";
import Logo from '../../Assets/Logos/LogoH.png';
import Checkbox1 from "../Checkbox";

const Footer = () => {
  const añoActual = new Date().getFullYear();
  const redesSociales = [
    {
      nombre: "Facebook",
      url: "https://facebook.com",
      icono: (
        <svg width="16" height="16" viewBox="0 0 8 16" className="fill-current">
          <path d="M7.43902 6.4H6.19918H5.75639V5.88387V4.28387V3.76774H6.19918H7.12906C7.3726 3.76774 7.57186 3.56129 7.57186 3.25161V0.516129C7.57186 0.232258 7.39474 0 7.12906 0H5.51285C3.76379 0 2.54609 1.44516 2.54609 3.5871V5.83226V6.34839H2.10329H0.597778C0.287819 6.34839 0 6.63226 0 7.04516V8.90323C0 9.26452 0.243539 9.6 0.597778 9.6H2.05902H2.50181V10.1161V15.3032C2.50181 15.6645 2.74535 16 3.09959 16H5.18075C5.31359 16 5.42429 15.9226 5.51285 15.8194C5.60141 15.7161 5.66783 15.5355 5.66783 15.3806V10.1419V9.62581H6.13276H7.12906C7.41688 9.62581 7.63828 9.41935 7.68256 9.10968V9.08387V9.05806L7.99252 7.27742C8.01466 7.09677 7.99252 6.89032 7.85968 6.68387C7.8154 6.55484 7.61614 6.42581 7.43902 6.4Z" />
        </svg>
      )
    },
    // Puedes agregar más redes sociales aquí
  ];

  return (
    <footer className="relative z-10 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 py-12 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Sección Información */}
          <div>
            <Link to="/" className="mb-6 inline-block transition-opacity hover:opacity-80">
              <img src={Logo} alt="Logotipo Home Control" className="h-12 w-auto dark:hidden" />
              <img
                src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-white.svg"
                alt="Logotipo Home Control (modo oscuro)"
                className="h-12 w-auto hidden dark:block"
                loading="lazy"
              />
            </Link>
            <address className="not-italic text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="text-blue-600 dark:text-blue-400"
                >
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0v10h12V5H4z" />
                </svg>
                <span>000000000</span>
              </div>
            </address>
          </div>

          <GrupoEnlaces titulo="Recursos">
            <EnlaceFooter to="/desarrollo-saas">Recursos</EnlaceFooter>
            <EnlaceFooter to="/ubicacion">Ubicación</EnlaceFooter>
          </GrupoEnlaces>

          <GrupoEnlaces titulo="Empresa">
            <EnlaceFooter to="/nosotros">Sobre nosotros</EnlaceFooter>
          </GrupoEnlaces>

          {/* Redes Sociales */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Síguenos
            </h4>
            <div className="mb-6 flex gap-4">
              {redesSociales.map((red, index) => (
                <a
                  key={index}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-blue-600 transition-all hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-500"
                  aria-label={`Visitar nuestro ${red.nombre}`}
                >
                  {red.icono}
                </a>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Checkbox1 id="terms" />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
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
  <div>
    <h5 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
      {titulo}
    </h5>
    <nav aria-label={`Enlaces de ${titulo.toLowerCase()}`}>
      <ul className="space-y-2">{children}</ul>
    </nav>
  </div>
);

const EnlaceFooter = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-sm text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
    >
      {children}
    </Link>
  </li>
);

export default Footer;