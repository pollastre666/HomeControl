import React from 'react';
import CountUp from 'react-countup';

const StatsSection = () => (
  <section className="py-8 sm:py-12 lg:py-16 bg-gray-100">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-700">
            <CountUp end={10000} duration={2.5} />+
          </h3>
          <p className="mt-2 text-sm sm:text-base lg:text-lg text-gray-600">Hogares Automatizados</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-700">
            <CountUp end={5} duration={2.5} />+
          </h3>
          <p className="mt-2 text-sm sm:text-base lg:text-lg text-gray-600">Años de Experiencia</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-700">
            <CountUp end={99} duration={2.5} />%
          </h3>
          <p className="mt-2 text-sm sm:text-base lg:text-lg text-gray-600">Satisfacción del Cliente</p>
        </div>
      </div>
    </div>
  </section>
);

export default StatsSection;