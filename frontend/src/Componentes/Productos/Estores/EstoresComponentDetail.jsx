import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Simulación de datos (puedes usar una API o archivo en un proyecto real)
const componentData = {
  tejido: {
    name: 'Tejido',
    description: 'Tejido personalizable para un control preciso de luz y privacidad.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/blinds-and-curtains.jpg',
  },
  tubo: {
    name: 'Tubo de Enrollamiento',
    description: 'Tubo robusto que soporta el enrollado suave del tejido.',
    image: 'https://www.somfy.es/common/img/library///500x370_cover/Connexoon_Window_Stephane_Rambaud_18_web2.jpg',
  },
  'motor-estores': {
    name: 'Motor Eléctrico',
    description: 'Motor silencioso para una automatización eficiente y sin esfuerzo.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
  },
  rieles: {
    name: 'Rieles o Guías',
    description: 'Guías que aseguran un movimiento estable del tejido.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
  },
  'control-estores': {
    name: 'Sistema de Control',
    description: 'Control inteligente para gestión remota y programable.',
    image: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
  },
  contrapeso: {
    name: 'Contrapeso',
    description: 'Barra inferior que mantiene el tejido tenso y estético.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
  },
};

function EstoresComponentDetail() {
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

export default EstoresComponentDetail;