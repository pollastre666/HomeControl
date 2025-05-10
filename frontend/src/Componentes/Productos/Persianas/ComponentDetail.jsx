import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';

// Import modular components for persianas
import PersianasFeatures from './Detalles/PersianasFeatures';
import PersianasSpecifications from './Detalles/PersianasSpecifications';
import InstallationTipsToggle from './Detalles/InstallationTipsToggle';
import RequestQuoteButton from './Detalles/RequestQuoteButton';
import RelatedPersianasProducts from './Detalles/RelatedPersianasProducts';

// Simulated component data for persianas
const componentData = {
  lamas: {
    name: 'Lamas para Persianas',
    description: 'Lamas duraderas y personalizables para persianas de alta calidad.',
    image: 'https://example.com/images/persianas-lamas.jpg', // Replace with real image URL
    features: ['Material resistente al clima', 'Ajuste manual o motorizado', 'Diseño moderno'],
    specs: { 'Material': 'Aluminio', 'Ancho': '25-50mm', 'Peso': '0.5kg/m²' },
    installationTips: 'Asegure las lamas en el cajón antes de instalar la persiana.',
  },
  cajon: {
    name: 'Cajón para Persianas',
    description: 'Cajón robusto que protege el mecanismo de la persiana.',
    image: 'https://example.com/images/persianas-cajon.jpg', // Replace with real image URL
    features: ['Protección contra polvo', 'Compatibilidad con motores', 'Diseño discreto'],
    specs: { 'Material': 'PVC', 'Dimensiones': '150x50mm', 'Peso': '1.2kg' },
    installationTips: 'Alinee el cajón con la ventana para una instalación precisa.',
  },
  eje: {
    name: 'Eje para Persianas',
    description: 'Eje resistente que facilita el movimiento de las persianas.',
    image: 'https://example.com/images/persianas-eje.jpg', // Replace with real image URL
    features: ['Durabilidad mejorada', 'Compatibilidad con motores', 'Fácil mantenimiento'],
    specs: { 'Material': 'Acero', 'Diámetro': '40mm', 'Longitud': 'Variable' },
    installationTips: 'Lubrique el eje periódicamente para un funcionamiento suave.',
  },
  motor: {
    name: 'Motor para Persianas',
    description: 'Motor silencioso para el control automatizado de persianas.',
    image: 'https://example.com/images/persianas-motor.jpg', // Replace with real image URL
    features: ['Control remoto', 'Bajo consumo', 'Silencioso'],
    specs: { 'Potencia': '100W', 'Voltaje': '230V', 'Velocidad': '15 rpm' },
    installationTips: 'Conecte el motor a un interruptor de seguridad.',
  },
  guias: {
    name: 'Guías para Persianas',
    description: 'Guías laterales que aseguran un deslizamiento perfecto.',
    image: 'https://example.com/images/persianas-guias.jpg', // Replace with real image URL
    features: ['Resistencia al viento', 'Fácil instalación', 'Diseño elegante'],
    specs: { 'Material': 'Aluminio', 'Longitud': 'Variable', 'Peso': '0.3kg/m' },
    installationTips: 'Ajuste las guías al marco de la ventana con tornillos firmes.',
  },
  control: {
    name: 'Control para Persianas',
    description: 'Sistema de control remoto para persianas motorizadas.',
    image: 'https://example.com/images/persianas-control.jpg', // Replace with real image URL
    features: ['Control por app', 'Programación automática', 'Compatibilidad multi-dispositivo'],
    specs: { 'Conectividad': 'Wi-Fi', 'Batería': '2 años', 'Alcance': '50m' },
    installationTips: 'Sincronice el control con la app antes de usar.',
  },
};

// Compatibility message generator
const getCompatibilityMessage = (componentId) => {
  const compatibleProducts = {
    lamas: ['cajon', 'eje', 'motor'],
    cajon: ['lamas', 'eje', 'guias'],
    eje: ['lamas', 'cajon', 'motor'],
    motor: ['lamas', 'eje', 'control'],
    guias: ['cajon', 'lamas'],
    control: ['motor', 'eje'],
  };
  const compatible = compatibleProducts[componentId] || [];
  return compatible.length > 0
    ? `Este producto es compatible con: ${compatible.map(id => componentData[id]?.name || id).join(', ')}.`
    : 'No hay información de compatibilidad disponible.';
};

function ComponentDetail() {
  const { componentId } = useParams();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      console.log('Fetching data for componentId:', componentId); // Debug log
      const data = componentData[componentId];
      console.log('Found component data:', data); // Debug log
      setComponent(data);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [componentId]);

  if (loading) {
    return <div className="text-center text-gray-600 py-16">Cargando...</div>;
  }

  if (!component) {
    return <div className="text-center text-red-600 py-16">Componente no encontrado</div>;
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
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-amber-50 via-white to-amber-100 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/Persianas"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2" size={20} />
            Volver a Persianas
          </Link>
          <div className="flex flex-col items-center mb-12 sm:mb-16 lg:mb-20">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
              {component.name}
            </h1>
            <img
              src={component.image}
              alt={`${component.name} - Vista previa`}
              className="w-full max-w-xs sm:max-w-md lg:max-w-lg h-48 sm:h-64 lg:h-80 object-cover rounded-xl shadow-md dark:shadow-gray-700 mb-6"
            />
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-prose text-center leading-relaxed">
              {component.description}
            </p>
          </div>

          {/* Use modular components for all persianas components */}
          {component.features && <PersianasFeatures features={component.features} />}
          {component.specs && <PersianasSpecifications specs={component.specs} />}
          {component.installationTips && <InstallationTipsToggle tips={component.installationTips} />}
          <RequestQuoteButton />
          {['lamas'].includes(componentId) && <RelatedPersianasProducts />}

          {/* Compatibility Message */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 italic text-base sm:text-lg">
              {getCompatibilityMessage(componentId)}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default ComponentDetail;