import React from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '../../hocs/layouts/layout';
import { toast } from 'react-toastify';

const QUICK_ACTIONS = [
  {
    title: 'Ver Horarios',
    description: 'Revisa tus horarios programados',
    path: '/Horarios',
    buttonText: 'Ver',
  },
  {
    title: 'Control Doméstico',
    description: 'Administra tus dispositivos',
    path: '/ControlDomestico',
    buttonText: 'Administrar',
  },
  {
    title: 'Ver Tareas',
    description: 'Revisa tus tareas pendientes',
    path: '/Tareas',
    buttonText: 'Ver',
  },
  {
    title: 'Ir al Dashboard',
    description: 'Accede al dashboard general',
    path: '/user/dashboard',
    buttonText: 'Acceder',
  },
];

const UserProfile = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Estado de carga
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center space-y-4 animate-fade-in">
            <svg
              className="animate-spin h-12 w-12 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-lg font-semibold text-blue-800">Cargando perfil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirigir si no está autenticado
  if (!user) {
    toast.warn('Por favor, inicia sesión para acceder a tu perfil.');
    return <Navigate to="/login" replace />;
  }

  // Permitir acceso a user, editor y admin
  if (!['user', 'editor', 'admin'].includes(user.role)) {
    toast.error('Acceso denegado: Rol no válido.');
    return <Navigate to={`/unauthorized?role=user`} replace />;
  }

  return (
    <Layout>
      <main className="flex-grow p-6 animate-fade-in">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-800">Perfil de Usuario</h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Bienvenido, {user.username || 'Usuario'} (Rol: {user.role})
          </p>

          {/* Detalles del Perfil */}
          <section className="bg-blue-50 rounded-lg p-4 shadow-md mb-6">
            <h3 className="text-lg font-semibold text-blue-800">Detalles del Perfil</h3>
            <div className="mt-2 space-y-2">
              <p className="text-gray-600">Nombre: {user.username || 'N/A'}</p>
              <p className="text-gray-600">Rol: {user.role}</p>
              {user.email && <p className="text-gray-600">Correo: {user.email}</p>}
            </div>
          </section>

          {/* Acciones Rápidas */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QUICK_ACTIONS.map((action) => (
              <div
                key={action.title}
                className="bg-blue-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-blue-800">{action.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{action.description}</p>
                <button
                  onClick={() => navigate(action.path)}
                  className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 w-full"
                >
                  {action.buttonText}
                </button>
              </div>
            ))}
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default UserProfile;