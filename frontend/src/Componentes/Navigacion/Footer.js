import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../../Assets/Logos/LogoH.png";

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
      ),
    },
    {
      nombre: "Twitter",
      url: "https://twitter.com",
      icono: (
        <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      nombre: "Instagram",
      url: "https://instagram.com",
      icono: (
        <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 3.775.227 1.926 2.036 1.772 5.297.014 8.582 0 9.004 0 12.001c0 3.004.014 3.423.072 6.708.154 3.261 1.963 5.07 5.224 5.224 3.285.058 3.704.072 6.704.072s3.423-.014 6.708-.072c3.261-.154 5.07-1.963 5.224-5.224.058-3.285.072-3.704.072-6.708s-.014-3.423-.072-6.708c-.154-3.261-1.963-5.07-5.224-5.224C15.424.014 15.004 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
  ];

  return (
    <motion.footer
      className="relative z-10 bg-gradient-to-b from-amber-50 to-amber-100 py-6 sm:py-8 md:py-10 lg:py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 max-w-7xl">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Sección Información */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="mb-4 sm:mb-6 inline-block transition-opacity hover:opacity-80" aria-label="HomeControl Inicio">
              <img src={Logo} alt="Logotipo HomeControl" className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto" />
            </Link>
            <address className="not-italic text-sm sm:text-base text-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-amber-500 w-5 h-5 sm:w-6 sm:h-6">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="break-words">+34 000 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-amber-500 w-5 h-5 sm:w-6 sm:h-6">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="break-words">info@homecontrol.es</span>
              </div>
            </address>
          </motion.div>

          {/* Recursos */}
          <GrupoEnlaces titulo="Recursos">

            <EnlaceFooter to="/ubicacion">Ubicación</EnlaceFooter>
          </GrupoEnlaces>

          {/* Empresa */}
          <GrupoEnlaces titulo="Empresa">
            <EnlaceFooter to="/nosotros">Sobre nosotros</EnlaceFooter>
            <EnlaceFooter to="/contacto">Contacto</EnlaceFooter>
          </GrupoEnlaces>

          {/* Newsletter y Redes Sociales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-900">
              Mantente Conectado
            </h4>
            <form
              className="mb-4 sm:mb-6"
              onSubmit={(e) => {
                e.preventDefault();
                alert("¡Suscrito al boletín!");
              }}
              aria-describedby="newsletter-description"
            >
              <p id="newsletter-description" className="sr-only">
                Suscríbete a nuestro boletín para recibir actualizaciones y noticias.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-2 sm:px-4 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 min-w-0 max-w-full"
                  aria-label="Correo electrónico para el boletín"
                  required
                />
                <motion.button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-amber-500 text-white text-sm sm:text-base rounded-lg hover:bg-amber-600 transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Suscribirse al boletín"
                >
                  Suscribir
                </motion.button>
              </div>
            </form>
            <div className="flex gap-3 flex-wrap">
              {redesSociales.map((red, index) => (
                <motion.a
                  key={index}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white shadow-md text-amber-500 hover:bg-amber-500 hover:text-white transition-all duration-200 min-w-[36px]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Visitar nuestro ${red.nombre}`}
                >
                  {red.icono}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div
          className="mt-8 sm:mt-10 text-center text-xs sm:text-sm text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          &copy; {añoActual} HomeControl.
        </motion.div>
      </div>
    </motion.footer>
  );
};

const GrupoEnlaces = ({ titulo, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    viewport={{ once: true }}
  >
    <h5 className="mb-2 sm:mb-3 text-base sm:text-lg font-semibold text-gray-900">{titulo}</h5>
    <nav aria-label={`Enlaces de ${titulo.toLowerCase()}`}>
      <ul className="space-y-1 sm:space-y-2">{children}</ul>
    </nav>
  </motion.div>
);

const EnlaceFooter = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-xs sm:text-sm text-gray-600 hover:text-amber-500 transition-colors duration-200"
      aria-label={children}
    >
      {children}
    </Link>
  </li>
);

export default Footer;