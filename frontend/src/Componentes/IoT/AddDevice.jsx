import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import componentOptions from './devices'; // Fixed: Use default import

const AddDevice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (selectedComponent) {
      const component = componentOptions.find(c => c.id === selectedComponent);
      setPreview(component);
      setName(component?.name || '');
    } else {
      setPreview(null);
      setName('');
    }
  }, [selectedComponent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para añadir un dispositivo.');
      toast.error('Debes iniciar sesión.');
      return;
    }

    if (!name || !selectedComponent) {
      setError('Por favor, completa todos los campos.');
      toast.error('Completa todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const deviceId = `device-${Date.now()}`;
      const component = componentOptions.find(c => c.id === selectedComponent);
      const deviceData = {
        owner: user.uid,
        name,
        type: component?.name || selectedComponent,
        componentId: selectedComponent,
        category: component?.category || 'Unknown',
        specs: component?.specs || {},
        status: false,
        createdAt: new Date(),
      };
      await setDoc(doc(db, 'devices', deviceId), deviceData);
      toast.success('Dispositivo añadido con éxito');
      setName('');
      setSelectedComponent('');
      setPreview(null);
      navigate('/user/dashboard');
    } catch (error) {
      const errorMessage = error.code === 'permission-denied'
        ? 'No tienes permiso para añadir dispositivos. Verifica tu autenticación o las reglas de Firestore.'
        : `Error al añadir dispositivo: ${error.message}`;
      setError(errorMessage);
      toast.error(errorMessage);
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
        <p className="text-center text-gray-600 dark:text-gray-400">
          Selecciona un componente y personaliza tu dispositivo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Component Selection */}
            <div>
              <label htmlFor="component" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Seleccionar Componente
              </label>
              <select
                id="component"
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 sm:text-sm"
                required
              >
                <option value="">-- Selecciona un componente --</option>
                {componentOptions.map((component) => (
                  <option key={component.id} value={component.id}>
                    {component.name} ({component.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Device Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre del Dispositivo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Sensor de Sala"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded">
              <p>{error}</p>
            </div>
          )}

          {/* Preview Card */}
          {preview && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 flex items-center space-x-6">
              <img
                src={preview.image}
                alt={preview.name}
                className="w-32 h-32 object-cover rounded-lg"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/128'; }}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {preview.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{preview.description}</p>

              </div>
            </div>
          )}

          {/* Submit Button */}
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