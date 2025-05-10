import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';

// Import existing modular components
import CameraFeatures from './Detalles/CameraFeatures';
import CameraSpecifications from './Detalles/CameraSpecifications';
import InstallationTipsToggle from './Detalles/InstallationTipsToggle';
import RequestQuoteButton from './Detalles/RequestQuoteButton';
import RelatedSecurityProducts from './Detalles/RelatedSecurityProducts';

// Simulated component data for all pieces
const componentData = {
  camera: {
    name: 'Cámara de Seguridad',
    description: 'Cámara de alta definición con visión nocturna y detección de movimiento.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
    features: ['Resolución 1080p', 'Visión nocturna', 'Detección de movimiento', 'Conexión Wi-Fi'],
    specs: { 'Resolución': '1080p', 'Ángulo de visión': '120°', 'Almacenamiento': 'Nube o tarjeta SD' },
    installationTips: 'Instale la cámara a una altura de 2-3 metros para una mejor cobertura.',
  },
  'alarm-system': {
    name: 'Sistema de Alarma',
    description: 'Sistema de alarma con notificaciones en tiempo real y sensores avanzados.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
    features: ['Notificaciones push', 'Sensores de puerta/ventana', 'Alarma sonora de 100dB'],
    specs: { 'Volumen': '100dB', 'Conectividad': 'Wi-Fi', 'Batería': '24h de respaldo' },
    installationTips: 'Coloque los sensores en todas las entradas principales.',
  },
  'motion-detector': {
    name: 'Detector de Movimiento',
    description: 'Detector de movimiento con sensores infrarrojos para mayor seguridad.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
    features: ['Infrarrojos pasivos', 'Rango de 10m', 'Ajuste de sensibilidad'],
    specs: { 'Rango': '10m', 'Ángulo de detección': '90°', 'Alimentación': 'Batería AA' },
    installationTips: 'Evite colocarlo cerca de fuentes de calor para reducir falsas alarmas.',
  },
  'smart-lock': {
    name: 'Cerradura Inteligente',
    description: 'Cerradura con acceso remoto y control mediante aplicación móvil.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
    features: ['Acceso por app', 'Código temporal', 'Notificaciones de apertura'],
    specs: { 'Conectividad': 'Bluetooth/Wi-Fi', 'Batería': '6 meses', 'Material': 'Acero inoxidable' },
    installationTips: 'Asegure una instalación firme en puertas de grosor estándar.',
  },
  'control-app': {
    name: 'App de Control',
    description: 'Aplicación móvil para gestionar todos tus dispositivos de seguridad.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
    features: ['Control remoto', 'Notificaciones en tiempo real', 'Integración con dispositivos'],
    specs: { 'Compatibilidad': 'iOS y Android', 'Conectividad': 'Wi-Fi', 'Idiomas': 'Múltiples' },
    installationTips: 'Descargue la app desde App Store o Google Play y siga las instrucciones.',
  },
  'notification-system': {
    name: 'Sistema de Notificaciones',
    description: 'Sistema de alertas personalizadas para eventos de seguridad.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
    features: ['Alertas por email', 'Notificaciones push', 'Historial de eventos'],
    specs: { 'Conectividad': 'Wi-Fi', 'Almacenamiento': 'Nube', 'Frecuencia': 'En tiempo real' },
    installationTips: 'Configure las preferencias de notificación en la app de control.',
  },
  // Other categories (Persianas, Estores, etc.) can be added here if needed
};

// Compatibility message generator
const getCompatibilityMessage = (componentId) => {
  const compatibleProducts = {
    camera: ['alarm-system', 'motion-detector', 'smart-lock'],
    'alarm-system': ['camera', 'motion-detector'],
    'motion-detector': ['camera', 'alarm-system'],
    'smart-lock': ['camera', 'mobile-access'],
    'control-app': ['camera', 'alarm-system', 'smart-lock'],
    'notification-system': ['camera', 'alarm-system'],
  };
  const compatible = compatibleProducts[componentId] || [];
  return compatible.length > 0
    ? `Este producto es compatible con: ${compatible.map(id => componentData[id]?.name || id).join(', ')}.`
    : 'No hay información de compatibilidad disponible.';
};

function AdvancedSecurityComponentDetail() {
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
            to="/advanced-security"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2" size={20} />
            Volver a Seguridad Avanzada
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

          {/* Use modular components for all components */}
          {component.features && <CameraFeatures features={component.features} />}
          {component.specs && <CameraSpecifications specs={component.specs} />}
          {component.installationTips && <InstallationTipsToggle tips={component.installationTips} />}
          <RequestQuoteButton />
          {['camera'].includes(componentId) && <RelatedSecurityProducts />}

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

export default AdvancedSecurityComponentDetail;