import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../../hocs/layouts/layout';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }
        const devicesQuery = query(collection(db, 'devices'), where('owner', '==', user.uid));
        const devicesSnapshot = await getDocs(devicesQuery);
        const userDevices = devicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDevices(userDevices);

        if (userDevices.length > 0) {
          const analyticsQuery = query(collection(db, 'analytics'), where('userId', '==', user.uid));
          const analyticsSnapshot = await getDocs(analyticsQuery);
          setAnalytics(analyticsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Analytics: Data fetch error:', error);
        setError('Error al cargar datos de análisis');
        toast.error('Error al cargar datos de análisis');
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleDeviceChange = (deviceId) => {
    setSelectedDevice(deviceId);
  };

  const filteredAnalytics = selectedDevice
    ? analytics.filter(a => a.deviceId === selectedDevice)
    : analytics;

  const getUsageSummary = () => {
    const summary = filteredAnalytics.reduce(
      (acc, curr) => {
        if (curr.action === 'turn_on') {
          acc.onCount += 1;
        } else if (curr.action === 'turn_off') {
          acc.offCount += 1;
        }
        return acc;
      },
      { onCount: 0, offCount: 0 }
    );
    return summary;
  };

  if (isLoading || !user) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <motion.div
        className="max-w-6xl mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">
          Análisis de Dispositivos - IoT Solutions
        </h1>
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center"
              role="alert"
              aria-live="polite"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Seleccionar Dispositivo</h2>
            <select
              value={selectedDevice}
              onChange={(e) => handleDeviceChange(e.target.value)}
              className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition-all duration-200"
              aria-label="Seleccionar dispositivo para análisis"
            >
              <option value="">Todos los dispositivos</option>
              {devices.map(device => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Resumen de Uso</h2>
            {devices.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No hay dispositivos registrados.</p>
            ) : filteredAnalytics.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No hay datos de análisis disponibles.</p>
            ) : (
              <div className="space-y-6">
                <motion.div
                  className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Veces encendido: <span className="font-semibold text-green-500">{getUsageSummary().onCount}</span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Veces apagado: <span className="font-semibold text-red-500">{getUsageSummary().offCount}</span>
                      </p>
                    </div>
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
                        d="M9 19v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2m12 0v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m-3-7V7a3 3 0 013-3h2a3 3 0 013 3v6m-6 0h6"
                      />
                    </svg>
                  </div>
                </motion.div>

                <div>
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Historial de Acciones</h3>
                  <div className="space-y-4">
                    {filteredAnalytics.map((record) => (
                      <motion.div
                        key={record.id}
                        className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <p className="text-gray-600 dark:text-gray-300">
                          Dispositivo: <span className="font-medium">{devices.find(d => d.id === record.deviceId)?.name || 'Desconocido'}</span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Acción: <span className={record.action === 'turn_on' ? 'text-green-500' : 'text-red-500'}>
                            {record.action === 'turn_on' ? 'Encendido' : 'Apagado'}
                          </span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Fecha: {new Date(record.timestamp?.seconds * 1000).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Acciones</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <li>
                <Link
                  to="/user/dashboard"
                  className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-center"
                  aria-label="Volver al dashboard"
                >
                  Volver al Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/devices/add"
                  className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-center"
                  aria-label="Añadir dispositivo"
                >
                  Añadir Dispositivo
                </Link>
              </li>
              <li>
                <Link
                  to="/schedules"
                  className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-center"
                  aria-label="Ver horarios"
                >
                  Ver Horarios
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Analytics;