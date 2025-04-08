import React from 'react';
import { useAuth } from '../Autenticacion/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../Assets/Logos/LogoH.png'
const EditorContent = () => {
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
          <h1 className="text-3xl font-bold text-teal-800 mb-4">Panel de Editor</h1>
          <p className="text-gray-600 mb-6">Bienvenido, {user?.username} (Rol: {user?.role})</p>

          {/* Sección de Herramientas de Edición */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-teal-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-teal-800">Gestionar Horarios</h3>
              <p className="text-gray-600">Edita los horarios de los dispositivos</p>
              <button
                onClick={() => navigate('/Horarios')}
                className="mt-2 bg-teal-600 text-white py-1 px-3 rounded-lg hover:bg-teal-700"
              >
                Editar
              </button>
            </div>
            <div className="bg-teal-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-teal-800">Gestionar Tareas</h3>
              <p className="text-gray-600">Crea y edita tareas automáticas</p>
              <button
                onClick={() => navigate('/Tareas')}
                className="mt-2 bg-teal-600 text-white py-1 px-3 rounded-lg hover:bg-teal-700"
              >
                Editar
              </button>
            </div>
          </div>

          {/* Sección de Actividad Reciente */}
          <div className="bg-teal-50 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-teal-800 mb-4">Actividad Reciente</h2>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                <p className="text-gray-600">Horario de luces actualizado</p>
                <span className="text-sm text-gray-400">Hace 15 minutos</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                <p className="text-gray-600">Tarea de riego programada</p>
                <span className="text-sm text-gray-400">Hace 2 horas</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditorContent;