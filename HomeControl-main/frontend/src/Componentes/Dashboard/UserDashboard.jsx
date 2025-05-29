import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../../hocs/layouts/layout';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';
import { Switch } from '@headlessui/react';
import { SunIcon, MoonIcon, FunnelIcon, DevicePhoneMobileIcon, LightBulbIcon, CameraIcon, FireIcon, TrashIcon } from '@heroicons/react/24/outline';

const UserDashboard = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasesLoading, setPurchasesLoading] = useState(true);
  const [purchasesError, setPurchasesError] = useState(null);
  const [devicesError, setDevicesError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const prevDevicesRef = useRef([]);

  // Device type icons mapping
  const deviceIcons = {
    light: <LightBulbIcon className="w-6 h-6 text-yellow-400" />,
    sensor: <DevicePhoneMobileIcon className="w-6 h-6 text-yellow-400" />,
    thermostat: <FireIcon className="w-6 h-6 text-yellow-400" />,
    camera: <CameraIcon className="w-6 h-6 text-yellow-400" />,
    default: <DevicePhoneMobileIcon className="w-6 h-6 text-yellow-400" />,
  };

  // Toggle theme and persist
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Fetch data with optimization
  const fetchData = useCallback(async () => {
    if (!user || !user.uid) {
      setIsLoading(false);
      setPurchasesLoading(false);
      return;
    }

    setIsLoading(true);
    setPurchasesLoading(true);
    setDevicesError(null);
    setPurchasesError(null);

    try {
      const devicesQuery = query(collection(db, 'devices'), where('userId', '==', user.uid));
      const devicesSnapshot = await getDocs(devicesQuery);
      const deviceData = devicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Check for unexpected status changes
      deviceData.forEach((newDevice, index) => {
        const prevDevice = prevDevicesRef.current[index];
        if (prevDevice && prevDevice.status !== newDevice.status && prevDevice.id === newDevice.id) {
          toast.info(`El dispositivo ${newDevice.name || 'Sin nombre'} cambió a ${newDevice.status ? 'Encendido' : 'Apagado'}`);
        }
      });

      setDevices(deviceData);
      prevDevicesRef.current = deviceData;
    } catch (error) {
      const errorMessage = error.code === 'permission-denied'
        ? 'No tienes permiso para ver los dispositivos'
        : `Error al cargar dispositivos: ${error.message}`;
      setDevicesError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }

    try {
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
    } catch (error) {
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

  // Toggle device status
 const toggleDevice = useCallback(async (deviceId, currentState) => {
  try {
    // Cambia el estado: si está "on" pasa a "off", y viceversa
    const newState = currentState === "on" ? "off" : "on";
    await updateDoc(doc(db, 'devices', deviceId), { currentState: newState, updatedAt: new Date() });
    toast.success('Estado del dispositivo actualizado');
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId ? { ...device, currentState: newState } : device
      )
    );
  } catch (error) {
    toast.error('Error al actualizar dispositivo');
  }
}, []);

  // Remove device
  const handleRemoveDevice = useCallback(async (deviceId, deviceName) => {
    if (!user) {
      toast.error('Inicia sesión para eliminar dispositivos.');
      return;
    }
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el dispositivo "${deviceName || 'Sin nombre'}"?`)) return;

    try {
      await deleteDoc(doc(db, 'devices', deviceId));
      setDevices(prevDevices => prevDevices.filter(device => device.id !== deviceId));
      toast.success(`Dispositivo "${deviceName || 'Sin nombre'}" eliminado con éxito`);
    } catch (error) {
      console.error('Error removing device:', error);
      toast.error('Error al eliminar el dispositivo');
    }
  }, [user]);

  // Remove purchase
  const handleRemovePurchase = useCallback(async (purchaseId, purchaseName) => {
    if (!user) {
      toast.error('Inicia sesión para eliminar compras.');
      return;
    }
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la compra "${purchaseName || 'Sin nombre'}"?`)) return;

    try {
      await deleteDoc(doc(db, 'purchases', purchaseId));
      setPurchases(prevPurchases => prevPurchases.filter(purchase => purchase.id !== purchaseId));
      toast.success(`Compra "${purchaseName || 'Sin nombre'}" eliminada con éxito`);
    } catch (error) {
      console.error('Error removing purchase:', error);
      toast.error('Error al eliminar la compra');
    }
  }, [user]);

  // Filter devices by type
  const filteredDevices = filterType === 'all' ? devices : devices.filter(device => device.type === filterType);

  // Mini-dashboard stats
  const totalDevices = devices.length;
  const activeDevices = devices.filter(device => device.status).length;
  const lastModifiedDevice = devices.sort((a, b) => (b.updatedAt?.toDate() || 0) - (a.updatedAt?.toDate() || 0))[0];

  if (isLoading || !user) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <Switch
            checked={theme === 'dark'}
            onChange={toggleTheme}
            className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-200 dark:bg-gray-600"
          >
            <span className="sr-only">Toggle theme</span>
            <span
              className={`${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              } inline-block w-4 h-4 transform bg-white rounded-full transition`}
            />
            {theme === 'dark' ? (
              <MoonIcon className="w-4 h-4 absolute left-1 text-yellow-400" />
            ) : (
              <SunIcon className="w-4 h-4 absolute right-1 text-yellow-400" />
            )}
          </Switch>
        </div>

        {/* Mini Dashboard */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Resumen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">Total Dispositivos</p>
              <p className="text-2xl font-bold text-yellow-400">{totalDevices}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">Dispositivos Activos</p>
              <p className="text-2xl font-bold text-yellow-400">{activeDevices}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">Último Modificado</p>
              <p className="text-sm font-medium text-yellow-400">
                {lastModifiedDevice ? lastModifiedDevice.name || 'Sin nombre' : 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
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
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Bienvenido, {user.name || user.username || 'Usuario'}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Rol: {user.role}</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Actualizar
            </button>
          </div>

          {/* Devices Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-yellow-400">Dispositivos</h2>
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                >
                  <option value="all">Todos</option>
                  <option value="light">Luces</option>
                  <option value="sensor">Sensores</option>
                  <option value="thermostat">Termostatos</option>
                  <option value="camera">Cámaras</option>
                </select>
              </div>
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
            ) : filteredDevices.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No hay dispositivos para mostrar.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDevices.map((device) => (
                  <motion.div
                    key={device.id}
                    className={`p-4 rounded-lg shadow-md transition-shadow duration-300 ${
                      device.status
                        ? 'bg-green-50 dark:bg-green-900/50 border-2 border-green-500'
                        : 'bg-red-50 dark:bg-red-900/50 border-2 border-red-500'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {deviceIcons[device.type] || deviceIcons.default}
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">
                            {device.name || 'Sin nombre'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Tipo: {device.type || 'N/A'}</p>
                        </div>
                      </div>
                      <Switch
                        checked={device.currentState === 'on'}
                        onChange={() => toggleDevice(device.id, device.currentState)}
                        className={`${
                          device.currentState === 'on' ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span
                          className={`${
                            device.currentState === 'on' ? 'translate-x-6' : 'translate-x-1'
                          } inline-block w-4 h-4 transform bg-white rounded-full transition`}
                        />
                      </Switch>
                    </div>
                    <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <Link
                        to={`/devices/${device.id}/control`}
                        className="w-full sm:w-auto px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors text-center"
                      >
                        Controlar
                      </Link>
                      <button
                        onClick={() => handleRemoveDevice(device.id, device.name)}
                        className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        aria-label={`Eliminar dispositivo ${device.name || 'Sin nombre'}`}
                      >
                        <TrashIcon className="w-5 h-5 mr-1" /> Eliminar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Purchases Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">Tus Compras</h2>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {purchases.map((purchase) => (
                  <motion.div
                    key={purchase.id}
                    className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <svg
                          className="w-6 h-6 text-yellow-400"
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
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Monto: ${purchase.amount?.toFixed(2) || '0.00'} {purchase.currency?.toUpperCase() || 'USD'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Fecha:{' '}
                            {purchase.createdAt
                              ? purchase.createdAt.toDate().toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'Sin fecha'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemovePurchase(purchase.id, purchase.componentName)}
                        className="px-3 py-1 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        aria-label={`Eliminar compra ${purchase.componentName || 'Sin nombre'}`}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">Acciones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { to: '/user/profile', label: 'Editar Perfil' },
                { to: '/devices/add', label: 'Añadir Dispositivo' },
                { to: '/schedules', label: 'Ver Horarios' },
                { to: '/Tareas', label: 'Ver Tareas' },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default UserDashboard;