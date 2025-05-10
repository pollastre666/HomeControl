import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Simulated component data
const componentData = {
  'motorized-shutters': {
    name: 'Persianas Motorizadas',
    description: 'Control automático de persianas para comodidad y eficiencia.',
    image: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
  },
  'smart-lighting': {
    name: 'Iluminación Inteligente',
    description: 'Luces ajustables con automatización y control remoto.',
    image: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
  },
  'climate-control': {
    name: 'Control de Clima',
    description: 'Regulación automática de temperatura y ventilación.',
    image: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
  },
  'smart-plugs': {
    name: 'Enchufes Inteligentes',
    description: 'Controla dispositivos desde tu smartphone.',
    image: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
  },
  'automation-controller': {
    name: 'Controlador de Automatización',
    description: 'Centraliza la gestión de automatismos del hogar.',
    image: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
  },
  'scene-scheduler': {
    name: 'Programador de Escenas',
    description: 'Automatiza rutinas diarias con escenas personalizadas.',
    image: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
  },
};

function SmartHomeAutomationComponentDetail() {
  const { componentId } = useParams();
  const component = componentData[componentId];

  if (!component) {
    return <div className="text-center text-gray-600">Componente no encontrado</div>;
  }

  return (
    <>
      <Helmet>
        <title>{component.name} - Detalles del Componente</title>
        <meta name="description" content={component.description} />
        <meta property="og:title" content={component.name} />
        <meta property="og:description" content={component.description} />
        <meta property="og:image" content={component.image} />
      </Helmet>
      <section className="py-16 bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
            {component.name}
          </h1>
          <div className="flex flex-col items-center">
            <img
              src={component.image}
              alt={component.name}
              className="w-full max-w-md h-64 object-cover rounded-lg shadow-lg mb-6"
            />
            <p className="text-lg text-gray-600 max-w-2xl text-center">
              {component.description}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default SmartHomeAutomationComponentDetail;