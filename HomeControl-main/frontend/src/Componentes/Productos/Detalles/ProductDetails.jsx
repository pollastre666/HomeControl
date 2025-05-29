import React from 'react';
import PersianasFeatures from './PersianasFeatures';
import PersianasSpecifications from './PersianasSpecifications';
import InstallationTipsToggle from './InstallationTipsToggle';
import RequestQuoteButton from './RequestQuoteButton';
import { getCompatibilityMessage } from './data';

const ProductDetails = ({ component, componentId }) => {
  return (
    <div>
      <img
        src={component.image}
        alt={component.name}
        className="w-full h-80 object-cover rounded-lg shadow-lg"
      />
      <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-4">{component.name}</h1>
      <p className="text-gray-700 mb-6">{component.description}</p>
      <p className="text-xl text-green-600 font-semibold mb-4">Precio: ${component.price} USD</p>
      <p className="text-gray-600 mb-4">Stock: {component.stock} unidades</p>
      <PersianasFeatures features={component.features} />
      <PersianasSpecifications specs={component.specs} />
      <InstallationTipsToggle tips={component.installationTips} />
      <RequestQuoteButton />
      <p className="mt-4 text-gray-600">{getCompatibilityMessage(componentId)}</p>
    </div>
  );
};

export default ProductDetails;