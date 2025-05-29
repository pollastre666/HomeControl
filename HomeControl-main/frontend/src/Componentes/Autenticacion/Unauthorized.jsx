import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../hocs/layouts/layout';

const Unauthorized = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Acceso Denegado</h1>
          <p className="text-gray-700 dark:text-gray-200 mb-6">
            No tienes permiso para acceder a esta página.
          </p>
          <Link
            to="/login"
            className="btn-primary"
            aria-label="Volver al inicio de sesión"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;