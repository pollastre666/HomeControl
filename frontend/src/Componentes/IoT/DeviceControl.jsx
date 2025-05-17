import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../hocs/layouts/layout';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';
import { Switch } from '@headlessui/react';
import { DevicePhoneMobileIcon, LightBulbIcon, CameraIcon, FireIcon, LockClosedIcon, PencilIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const DeviceControl = () => {
  const { user, checkDeviceAccess } = useAuth();
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Device type icons mapping
  const deviceIcons = {
    light: <LightBulbIcon className="w-8 h-8 text-yellow-400" />,
    sensor: <DevicePhoneMobileIcon className="w-8 h-8 text-yellow-400" />,
    thermostat: <FireIcon className="w-8 h-8 text-yellow-400" />,
    camera: <CameraIcon className="w-8 h-8 text-yellow-400" />,
    lock: <LockClosedIcon className="w-8 h-8 text-yellow-400" />,
    default: <DevicePhoneMobileIcon className="w-8 h-8 text-yellow-400" />,
  };

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
          setNewName(deviceDoc.data().name || 'Dispositivo');
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
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'devices', deviceId), updates);
      setDevice({ ...device, ...updates });
      toast.success('Dispositivo actualizado');
    } catch (error) {
      console.error('DeviceControl: Device update error:', error);
      setError('Error al actualizar dispositivo');
      toast.error('Error al actualizar dispositivo');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNameChange = async () => {
    if (newName.trim() === '') {
      toast.error('El nombre no puede estar vacío');
      return;
    }
    await updateDevice({ name: newName.trim() });
    setIsEditingName(false);
  };

  if (isLoading || !device) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <motion.div
        className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {deviceIcons[device.type] || deviceIcons.default}
              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-xl font-bold text-gray-800 dark:text-gray-200 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none"
                    aria-label="Editar nombre del dispositivo"
                  />
                  <button
                    onClick={handleNameChange}
                    className="text-yellow-400 hover:text-yellow-500"
                    aria-label="Guardar nombre"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-label="Cancelar edición"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {device.name || 'Dispositivo'}
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-yellow-400 hover:text-yellow-500"
                    aria-label="Editar nombre del dispositivo"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg text-center"
              role="alert"
              aria-live="polite"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            {/* Status Control */}
            <motion.div
              className={`relative p-4 rounded-lg ${
                device.status
                  ? 'bg-green-50 dark:bg-green-900/50 border-2 border-green-500'
                  : 'bg-red-50 dark:bg-red-900/50 border-2 border-red-500'
              }`}
              initial={{ scale: 1 }}
              animate={{ scale: device.status ? [1, 1.02, 1] : [1, 0.98, 1] }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence>
                {isUpdating && (
                  <motion.div
                    className="absolute inset-0 bg-gray-200 dark:bg-gray-700 bg-opacity-50 flex items-center justify-center rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Spinner />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {deviceIcons[device.type] || deviceIcons.default}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Estado
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Actualmente:{' '}
                      <span className={device.status ? 'text-green-500' : 'text-red-500'}>
                        {device.type === 'lock' ? (device.status ? 'Bloqueado' : 'Desbloqueado') : (device.status ? 'Encendido' : 'Apagado')}
                      </span>
                    </p>
                  </div>
                </div>
                <Switch
                  checked={device.status}
                  onChange={() => updateDevice({ status: !device.status })}
                  className={`${
                    device.status ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
                  } relative inline-flex items-center h-6 rounded-full w-11`}
                  disabled={isUpdating}
                >
                  <span className="sr-only">
                    Cambiar estado de {device.name || 'dispositivo'}
                  </span>
                  <span
                    className={`${
                      device.status ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition`}
                  />
                </Switch>
              </div>
            </motion.div>

            {/* Thermostat Control */}
            {device.type === 'thermostat' ? (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <label
                  htmlFor="temperature"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Temperatura (°C)
                </label>
                <div className="relative mt-2">
                  <input
                    type="range"
                    id="temperature"
                    value={device.temperature || 20}
                    onChange={(e) => updateDevice({ temperature: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-yellow-400"
                    min="10"
                    max="30"
                    step="0.5"
                    aria-label="Ajustar temperatura"
                    disabled={isUpdating}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">10°C</span>
                    <span className="text-sm font-medium text-yellow-400">{device.temperature || 20}°C</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">30°C</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Este dispositivo no admite control de temperatura.
                </p>
              </div>
            )}

            {/* Camera Control */}
            {device.type === 'camera' && (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <CameraIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vista en vivo no disponible en modo demo.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Contacte al soporte para habilitar esta función.
                </p>
              </div>
            )}

            {/* Advanced Settings */}
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-200"
                aria-label={showAdvanced ? 'Ocultar configuración avanzada' : 'Mostrar configuración avanzada'}
              >
                <span>Configuración Avanzada</span>
                {showAdvanced ? (
                  <ChevronUpIcon className="w-5 h-5 text-yellow-400" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-yellow-400" />
                )}
              </button>
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Historial de Actividad
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        No hay datos de actividad disponibles en modo demo.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Configuración Adicional
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Funciones avanzadas no implementadas.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <motion.button
              onClick={() => navigate('/user/dashboard')}
              className="w-full sm:w-auto min-h-[48px] px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Volver al dashboard"
            >
              Volver al Dashboard
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default DeviceControl;