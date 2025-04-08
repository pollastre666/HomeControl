import React from 'react';
import { useAuth } from '../Autenticacion/AuthContext'; // Ajustado a tu ruta
import { useNavigate } from 'react-router-dom';
import logo from '../../Assets/Logos/LogoH.png'; // Ajusta la ruta a tu logo (HC)

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
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

      {/* Contenido Principal con Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-800 text-white flex-shrink-0">
          <div className="p-6">
            <h2 className="text-2xl font-bold">Panel Admin</h2>
            <p className="text-sm text-blue-200 mt-1">Gestión del Sistema</p>
          </div>
          <nav className="mt-6">
            <ul className="space-y-2">
              <li>
                <button
                  className="w-full text-left px-6 py-3 hover:bg-blue-700 transition-colors flex items-center space-x-3"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-6 py-3 hover:bg-blue-700 transition-colors flex items-center space-x-3"
                  onClick={() => navigate('/admin/users')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <span>Usuarios</span>
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-6 py-3 hover:bg-blue-700 transition-colors flex items-center space-x-3"
                  onClick={() => navigate('/admin/devices')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>Dispositivos</span>
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-6 py-3 hover:bg-blue-700 transition-colors flex items-center space-x-3"
                  onClick={handleLogout}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span>Cerrar Sesión</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 p-6">
          {/* Encabezado */}
          <header className="bg-white shadow-md rounded-lg p-6 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-800">Dashboard Administrativo</h1>
              <p className="text-sm text-gray-500">Bienvenido, {user?.username} (Rol: {user?.role})</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{new Date().toLocaleDateString()}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </header>

          {/* Área de Contenido */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tarjeta de Dispositivos Conectados */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-blue-800">Dispositivos Conectados</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
              <p className="text-sm text-gray-500 mt-1">+2 desde ayer</p>
            </div>

            {/* Tarjeta de Horarios Activos */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-blue-800">Horarios Activos</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">8</p>
              <p className="text-sm text-gray-500 mt-1">2 próximos en 1 hora</p>
            </div>

            {/* Tarjeta de Usuarios Registrados */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-blue-800">Usuarios Registrados</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">45</p>
              <p className="text-sm text-gray-500 mt-1">+5 esta semana</p>
            </div>
          </div>

          {/* Sección de Actividad del Sistema */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Actividad del Sistema</h2>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <p className="text-gray-600">Luces del salón encendidas por Horario</p>
                <span className="text-sm text-gray-400">Hace 10 minutos</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <p className="text-gray-600">Usuario "juan" agregó un nuevo dispositivo</p>
                <span className="text-sm text-gray-400">Hace 1 hora</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <p className="text-gray-600">Alarma de seguridad activada</p>
                <span className="text-sm text-gray-400">Hace 3 horas</span>
              </li>
            </ul>
          </div>

          {/* Sección de Dispositivos Recientes */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Dispositivos Recientemente Añadidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <p className="text-gray-600 font-semibold">Cámara de Seguridad</p>
                  <p className="text-sm text-gray-500">Añadida: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34M9 11.66l3 3 7-7"></path>
                </svg>
                <div>
                  <p className="text-gray-600 font-semibold">Termostato Inteligente</p>
                  <p className="text-sm text-gray-500">Añadida: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;