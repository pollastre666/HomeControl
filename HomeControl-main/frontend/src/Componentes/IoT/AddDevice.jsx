import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import componentOptions from './devices'; // Fixed: Use default import


const AddDevice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para añadir un dispositivo.');
      toast.error('Debes iniciar sesión.');
      return;
    }

    if (!name || !type || !location) {
      setError('Por favor, completa todos los campos.');
      toast.error('Completa todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generar referencia a un nuevo documento en la colección 'devices'
      const newDeviceRef = doc(collection(db, 'devices'));
      const deviceId = newDeviceRef.id;
      const now = new Date();
      const deviceData = {
        createdAt: now,
        updatedAt: now,
        currentState: "off",
        deviceId: deviceId,
        lastCommand: now,
        lastSchedule: "",
        location,
        name,
        online: false,
        type,
        userId: user.uid,
      };
      await setDoc(newDeviceRef, deviceData);
      toast.success('Dispositivo añadido con éxito');
      setName('');
      setType('');
      setLocation('');
      navigate('/user/dashboard');
    } catch (error) {
      setError(`Error al añadir dispositivo: ${error.message}`);
      toast.error(`Error al añadir dispositivo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Añadir Nuevo Dispositivo
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre del Dispositivo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Luz Cocina"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 sm:text-sm"
                required
              />
            </div>
            {/* Tipo */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Dispositivo
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 sm:text-sm"
                required
              >
                <option value="">-- Selecciona un tipo --</option>
                <option value="luz">Luz</option>
                <option value="sensor">Sensor</option>
                <option value="enchufe">Enchufe</option>
                {/* Agrega más tipos según tu sistema */}
              </select>
            </div>
            {/* Ubicación */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ubicación
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Kitchen"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 sm:text-sm"
                required
              />
            </div>
          </div>
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded">
              <p>{error}</p>
            </div>
          )}
          {/* Botón */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !user}
              className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Añadiendo...' : 'Añadir Dispositivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDevice;