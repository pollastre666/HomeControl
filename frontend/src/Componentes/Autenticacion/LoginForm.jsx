import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Spinner from '../Spinner';

const LoginForm = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor, ingresa un correo válido');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (isSignUp) {
      if (!formData.username || formData.username.length < 3) {
        setError('El nombre de usuario debe tener al menos 3 caracteres');
        return false;
      }
      if (!formData.confirmPassword) {
        setError('Por favor, confirma tu contraseña');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signup({
          email: formData.email,
          password: formData.password,
          username: formData.username,
        });
        toast.success('Cuenta creada. Por favor, verifica tu correo.');
        setFormData({ email: '', password: '', confirmPassword: '', username: '' });
        setIsSignUp(false);
      } else {
        await login({ email: formData.email, password: formData.password });
        toast.success('Inicio de sesión exitoso');
        navigate('/user/dashboard');
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setFormData({ email: '', password: '', confirmPassword: '', username: '' });
  };

  return (
 
 
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* IoT-themed background element */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            aria-hidden="true"
          >
            <svg
              className="w-full h-full text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M10,50 C30,20 70,80 90,50 M50,10 C20,30 80,70 50,90"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
            {isSignUp ? 'Crear Cuenta Nueva' : 'Iniciar Sesión'}
          </h2>

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

          <form onSubmit={handleSubmit} className="space-y-5" aria-label={isSignUp ? 'Formulario de registro' : 'Formulario de inicio de sesión'}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Correo
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition-all duration-200"
                  placeholder="Correo electrónico"
                  required
                  disabled={isLoading}
                  aria-required="true"
                  aria-describedby="email-error"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition-all duration-200"
                    placeholder="tu_usuario"
                    required
                    disabled={isLoading}
                    aria-required="true"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition-all duration-200"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  aria-required="true"
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
                    d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2v2H6v-2C6 8.24 8.24 6 11 6s5 2.24 5 5v2h-2v-2zm-5 6v-2h10v2H7zm5 4c-2.21 0-4-1.79-4-4h2c0 1.104.896 2 2 2s2-.896 2-2h2c0 2.21-1.79 4-4 4z"
                  />
                </svg>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition-all duration-200"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    aria-required="true"
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
                      d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2v2H6v-2C6 8.24 8.24 6 11 6s5 2.24 5 5v2h-2v-2zm-5 6v-2h10v2H7zm5 4c-2.21 0-4-1.79-4-4h2c0 1.104.896 2 2 2s2-.896 2-2h2c0 2.21-1.79 4-4 4z"
                    />
                  </svg>
                </div>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={isLoading ? 'Procesando' : isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            >
              {isLoading ? <Spinner /> : isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>
              {isSignUp ? (
                <>
                  ¿Ya tienes cuenta?{' '}
                  <button
                    onClick={toggleMode}
                    className="text-yellow-400 hover:underline font-medium"
                    disabled={isLoading}
                    aria-label="Cambiar a inicio de sesión"
                  >
                    Inicia sesión
                  </button>
                </>
              ) : (
                <>
                  ¿No tienes cuenta?{' '}
                  <button
                    onClick={toggleMode}
                    className="text-yellow-400 hover:underline font-medium"
                    disabled={isLoading}
                    aria-label="Cambiar a registro"
                  >
                    Crea una cuenta
                  </button>
                </>
              )}
            </p>
            {!isSignUp && (
              <p>
                <Link to="/forgot-password" className="text-yellow-400 hover:underline" aria-label="Recuperar contraseña">
                  ¿Olvidaste tu contraseña?
                </Link>
              </p>
            )}
            {isSignUp && (
              <p>
                Verifica tu correo y completa tu perfil tras crear la cuenta.
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>

  );
};

export default LoginForm;