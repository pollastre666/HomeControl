import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { toast } from 'react-toastify';
import Spinner from '../Spinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor, ingresa un correo válido');
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Correo de restablecimiento enviado. Revisa tu bandeja de entrada.');
      setEmail('');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (error) {
      const errorMessages = {
        'auth/invalid-email': 'Correo inválido',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/too-many-requests': 'Demasiados intentos, intenta de nuevo más tarde',
      };
      const errorMessage = errorMessages[error.code] || 'Error al enviar correo';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          Restablecer Contraseña
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          Ingresa tu correo para recibir un enlace de restablecimiento.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulario de restablecimiento de contraseña">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Correo
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200"
              placeholder="tu@correo.com"
              required
              disabled={isLoading}
              aria-required="true"
              aria-describedby="email-error"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:btn-disabled"
            aria-label={isLoading ? 'Enviando correo' : 'Enviar correo de restablecimiento'}
          >
            {isLoading ? <Spinner /> : 'Enviar Correo'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          ¿Recordaste tu contraseña?{' '}
          <Link to="/login" className="text-primary hover:underline" aria-label="Volver a inicio de sesión">
            Inicia sesión
          </Link>
        </p>
      </div>

  );
};

export default ForgotPassword;