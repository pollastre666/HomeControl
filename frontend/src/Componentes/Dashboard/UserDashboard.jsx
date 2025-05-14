import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../../hocs/layouts/layout';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasesLoading, setPurchasesLoading] = useState(true);
  const [purchasesError, setPurchasesError] = useState(null);
  const [devicesError, setDevicesError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user || !user.uid) {
      console.log('UserDashboard: No user or user.uid, skipping fetch');
      setIsLoading(false);
      setPurchasesLoading(false);
      return;
    }

    console.log('UserDashboard: Fetching data for user:', user.uid);
    setIsLoading(true);
    setPurchasesLoading(true);
    setDevicesError(null);
    setPurchasesError(null);

    try {
      // Fetch devices
      const devicesQuery = query(collection(db, 'devices'), where('owner', '==', user.uid));
      const devicesSnapshot = await getDocs(devicesQuery);
      const deviceData = devicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDevices(deviceData);
      console.log('UserDashboard: Devices fetched:', deviceData.length);
    } catch (error) {
      console.error('UserDashboard: Device fetch error:', error);
      const errorMessage = error.code === 'permission-denied'
        ? 'No tienes permiso para ver los dispositivos'
        : `Error al cargar dispositivos: ${error.message}`;
      setDevicesError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }

    try {
      // Fetch purchases
      const purchasesQuery = query(collection(db, 'purchases'), where('userId', '==', user.uid));
      const purchasesSnapshot = await getDocs(purchasesQuery);
      const purchaseData = purchasesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt : null,
        };
      });
      setPurchases(purchaseData);
      console.log('UserDashboard: Purchases fetched:', purchaseData.length);
    } catch (error) {
      console.error('UserDashboard: Purchase fetch error:', error);
      const errorMessage = error.code === 'permission-denied'
        ? 'No tienes permiso para ver las compras'
        : `Error al cargar compras: ${error.message}`;
      setPurchasesError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setPurchasesLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleDevice = useCallback(async (deviceId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'devices', deviceId), { status: !currentStatus });
      toast.success('Estado del dispositivo actualizado');
      fetchData(); // Refresh data after toggle
    } catch (error) {
      console.error('UserDashboard: Device toggle error:', error);
      toast.error('Error al actualizar dispositivo');
    }
  }, [fetchData]);

  if (isLoading || !user) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <motion.div
        className="max-w-6xl mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">Dashboard de Usuario - IoT Solutions</h1>
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
                Bienvenido, {user.name || user.username || 'Usuario'}!
              </p>
              <p className="text-gray-600 dark:text-gray-400">Rol: {user.role}</p>
            </div>
          </div>

          {/* Devices Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-yellow-400">Dispositivos</h2>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500"
              >
                Actualizar
              </button>
            </div>
            {devicesError ? (
              <div className="flex items-center space-x-2">
                <p className="text-red-600 dark:text-red-400">{devicesError}</p>
                <button
                  onClick={fetchData}
                  className="px-2 py-1 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500"
                >
                  Reintentar
                </button>
              </div>
            ) : devices.length === 0 ? (
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
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">{device.name || 'Sin nombre'}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Estado:{' '}
                          <span className={device.status ? 'text-green-500' : 'text-red-500'}>
                            {device.status ? 'Encendido' : 'Apagado'}
                          </span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">Tipo: {device.type || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-x-3">
                      <motion.button
                        onClick={() => toggleDevice(device.id, device.status)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          device.status
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Cambiar estado de ${device.name || 'dispositivo'}`}
                      >
                        {device.status ? 'Apagar' : 'Encender'}
                      </motion.button>
                      <Link
                        to={`/devices/${device.id}/control`}
                        className="px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors duration-200"
                        aria-label={`Controlar ${device.name || 'dispositivo'}`}
                      >
                        Controlar
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Purchases Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-yellow-400">Tus Compras</h2>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500"
              >
                Actualizar
              </button>
            </div>
            {purchasesLoading ? (
              <Spinner />
            ) : purchasesError ? (
              <div className="flex items-center space-x-2">
                <p className="text-red-600 dark:text-red-400">{purchasesError}</p>
                <button
                  onClick={fetchData}
                  className="px-2 py-1 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500"
                >
                  Reintentar
                </button>
              </div>
            ) : purchases.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No hay compras registradas.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.map((purchase) => (
                  <motion.div
                    key={purchase.id}
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
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">
                          {purchase.componentName || 'Compra sin nombre'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Monto: ${purchase.amount?.toFixed(2) || '0.00'} {purchase.currency?.toUpperCase() || 'USD'}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Fecha:{' '}
                          {purchase.createdAt
                            ? purchase.createdAt.toDate().toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : 'Sin fecha'}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          ID de Pago: {purchase.paymentIntentId?.slice(0, 8) || 'N/A'}...
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Actions Section */}
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
                  to="/devices/add"
                  className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Añadir dispositivo"
                >
                  Añadir Dispositivo
                </Link>
              </li>
              <li>
                <Link
                  to="/schedules"
                  className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Ver horarios"
                >
                  Ver Horarios
                </Link>
              </li>
              <li>
                <Link
                  to="/Analytics"
                  className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Ver análisis"
                >
                  Ver Análisis
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default UserDashboard;