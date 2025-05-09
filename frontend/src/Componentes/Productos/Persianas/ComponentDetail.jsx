import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Simulación de datos (puedes usar una API o archivo en un proyecto real)
const componentData = {
  lamas: {
    name: 'Lamas',
    description: 'Lamas duraderas y personalizables para un control óptimo de la luz.',
    image: 'https://www.somfy.es/common/img/library///500x370_cover/Connexoon_Window_Stephane_Rambaud_18_web2.jpg',
  },
  cajon: {
    name: 'Cajón',
    description: 'Cajón compacto que protege el mecanismo de la persiana.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/blinds-and-curtains.jpg',
  },
  eje: {
    name: 'Eje',
    description: 'Eje robusto que garantiza un movimiento suave y estable.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
  },
  motor: {
    name: 'Motor Eléctrico',
    description: 'Motor silencioso y eficiente para una automatización sin esfuerzo.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
  },
  guias: {
    name: 'Guías Laterales',
    description: 'Guías que aseguran un deslizamiento preciso y seguro.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
  },
  control: {
    name: 'Sistema de Control',
    description: 'Control inteligente para una gestión remota y programable.',
    image: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
  },
};

function ComponentDetail() {
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

export default ComponentDetail;