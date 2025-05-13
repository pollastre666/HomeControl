import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSectionEstores = () => {
  return (
    <section className="relative bg-gradient-to-br from-amber-100 via-white to-amber-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 py-20 sm:py-24 lg:py-32 text-center">
      <div className="absolute inset-0 bg-[url('https://example.com/images/estores-hero-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10" />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
          Descubre Nuestros Estores
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Transforma tu espacio con estores elegantes y funcionales, diseñados para ofrecer confort y estilo.
        </p>
        <Link
          to="/Estores"
          className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 transition-colors duration-200"
        >
          Explorar Estores <ArrowRight className="ml-2" size={20} />
        </Link>
      </div>
    </section>
  );
};

export default HeroSectionEstores;
