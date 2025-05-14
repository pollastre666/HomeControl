import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import Layout from '../../hocs/layouts/layout';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';
import { getMessaging, getToken } from 'firebase/messaging';

const UserProfile = () => {
  const { user, isLoading, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || '',
      });
    }
  }, [user]);

  if (isLoading) return <Layout><Spinner /></Layout>;
  if (!user) return <Navigate to="/login" replace />;

  const validateForm = () => {
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      setFormError('Teléfono debe tener 10 dígitos');
      return false;
    }
    if (formData.postalCode && !/^[0-9]{5}$/.test(formData.postalCode)) {
      setFormError('Código postal debe tener 5 dígitos');
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updates = {
      name: formData.name || user.name || '',
      phone: formData.phone || user.phone || '',
      address: {
        street: formData.street || user.address?.street || '',
        city: formData.city || user.address?.city || '',
        postalCode: formData.postalCode || user.address?.postalCode || '',
        country: formData.country || user.address?.country || '',
      },
      profileIncomplete: false,
    };

    try {
      await updateUserProfile(updates);
      toast.success('Perfil actualizado correctamente');
      navigate('/user/dashboard');
    } catch (error) {
      setFormError('Error al actualizar el perfil');
      toast.error('Error al actualizar el perfil');
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const messaging = getMessaging();
      const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_FCM_VAPID_KEY });
      await updateUserProfile({ fcmToken: token });
      toast.success('Notificaciones habilitadas');
    } catch (error) {
      toast.error('Error al habilitar notificaciones');
    }
  };

  return (
    <Layout>
      <motion.div
        className="container mx-auto px-4 py-8 max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">Mi Perfil - IoT Solutions</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <motion.div
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 h-fit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-yellow-400"
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
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{user.name || 'Usuario'}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <button
                type="button"
                onClick={requestNotificationPermission}
                className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors duration-200"
                aria-label="Habilitar notificaciones push"
              >
                {user.fcmToken ? 'Notificaciones habilitadas' : 'Habilitar Notificaciones'}
              </button>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            className="md:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {formError && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center" role="alert" aria-live="polite">
                {formError}
              </div>
            )}
            <h2 className="text-2xl font-semibold text-yellow-400 mb-6">Editar Perfil</h2>
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Formulario de edición de perfil">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200"
                  aria-required="true"
                  aria-describedby="name-error"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200"
                  aria-describedby="phone-error"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Dirección
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Ciudad
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Código postal
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200"
                  aria-describedby="postalCode-error"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  País
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <motion.button
                  type="submit"
                  className="px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Guardar cambios de perfil"
                >
                  Guardar Cambios
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default UserProfile;