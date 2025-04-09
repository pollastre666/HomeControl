import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative isolate bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Navigation Bar */}


      {/* Background Image */}
      <div
        className="relative w-full h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: `url('https://www.somfy.es/common/img/library///2000x600_cover/port-enery-winter.jpg')`,
          backgroundBlendMode: 'overlay',
          opacity: 0.9,
        }}
      >
        {/* CTA Box */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            Ahorra energía
          </h2>
          <p className="mt-2 text-gray-600">
            Descubre cómo nuestros productos pueden ayudarte a reducir el consumo energético y mejorar tu confort.
          </p>
          <div className="mt-4">
            <a
              href="#more-info"
              className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              Más información
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;