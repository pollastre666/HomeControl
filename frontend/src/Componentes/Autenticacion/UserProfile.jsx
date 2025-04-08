import React from 'react';
import { useAuth } from '../Autenticacion/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../Assets/Logos/LogoH.png'

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200">
      {/* Navbar */}
      <nav className="bg-teal-700 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="HomeControl Logo" className="h-10" /> {/* Añade tu logo */}
          <span className="text-xl font-bold">HomeControl</span>
        </div>
        <div className="flex space-x-6">
          <button onClick={() => navigate('/')} className="hover:text-indigo-200 transition-colors">
            Inicio
          </button>
          <button onClick={() => navigate('/Horarios')} className="hover:text-indigo-200 transition-colors">
            Horarios
          </button>
          <button onClick={() => navigate('/Tareas')} className="hover:text-indigo-200 transition-colors">
            Tareas
          </button>
          <button onClick={() => navigate('/ControlDomestico')} className="hover:text-indigo-200 transition-colors">
            Control Doméstico
          </button>
          <button
            onClick={handleLogout}
            className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-teal-800 mb-4">Perfil de Usuario</h1>
          <p className="text-gray-600 mb-6">Bienvenido, {user?.username} (Rol: {user?.role})</p>

          {/* Información del Perfil */}
          <div className="bg-teal-50 rounded-lg p-4 shadow-md mb-6">
            <h3 className="text-lg font-semibold text-teal-800">Detalles del Perfil</h3>
            <p className="text-gray-600 mt-2">Nombre: {user?.username}</p>
            <p className="text-gray-600">Rol: {user?.role}</p>
            <button className="mt-2 bg-teal-600 text-white py-1 px-3 rounded-lg hover:bg-teal-700">
              Editar Perfil
            </button>
          </div>

          {/* Acciones Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-teal-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-teal-800">Ver Horarios</h3>
              <p className="text-gray-600">Consulta tus horarios programados</p>
              <button
                onClick={() => navigate('/Horarios')}
                className="mt-2 bg-teal-600 text-white py-1 px-3 rounded-lg hover:bg-teal-700"
              >
                Ver
              </button>
            </div>
            <div className="bg-teal-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-teal-800">Control Doméstico</h3>
              <p className="text-gray-600">Gestiona tus dispositivos</p>
              <button
                onClick={() => navigate('/ControlDomestico')}
                className="mt-2 bg-teal-600 text-white py-1 px-3 rounded-lg hover:bg-teal-700"
              >
                Gestionar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;