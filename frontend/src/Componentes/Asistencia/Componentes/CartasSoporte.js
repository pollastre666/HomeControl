import React from 'react';

function SupportCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      {/* Card 1 */}
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-start">
        <div className="flex items-center mb-4">
          <svg
            className="w-8 h-8 text-blue-800 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7m-9 2v7a2 2 0 002 2h2a2 2 0 002-2v-7m-4 0l2 2m0 0l7-7 7 7"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800">
            ¿Tienes un problema? ¿Necesitas una reparación en casa?
          </h3>
        </div>

        <a href="/solicitar-reparacion">
          <button className="bg-yellow-400 text-gray-800 font-semibold py-2 px-4 rounded-full hover:bg-yellow-500 transition-colors duration-200">
            Solicitar reparación en casa
          </button>
        </a>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-start">
        <div className="flex items-center mb-4">
          <svg
            className="w-8 h-8 text-blue-800 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800">
          quieres saber mas sobre nuestros productos y servicios, o necesitas un presupuesto?
          </h3>
        </div>

        <a href="/solicitar-presupuesto">
          <button className="bg-yellow-400 text-gray-800 font-semibold py-2 px-4 rounded-full hover:bg-yellow-500 transition-colors duration-200">
            Solicitar un presupuesto
          </button>
        </a>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-start">
        <div className="flex items-center mb-4">
          <svg
            className="w-8 h-8 text-blue-800 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800">
            ¿Buscas un punto de venta cerca de tu domicilio?
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
        </p>
        <a href="/buscar-punto-venta">
          <button className="bg-yellow-400 text-gray-800 font-semibold py-2 px-4 rounded-full hover:bg-yellow-500 transition-colors duration-200">
            Buscar un punto de venta
          </button>
        </a>
      </div>

      {/* Card 4 */}
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-start">
        <div className="flex items-center mb-4">
          <svg
            className="w-8 h-8 text-blue-800 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800">
          ¿Ayuda con un producto comprado online?
          </h3>
        </div>
        <a href="/contacto-atencion-cliente">
          <button className="bg-yellow-400 text-gray-800 font-semibold py-2 px-4 rounded-full hover:bg-yellow-500 transition-colors duration-200">
            Contactar con atención al cliente de la tienda
          </button>
        </a>
      </div>
    </div>
  );
}

export default SupportCards;