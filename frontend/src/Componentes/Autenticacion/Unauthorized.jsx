import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
        <p className="text-gray-600 mb-6">No tienes permisos para acceder a esta página.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;