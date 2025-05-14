import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../../hocs/layouts/layout';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';

const DeviceControl = () => {
  const { user, checkDeviceAccess } = useAuth();
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        if (!(await checkDeviceAccess(user, deviceId))) {
          navigate('/unauthorized');
          return;
        }
        const deviceDoc = await getDoc(doc(db, 'devices', deviceId));
        if (deviceDoc.exists()) {
          setDevice({ id: deviceDoc.id, ...deviceDoc.data() });
        } else {
          navigate('/user/dashboard');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('DeviceControl: Device fetch error:', error);
        setError('Error al cargar dispositivo');
        toast.error('Error al cargar dispositivo');
        setIsLoading(false);
      }
    };
    fetchDevice();
  }, [deviceId, user, navigate, checkDeviceAccess]);

  const updateDevice = async (updates) => {
    try {
      await updateDoc(doc(db, 'devices', deviceId), updates);
      setDevice({ ...device, ...updates });
      toast.success('Dispositivo actualizado');
    } catch (error) {
      console.error('DeviceControl: Device update error:', error);
      setError('Error al actualizar dispositivo');
      toast.error('Error al actualizar dispositivo');
    }
  };

  if (isLoading || !device) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <motion.div
        className="max-w-lg mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">
          Control de {device.name} - IoT Solutions
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

          <div className="space-y-6">
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
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Estado
                </label>
                <p className="text-gray-600 dark:text-gray-400">
                  Actualmente: <span className={device.status ? 'text-green-500' : 'text-red-500'}>
                    {device.status ? 'Encendido' : 'Apagado'}
                  </span>
                </p>
              </div>
              <motion.button
                onClick={() => updateDevice({ status: !device.status })}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
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
            </div>

            {device.type === 'thermostat' && (
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Temperatura (°C)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="temperature"
                    value={device.temperature || 20}
                    onChange={(e) => updateDevice({ temperature: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition-all duration-200"
                    min="10"
                    max="30"
                    aria-label="Ajustar temperatura"
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5a4 4 0 014 4v3a4 4 0 01-8 0V9a4 4 0 014-4zm0 0V3m0 0h2m-2 0H7m2 9v6m0 0a2 2 0 002 2h2a2 2 0 002-2v-2"
                    />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Rango permitido: 10°C - 30°C
                </p>
              </div>
            )}

            {device.type === 'camera' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Vista en Vivo
                </label>
                <motion.button
                  className="mt-2 px-4 py-2 bg-gray-400 text-gray-800 rounded-lg font-medium cursor-not-allowed"
                  disabled
                  aria-label="Vista en vivo no implementada"
                  whileHover={{ scale: 1 }}
                >
                  Vista en Vivo (No Implementado)
                </motion.button>
              </div>
            )}

            {device.type === 'lock' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Estado de la Cerradura
                </label>
                <motion.button
                  onClick={() => updateDevice({ status: !device.status })}
                  className={`mt-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    device.status
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Cambiar estado de la cerradura ${device.name}`}
                >
                  {device.status ? 'Desbloquear' : 'Bloquear'}
                </motion.button>
              </div>
            )}
          </div>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <button
              onClick={() => navigate('/user/dashboard')}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
              aria-label="Volver al dashboard"
            >
              Volver al Dashboard
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default DeviceControl;