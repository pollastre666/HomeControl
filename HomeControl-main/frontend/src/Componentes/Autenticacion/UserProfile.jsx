import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import Layout from '../../hocs/layouts/layout';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';
import { getMessaging, getToken } from 'firebase/messaging';

// Profile Summary Component
const ProfileSummary = ({ user, onAvatarChange, isEditing, toggleEdit }) => {
  const [avatar, setAvatar] = useState(user.avatar || `https://www.gravatar.com/avatar/${user.email}?d=identicon`);
  const [error, setError] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen debe ser menor a 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
        onAvatarChange(file, reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  return (
    <motion.div
      className="shadow-lg rounded-lg p-6 h-fit bg-white"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      role="region"
      aria-label="Resumen del perfil"
    >
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-4">
          {isEditing ? (
            <>
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <img
                  src={avatar}
                  alt="Foto de perfil"
                  className="w-full h-full rounded-full object-cover border-2 border-yellow-400"
                  aria-label="Imagen de perfil del usuario"
                />
                <div className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full hover:bg-yellow-500">
                  <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.5 3H7a2 2 0 00-2 2v10a2 2 0 002 2h6.5l3-3.5V5a2 2 0 00-2-2z" />
                  </svg>
                </div>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                aria-describedby="avatar-error"
                aria-invalid={!!error}
              />
              {error && (
                <p id="avatar-error" className="text-red-600 text-sm mt-2" role="alert">
                  {error}
                </p>
              )}
            </>
          ) : (
            <img
              src={avatar}
              alt="Foto de perfil"
              className="w-full h-full rounded-full object-cover"
              aria-label="Imagen de perfil del usuario"
            />
          )}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{user.name || 'Usuario'}</h2>
        <p className="text-gray-600">{user.email}</p>
        <button
          onClick={toggleEdit}
          className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
          aria-label={isEditing ? 'Cancelar edición' : 'Editar perfil'}
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>
    </motion.div>
  );
};

// Profile Form Component
const ProfileForm = ({ formData, setFormData, user, onSubmit, errors, isEditing, toggleEdit, onDraftSave }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    onDraftSave({ ...formData, [name]: value });
  };

  return (
    <motion.div
      className="shadow-lg rounded-lg p-6 bg-white"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      role="form"
      aria-label="Formulario de edición de perfil"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-yellow-400">Editar Perfil</h2>
        <button
          onClick={toggleEdit}
          className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500"
          aria-label={isEditing ? 'Cancelar edición' : 'Editar perfil'}
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>
      <AnimatePresence>
        {isEditing ? (
          <motion.form
            onSubmit={onSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-300">
              <h3 className="text-lg font-medium mb-4 text-gray-900">Información Personal</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                    aria-required="true"
                    aria-describedby="name-error"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-600 text-sm mt-1" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block-height w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                    aria-describedby="phone-error"
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="text-red-600 text-sm mt-1" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-300">
              <h3 className="text-lg font-medium mb-4 text-gray-900">Dirección</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                    Código postal
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                    aria-describedby="postalCode-error"
                    aria-invalid={!!errors.postalCode}
                  />
                  {errors.postalCode && (
                    <p id="postalCode-error" className="text-red-600 text-sm mt-1" role="alert">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    País
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <motion.button
                type="submit"
                className="px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Guardar cambios de perfil"
              >
                Guardar Cambios
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-300">
              <h3 className="text-lg font-medium mb-4 text-gray-900">Información Personal</h3>
              <p className="text-gray-700"><strong>Nombre:</strong> {formData.name || 'No especificado'}</p>
              <p className="text-gray-700"><strong>Teléfono:</strong> {formData.phone || 'No especificado'}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-300">
              <h3 className="text-lg font-medium mb-4 text-gray-900">Dirección</h3>
              <p className="text-gray-700"><strong>Dirección:</strong> {formData.street || 'No especificado'}</p>
              <p className="text-gray-700"><strong>Ciudad:</strong> {formData.city || 'No especificado'}</p>
              <p className="text-gray-700"><strong>Código postal:</strong> {formData.postalCode || 'No especificado'}</p>
              <p className="text-gray-700"><strong>País:</strong> {formData.country || 'No especificado'}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Progress Bar Component
const ProfileProgress = ({ formData }) => {
  const fields = ['name', 'phone', 'street', 'city', 'postalCode', 'country'];
  const filledFields = fields.filter((field) => formData[field]).length;
  const progress = (filledFields / fields.length) * 100;

  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-700">Completitud del Perfil: {Math.round(progress)}%</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div
          className="bg-yellow-400 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

// Main UserProfile Component
const UserProfile = () => {
  const { user, isLoading, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const savedDraft = localStorage.getItem('profileDraft');
    return savedDraft ? JSON.parse(savedDraft) : {
      name: '',
      phone: '',
      street: '',
      city: '',
      postalCode: '',
      country: '',
      avatar: ''
    };
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const initialData = {
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || '',
        avatar: user.avatar || ''
      };
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('profileDraft', JSON.stringify(formData));
  }, [formData]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (name === 'name' && !value) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (name === 'name') {
      delete newErrors.name;
    }
    if (name === 'phone' && value && !/^[0-9]{10}$/.test(value)) {
      newErrors.phone = 'Teléfono debe tener 10 dígitos';
    } else if (name === 'phone') {
      delete newErrors.phone;
    }
    if (name === 'postalCode' && value && !/^[0-9]{5}$/.test(value)) {
      newErrors.postalCode = 'Código postal debe tener 5 dígitos';
    } else if (name === 'postalCode') {
      delete newErrors.postalCode;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (file, avatarUrl) => {
    setFormData((prev) => ({ ...prev, avatar: avatarUrl }));
    localStorage.setItem('profileDraft', JSON.stringify({ ...formData, avatar: avatarUrl }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateField('name', formData.name)) return;

    const updates = {
      name: formData.name,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country
      },
      avatar: formData.avatar,
      profileIncomplete: false
    };

    try {
      await updateUserProfile(updates);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsEditing(false);
        localStorage.removeItem('profileDraft');
        navigate('/user/dashboard');
      }, 1500);
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const messaging = getMessaging();
        const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_FCM_VAPID_KEY });
        await updateUserProfile({ fcmToken: token });
        toast.success('Notificaciones habilitadas');
      } else {
        toast.error('Permiso de notificaciones denegado');
      }
    } catch (error) {
      toast.error('Error al habilitar notificaciones');
    }
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  if (isLoading) return <Layout><Spinner /></Layout>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <motion.div
        className="container mx-auto px-4 py-8 max-w-6xl min-h-screen bg-gray-100 text-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">Mi Perfil - Home Control</h1>
        <ProfileProgress formData={formData} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProfileSummary
            user={user}
            onAvatarChange={handleAvatarChange}
            isEditing={isEditing}
            toggleEdit={toggleEdit}
          />
          <ProfileForm
            formData={formData}
            setFormData={setFormData}
            user={user}
            onSubmit={handleUpdateProfile}
            errors={errors}
            isEditing={isEditing}
            toggleEdit={toggleEdit}
            onDraftSave={(data) => localStorage.setItem('profileDraft', JSON.stringify(data))}
          />
        </div>
        <button
          onClick={requestNotificationPermission}
          className="mt-6 px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500"
          aria-label="Habilitar notificaciones push"
        >
          {user.fcmToken ? 'Notificaciones habilitadas' : 'Habilitar Notificaciones'}
        </button>
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              role="alert"
              aria-label="Perfil actualizado correctamente"
            >
              <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Perfil actualizado
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default UserProfile;