import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Simulated component data
const componentData = {
  keypad: {
    name: 'Teclado',
    description: 'Acceso seguro mediante códigos personalizados.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
  },
  'rfid-reader': {
    name: 'Lector RFID',
    description: 'Entrada con tarjetas de proximidad para mayor seguridad.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
  },
  'door-lock': {
    name: 'Cerradura',
    description: 'Cerradura electrónica de alta seguridad con control remoto.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
  },
  intercom: {
    name: 'Interfono',
    description: 'Comunicación bidireccional con visitantes.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
  },
  'mobile-access': {
    name: 'Acceso Móvil',
    description: 'Abre puertas desde tu smartphone con tecnología avanzada.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
  },
  'security-panel': {
    name: 'Panel de Seguridad',
    description: 'Gestión centralizada de accesos y alarmas.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
  },
};

function AccessControlComponentDetail() {
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

export default AccessControlComponentDetail;