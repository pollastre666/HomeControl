import React from 'react';
import { useAuth } from '../Autenticacion/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Layout from "../../hocs/layouts/layout";
import EditorContent from './EditorContent';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quickActions = [
    {
      title: 'Ver Horarios',
      description: 'Consulta tus horarios programados',
      path: '/Horarios',
      buttonText: 'Ver',
    },
    {
      title: 'Control Doméstico',
      description: 'Gestiona tus dispositivos',
      path: '/ControlDomestico',
      buttonText: 'Gestionar',
    },
    {
      title: 'Ver Tareas',
      description: 'Revisa tus tareas pendientes',
      path: '/Tareas',
      buttonText: 'Ver',
    },
  ];

  // Add loading state if user data is being fetched
  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-800">Perfil de Usuario</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Bienvenido, {user?.username || 'Usuario'} (Rol: {user?.role || 'No definido'})
          </p>

          <section className="bg-blue-50 rounded-lg p-4 shadow-md mb-6">
            <h3 className="text-lg font-semibold text-blue-800">Detalles del Perfil</h3>
            <div className="mt-2 space-y-2">
              <p className="text-gray-600">Nombre: {user?.username || 'N/A'}</p>
              <p className="text-gray-600">Rol: {user?.role || 'N/A'}</p>
              {/* Add more user details if available */}
              {user?.email && <p className="text-gray-600">Email: {user.email}</p>}
            </div>
            <div className="mt-4 space-x-4">
              <button 
                className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={() => navigate('/editor/content')}
              >
                Editar Perfil
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <div
                key={action.title}
                className="bg-blue-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-blue-800">{action.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{action.description}</p>
                <button
                  onClick={() => navigate(action.path)}
                  className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full"
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