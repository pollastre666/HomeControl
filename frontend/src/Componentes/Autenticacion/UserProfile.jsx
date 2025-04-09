import React from 'react';
import { useAuth } from '../Autenticacion/AuthContext';
import logo from '../../Assets/Logos/LogoH.png';
import { Link, useNavigate } from 'react-router-dom';
import Layout from "../../hocs/layouts/layout"

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

  return (
    <Layout>
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Perfil de Usuario</h1>
          <p className="text-gray-600 mb-6">
            Bienvenido, {user?.username || 'Usuario'} (Rol: {user?.role || 'No definido'})
          </p>

          <section className="bg-blue-50 rounded-lg p-4 shadow-md mb-6">
            <h3 className="text-lg font-semibold text-blue-800">Detalles del Perfil</h3>
            <div className="mt-2 space-y-2">
              <p className="text-gray-600">Nombre: {user?.username || 'N/A'}</p>
              <p className="text-gray-600">Rol: {user?.role || 'N/A'}</p>
            </div>
            <button 
              className="mt-4 bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => navigate('/editar-perfil')} // Añadí una navegación de ejemplo
            >
              Editar Perfil
            </button>
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
                  className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
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