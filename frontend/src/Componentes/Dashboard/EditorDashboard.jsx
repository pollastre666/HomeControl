import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '../../hocs/layouts/layout';
import { toast } from 'react-toastify';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const EditorDashboard = () => {
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
          { id: 1, action: 'Updated light schedule', time: '15 minutes ago' },
          { id: 2, action: 'Created irrigation task', time: '2 hours ago' },
        ]);
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

  // Redirect if not authenticated
  if (!user) {
    toast.warn('Por favor, inicia sesión para acceder a esta página.');
    return <Navigate to="/login" replace />;
  }

  // Restrict access to editor and admin roles
  if (!['editor', 'admin'].includes(user.role)) {
    toast.error('Acceso denegado: No tienes permisos para esta página.');
    return <Navigate to={`/unauthorized?role=editor`} replace />;
  }

  // Sidebar options
  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/editor/dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      name: 'Content',
      path: '/editor/content',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
    {
      name: 'Log Out',
      action: logout,
      icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
    },
  ];

  // Placeholder for stats
  const stats = [
    { title: 'Connected Devices', value: 10, subtext: '+1 since yesterday' },
    { title: 'Active Schedules', value: 6, subtext: '2 upcoming in 1 hour' },
    { title: 'Pending Tasks', value: 4, subtext: '1 due today' },
  ];

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-teal-800 text-white flex-shrink-0 shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold">Editor Dashboard</h2>
            <p className="text-sm text-teal-200 mt-1">Manage Schedules & Tasks</p>
          </div>
          <nav className="mt-6">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={item.action || (() => navigate(item.path))}
                    className="w-full text-left px-6 py-3 hover:bg-teal-700 transition-colors duration-200 flex items-center space-x-3"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={item.icon}
                      />
                    </svg>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <header className="bg-white shadow-md rounded-lg p-6 mb-6 flex items-center justify-between">
            <div>
              <stockexchange.com.au
              <h1 className="text-2xl font-bold text-teal-800">Editor Dashboard</h1>
              <p className="text-sm text-gray-500">
                Welcome, {user?.username || 'User'} (Role: {user?.role || 'Editor'})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{new Date().toLocaleDateString()}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Log Out
              </button>
            </div>
          </header>

          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-teal-800">{stat.title}</h3>
                <p className="text-3xl font-bold text-teal-600 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
              </div>
            ))}
          </section>

          {/* Management Options */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-teal-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-teal-800">Manage Schedules</h3>
              <p className="text-gray-600">Edit device schedules</p>
              <button
                onClick={() => navigate('/Horarios')}
                className="mt-2 bg-teal-600 text-white py-1 px-3 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 w-full"
              >
                Edit
              </button>
            </div>
            <div className="bg-teal-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-teal-800">Manage Tasks</h3>
              <p className="text-gray-600">Create and edit automated tasks</p>
              <button
                onClick={() => navigate('/Tareas')}
                className="mt-2 bg-teal-600 text-white py-1 px-3 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 w-full"
              >
                Edit
              </button>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-teal-800 mb-4">Recent Activity</h2>
            {recentActivities.length ? (
              <ul className="space-y-3">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-teal-600 rounded-full" />
                    <p className="text-gray-600 flex-1">{activity.action}</p>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No recent activity.</p>
            )}
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default EditorDashboard;