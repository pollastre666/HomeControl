import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Simulated component data
const componentData = {
  'central-unit': {
    name: 'Unidad Central',
    description: 'Núcleo de control para todos los dispositivos del hogar.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
  },
  'connectivity-module': {
    name: 'Módulo de Conectividad',
    description: 'Conexión Wi-Fi y Bluetooth para dispositivos inteligentes.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
  },
  sensors: {
    name: 'Sensores',
    description: 'Detectores de movimiento y temperatura avanzados.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
  },
  'app-interface': {
    name: 'Interfaz de App',
    description: 'Controla tu hogar desde tu smartphone con facilidad.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
  },
  'voice-control': {
    name: 'Control por Voz',
    description: 'Integración con asistentes de voz como Alexa y Google.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
  },
  'power-supply': {
    name: 'Fuente de Alimentación',
    description: 'Energía eficiente y estable para el hub.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
  },
};

function AutomationHubComponentDetail() {
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

export default AutomationHubComponentDetail;