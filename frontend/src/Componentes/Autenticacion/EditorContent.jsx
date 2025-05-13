import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useAuth } from './AuthProvider';
=======
import { useAuth } from '../Autenticacion/AuthProvider';
>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6
import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '../../hocs/layouts/layout';
import { toast } from 'react-toastify';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const EditorContent = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch recent activities from Firestore
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesRef = collection(db, `users/${user.uid}/activities`);
        const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        const activities = snapshot.docs.map((doc) => ({
          id: doc.id,
          action: doc.data().action,
          time: new Date(doc.data().timestamp.toDate()).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));
        setRecentActivities(activities);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
        setRecentActivities([
          { id: 1, action: 'Actualizó el horario de luces', time: 'Hace 15 minutos' },
          { id: 2, action: 'Programó tarea de riego', time: 'Hace 2 horas' },
        ]); // Fallback to static data
        toast.error('Error al cargar actividad reciente');
      }
    };

    if (user) {
      fetchActivities();
    }
  }, [user]);

  // Handle loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="animate-spin h-12 w-12 text-teal-600"
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
            <p className="text-lg font-semibold text-teal-800">Cargando...</p>
          </div>
        </div>
      </Layout>
    );
  }

<<<<<<< HEAD
  // Redirect if user is not authenticated
=======
  // Redirect if not authenticated
>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6
  if (!user) {
    toast.warn('Por favor, inicia sesión para acceder a esta página.');
    return <Navigate to="/login" replace />;
  }

  // Restrict access to editor and admin roles
  if (!['editor', 'admin'].includes(user.role)) {
    toast.error('Acceso denegado: No tienes permisos para esta página.');
    return <Navigate to={`/unauthorized?role=editor`} replace />;
  }

  return (
    <Layout>
      <main className="p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-teal-800">Panel del Editor</h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Bienvenido, {user?.username} (Rol: {user?.role})
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-teal-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-teal-800">Administrar Horarios</h3>
              <p className="text-gray-600">Edita los horarios de los dispositivos</p>
              <button
                onClick={() => navigate('/Horarios')}
                className="mt-2 bg-teal-600 text-white py-1 px-3 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 w-full"
              >
                Editar
              </button>
            </div>
            <div className="bg-teal-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-teal-800">Administrar Tareas</h3>
              <p className="text-gray-600">Crea y edita tareas automatizadas</p>
              <button
                onClick={() => navigate('/Tareas')}
                className="mt-2 bg-teal-600 text-white py-1 px-3 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 w-full"
              >
                Editar
              </button>
            </div>
          </div>

          <div className="bg-teal-50 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-teal-800 mb-4">Actividad Reciente</h2>
            {recentActivities.length ? (
              <ul className="space-y-3">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-teal-600 rounded-full" />
                    <p className="text-gray-600">{activity.action}</p>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No hay actividad reciente.</p>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default EditorContent;