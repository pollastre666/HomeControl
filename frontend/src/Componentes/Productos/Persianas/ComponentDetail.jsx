import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetailPage from '../ProductDetailPage'; // Usa el componente genérico
import CheckoutModal from '../Detalles/CheckoutModal'; // Asegúrate de que esté en Detalles/
import RelatedProducts from '../Detalles/RelatedProducts'; // Componente genérico
import { componentData } from './persianasData'; // Ajusta la ruta según tu estructura

const ComponentDetail = () => {
  const { componentId } = useParams();
  const component = componentData[componentId];

  if (!component) {
    return <div className="text-center text-gray-600 py-16">Componente no encontrado</div>;
  }

  return (
    <div>
      <ProductDetailPage />
      {/* El modal y productos relacionados ya están manejados en ProductDetailPage */}
    </div>
  );
};

export default ComponentDetail;