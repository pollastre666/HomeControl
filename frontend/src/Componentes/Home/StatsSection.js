// src/Componentes/Home/StatsSection.js
import React from 'react';
import CountUp from 'react-countup';

const StatsSection = () => (
  <section className="py-12 bg-gray-100">
    <div className="container mx-auto px-4 text-center">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h3 className="text-3xl font-bold text-amber-700">
            <CountUp end={10000} duration={2.5} />+
          </h3>
          <p className="text-gray-600">Hogares Automatizados</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-amber-700">
            <CountUp end={5} duration={2.5} />+
          </h3>
          <p className="text-gray-600">Años de Experiencia</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-amber-700">
            <CountUp end={99} duration={2.5} />%
          </h3>
          <p className="text-gray-600">Satisfacción del Cliente</p>
        </div>
      </div>
    </div>
  </section>
);

export default StatsSection;