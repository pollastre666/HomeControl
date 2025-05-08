import React, { useState, useEffect, useRef } from 'react';

function VerticalMenu() {
  const [isOpen, setIsOpen] = useState(true);
  const menuRef = useRef(null);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClose = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed top-0 right-0 w-72 h-full bg-gradient-to-b from-gray-50 to-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
    >
      <div className="flex justify-end p-4">
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
          aria-label="Close menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 tracking-tight">
          Asistencia
        </h2>
        <ul className="space-y-5">
          <li>
            <a
              href="#descarga-manuales"
              className="flex items-center text-blue-700 hover:text-blue-900 text-lg font-medium transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              texto
            </a>
          </li>
          <li>
            <a
              href="#preguntas-frecuentes"
              className="flex items-center text-blue-700 hover:text-blue-900 text-lg font-medium transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M9 16h6m-7 4h8a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              texto
            </a>
          </li>
          <li>
            <a
              href="#videos-tutoriales"
              className="flex items-center text-blue-700 hover:text-blue-900 text-lg font-medium transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
              texto
            </a>
          </li>
          <li>
            <a
              href="/contacto"
              className="flex items-center text-blue-700 hover:text-blue-900 text-lg font-medium transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contacto
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default VerticalMenu;