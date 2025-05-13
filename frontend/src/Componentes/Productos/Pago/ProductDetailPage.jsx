import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Modal from 'react-modal';
import ProductDetails from './ProductDetails';
import CheckoutModal from './CheckoutModal';
import Breadcrumbs from '../ComponetesDeCartas/Breadcrumbs';
import RelatedPersianasProducts from './Detalles/RelatedPersianasProducts';

// Simulated component data for persianas
const componentData = {
  lamasAluminio: {
    name: 'Lamas de Aluminio Premium',
    description: 'Lamas de aluminio anodizado, resistentes a la corrosión y personalizables en colores.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Resistencia al clima extremo', 'Acabado en 10 colores', 'Ajuste motorizado opcional'],
    specs: { 'Material': 'Aluminio Anodizado', 'Ancho': '35-55mm', 'Peso': '0.6kg/m²', 'Garantía': '5 años' },
    installationTips: 'Asegure las lamas al cajón con tornillos de acero inoxidable.',
    price: 12.99,
    stock: 150,
  },
  cajonPVC: {
    name: 'Cajón de PVC Termoaislante',
    description: 'Cajón robusto con aislamiento térmico y acústico para persianas de alta eficiencia.',
    image: 'https://images.unsplash.com/photo-1600585154145-0d5f54a052e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Aislamiento R-12', 'Instalación sin herramientas complejas', 'Diseño ergonómico'],
    specs: { 'Material': 'PVC reforzado', 'Dimensiones': '250x250mm', 'Compatibilidad': 'Persianas hasta 3m' },
    installationTips: 'Alinee el cajón con un nivel para evitar desequilibrios.',
    price: 19.99,
    stock: 200,
  },
  ejeAcero: {
    name: 'Eje de Acero Galvanizado',
    description: 'Eje de alta resistencia para persianas de gran tamaño, con lubricación preinstalada.',
    image: 'https://images.unsplash.com/photo-1600585154298-2a61e6e5f5e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Capacidad de 150kg', 'Silencioso en operación', 'Ajustable en longitud'],
    specs: { 'Material': 'Acero Galvanizado', 'Diámetro': '70mm', 'Longitud máxima': '4m' },
    installationTips: 'Aplique lubricante adicional cada 6 meses.',
    price: 25.50,
    stock: 100,
  },
  motorSmart: {
    name: 'Motor Smart Wi-Fi',
    description: 'Motor eléctrico con control remoto y compatibilidad con asistentes de voz.',
    image: 'https://images.unsplash.com/photo-1600585154300-7d7f2a5e1b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Control por app', 'Silencioso <40dB', 'Programación automática'],
    specs: { 'Potencia': '50Nm', 'Voltaje': '230V', 'Conectividad': 'Wi-Fi/Bluetooth' },
    installationTips: 'Conecte a una toma con protección contra sobretensiones.',
    price: 69.99,
    stock: 75,
  },
  guiasLaterales: {
    name: 'Guías Laterales de Aluminio',
    description: 'Guías reforzadas para un deslizamiento suave y seguro de persianas grandes.',
    image: 'https://images.unsplash.com/photo-1600585154315-8e8b5b9f5f0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Anticorrosión', 'Ajuste telescópico', 'Reducción de vibraciones'],
    specs: { 'Material': 'Aluminio', 'Longitud': 'Hasta 3m', 'Ancho': '30mm' },
    installationTips: 'Verifique la verticalidad con un nivel láser.',
    price: 14.99,
    stock: 180,
  },
  controlRemoto: {
    name: 'Control Remoto Avanzado',
    description: 'Control inalámbrico con pantalla LCD para gestionar múltiples persianas.',
    image: 'https://images.unsplash.com/photo-1600585154320-6c6e4e7b0e0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Rango 50m', 'Compatibilidad multi-dispositivo', 'Batería recargable'],
    specs: { 'Frecuencia': '2.4GHz', 'Alcance': '50m', 'Duración batería': '6 meses' },
    installationTips: 'Coloque el control lejos de fuentes de interferencia.',
    price: 39.99,
    stock: 120,
  },
};

// Compatibility message generator
const getCompatibilityMessage = (componentId) => {
  const compatibleProducts = {
    lamasAluminio: ['cajonPVC', 'ejeAcero', 'motorSmart', 'guiasLaterales', 'controlRemoto'],
    cajonPVC: ['lamasAluminio', 'ejeAcero', 'motorSmart', 'guiasLaterales'],
    ejeAcero: ['lamasAluminio', 'cajonPVC', 'motorSmart', 'guiasLaterales'],
    motorSmart: ['lamasAluminio', 'cajonPVC', 'ejeAcero', 'controlRemoto'],
    guiasLaterales: ['lamasAluminio', 'cajonPVC', 'ejeAcero'],
    controlRemoto: ['motorSmart', 'lamasAluminio'],
  };
  const compatible = compatibleProducts[componentId] || [];
  return compatible.length > 0
    ? `Compatible con: ${compatible.map(id => componentData[id]?.name || id).join(', ')}.`
    : 'No hay información de compatibilidad disponible.';
};

const stripePromise = loadStripe('pk_test_12345');
Modal.setAppElement('#root');

const ProductDetailPage = () => {
  const { componentId } = useParams();
  const component = componentData[componentId];
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!component) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{component.name} - Detalles del Producto</title>
        <meta name="description" content={component.description} />
      </Helmet>
      <Breadcrumbs currentPage={component.name} />
      <div className="max-w-7xl mx-auto">
        <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" /> Volver a Productos
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductDetails component={component} />
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Comprar Ahora
            </button>
            <Elements stripe={stripePromise}>
              <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                component={component}
              />
            </Elements>
          </div>
        </div>
        <RelatedPersianasProducts currentId={componentId} />
      </div>
    </div>
  );
};

export default ProductDetailPage;