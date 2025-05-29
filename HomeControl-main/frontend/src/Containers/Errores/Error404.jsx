import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-md w-full">
        <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2"> Algo ha salido mal</h2>
        <p className="text-gray-600 mb-6">
          La pagina que estas buscando no existe o hubo un error al cargarla.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;