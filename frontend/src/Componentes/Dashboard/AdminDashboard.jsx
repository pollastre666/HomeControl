import React from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Layout from '../../hocs/layouts/layout';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  // Sidebar options (some options are admin-only)
  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    ...(user.role === 'admin'
      ? [
          {
            name: 'Users',
            path: '/admin/users',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
          },
          {
            name: 'Devices',
            path: '/admin/devices',
            icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
          },
        ]
      : []),
    {
      name: 'Log Out',
      action: handleLogout,
      icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
    },
  ];

  // Placeholder for API data
  const stats = [
    { title: 'Connected Devices', value: 12, subtext: '+2 since yesterday' },
    { title: 'Active Schedules', value: 8, subtext: '2 upcoming in 1 hour' },
    ...(user.role === 'admin'
      ? [{ title: 'Registered Users', value: 45, subtext: '+5 this week' }]
      : []),
  ];

  const recentActivity = [
    { text: 'Living room lights turned on by schedule', time: '10 minutes ago' },
    { text: 'User "juan" added a new device', time: '1 hour ago' },
    { text: 'Security alarm activated', time: '3 hours ago' },
  ];

  const recentDevices = [
    {
      name: 'Security Camera',
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      date: new Date().toLocaleDateString(),
    },
    {
      name: 'Smart Thermostat',
      icon: 'M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34M9 11.66l3 3 7-7',
      date: new Date().toLocaleDateString(),
    },
  ];

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-800 text-white flex-shrink-0 shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold">
              {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </h2>
            <p className="text-sm text-blue-200 mt-1">
              {user.role === 'admin' ? 'System Management' : 'User Overview'}
            </p>
          </div>
          <nav className="mt-6">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={item.action || (() => navigate(item.path))}
                    className="w-full text-left px-6 py-3 hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-3"
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
              <h1 className="text-2xl font-bold text-blue-800">
                {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">
                Welcome, {user?.username || 'User'} (Role: {user?.role || 'User'})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{new Date().toLocaleDateString()}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Log Out
              </button>
            </div>
          </header>

          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-blue-800">{stat.title}</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
              </div>
            ))}
          </section>

          {/* System Activity */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">System Activity</h2>
            <ul className="space-y-3">
              {recentActivity.map((activity, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <p className="text-gray-600 flex-1">{activity.text}</p>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Recent Devices */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Recently Added Devices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentDevices.map((device) => (
                <div
                  key={device.name}
                  className="bg-blue-50 rounded-lg p-4 flex items-center space-x-4"
                >
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={device.icon}
                    />
                  </svg>
                  <div>
                    <p className="text-gray-600 font-semibold">{device.name}</p>
                    <p className="text-sm text-gray-500">Added: {device.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default AdminDashboard;