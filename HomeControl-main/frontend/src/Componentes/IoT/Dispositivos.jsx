import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@headlessui/react';
import { toast } from 'react-toastify';
import { db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Dispositivos = ({ user, devices, setDevices, error, isLoading }) => {
  const [isUpdating, setIsUpdating] = useState({});

  const handleToggleDevice = useCallback(
    async (deviceId) => {
      if (!user) {
        toast.error('Inicia sesión para controlar dispositivos.');
        return;
      }

      setIsUpdating((prev) => ({ ...prev, [deviceId]: true }));
      try {
        const device = devices.find((d) => d.id === deviceId);
        const updatedDevice = { ...device, status: !device.status };
        await setDoc(doc(db, 'devices', deviceId), updatedDevice, { merge: true });
        setDevices((prev) =>
          prev.map((d) => (d.id === deviceId ? updatedDevice : d))
        );
        toast.success(
          `Dispositivo ${updatedDevice.name} ${
            updatedDevice.status ? 'encendido' : 'apagado'
          }`
        );
      } catch (error) {
        console.error('Error updating device:', error);
        toast.error('Error al actualizar el dispositivo');
      } finally {
        setIsUpdating((prev) => ({ ...prev, [deviceId]: false }));
      }
    },
    [user, devices, setDevices]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-amber-600 dark:text-amber-400 mb-4">
        Dispositivos
      </h2>
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6"
          role="alert"
        >
          <p>{error}</p>
          {!user && (
            <Link to="/login" className="text-amber-600 underline">
              Inicia sesión
            </Link>
          )}
        </div>
      )}
      {devices.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No hay dispositivos disponibles.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {devices.map((device) => (
            <motion.div
              key={device.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-amber-200/20 hover:shadow-md"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {device.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tipo: {device.type === 'light' ? 'Luz' : 'Enchufe'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estado: {device.status ? 'Encendido' : 'Apagado'}
                  </p>
                </div>
                <Switch
                  checked={device.status}
                  onChange={() => handleToggleDevice(device.id)}
                  className={`${
                    device.status
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-600'
                  } relative inline-flex items-center h-6 rounded-full w-11 disabled:opacity-50`}
                  disabled={isUpdating[device.id]}
                  aria-label={`Alternar estado de ${device.name}`}
                >
                  <span className="sr-only">
                    {device.status
                      ? `Apagar ${device.name}`
                      : `Encender ${device.name}`}
                  </span>
                  <span
                    className={`${
                      device.status ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition`}
                  />
                </Switch>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dispositivos;