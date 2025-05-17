import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../../hocs/layouts/layout';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCollection = await getDocs(collection(db, 'users'));
        const devicesCollection = await getDocs(collection(db, 'devices'));
        setUsers(usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDevices(devicesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setIsLoading(false);
      } catch (error) {
        console.error('AdminDashboard: Data fetch error:', error);
        toast.error('Error al cargar datos');
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleDeviceStatus = async (deviceId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'devices', deviceId), { status: !currentStatus });
      setDevices(devices.map(d => (d.id === deviceId ? { ...d, status: !currentStatus } : d)));
      toast.success('Estado del dispositivo actualizado');
    } catch (error) {
      console.error('AdminDashboard: Device toggle error:', error);
      toast.error('Error al actualizar dispositivo');
    }
  };

  if (isLoading || !user) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <motion.div
        className="max-w-6xl mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">Dashboard de Administrador - IoT Solutions</h1>
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <svg
              className="w-10 h-10 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Bienvenido, {user.name || user.username || 'Admin'}!
              </p>
              <p className="text-gray-600 dark:text-gray-400">Rol: {user.role}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Usuarios</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="py-3 px-4 text-gray-800 dark:text-gray-200">Email</th>
                    <th className="py-3 px-4 text-gray-800 dark:text-gray-200">Rol</th>
                    <th className="py-3 px-4 text-gray-800 dark:text-gray-200">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <motion.tr
                      key={u.id}
                      className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{u.email}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{u.role}</td>
                      <td className="py-3 px-4">
                        <Link
                          to="/admin/roles"
                          className="text-yellow-400 hover:underline font-medium"
                          aria-label={`Editar rol de ${u.email}`}
                        >
                          Editar
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Dispositivos</h2>
            {devices.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No hay dispositivos registrados.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) => (
                  <motion.div
                    key={device.id}
                    className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center space-x-4">
                      <svg
                        className="w-8 h-8 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 1v2m0 18v2m-9-11h2m18 0h-2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12a11 11 0 012.12-6.56M22 12a11 11 0 01-2.12 6.56M6.66 6.66A7.96 7.96 0 014.1 12a7.96 7.96 0 012.56 5.34m12.68 0A7.96 7.96 0 0119.9 12a7.96 7.96 0 01-2.56-5.34"
                        />
                      </svg>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">{device.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Estado: <span className={device.status ? 'text-green-500' : 'text-red-500'}>
                            {device.status ? 'Encendido' : 'Apagado'}
                          </span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">Propietario: {device.owner}</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => toggleDeviceStatus(device.id, device.status)}
                      className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        device.status
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Cambiar estado de ${device.name}`}
                    >
                      {device.status ? 'Apagar' : 'Encender'}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Acciones</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li>
                <Link
                  to="/user/profile"
                  className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Editar perfil"
                >
                  Editar Perfil
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/roles"
                  className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Gestionar roles"
                >
                  Gestionar Roles
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/settings"
                  className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Configuraciones"
                >
                  Configuraciones
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default AdminDashboard;