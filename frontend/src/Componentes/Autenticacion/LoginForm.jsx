import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { toast } from 'react-toastify';
import { sendEmailVerification } from 'firebase/auth';

const ERROR_MESSAGES = {
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/user-not-found': 'Usuario no encontrado',
  'auth/invalid-email': 'Formato de correo inválido',
  'auth/invalid-credential': 'Credenciales inválidas',
  'auth/email-already-in-use': 'El correo ya está registrado',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
  default: 'Error de autenticación',
};

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [lastFirebaseUser, setLastFirebaseUser] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { login, createUser, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      console.log('Redirecting authenticated user:', user.email, 'Role:', user.role);
      const redirectPath =
        user.role === 'admin'
          ? '/admin/dashboard'
          : user.role === 'editor'
          ? '/editor/content'
          : '/user/profile';
      navigate(redirectPath, { replace: true });
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-12 w-12 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-lg font-semibold text-indigo-800">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleResendVerification = async () => {
    if (!lastFirebaseUser) {
      setError('No hay usuario registrado para reenviar el correo.');
      toast.error('No hay usuario registrado para reenviar el correo.');
      return;
    }
    if (resendCooldown > 0) {
      toast.warn(`Por favor, espera ${resendCooldown} segundos antes de reenviar.`);
      return;
    }
    setIsSubmitting(true);
    try {
      const actionCodeSettings = {
        url: 'https://homecontrol-dac34.web.app/login', // Production URL
        handleCodeInApp: true,
      };
      await sendEmailVerification(lastFirebaseUser, actionCodeSettings);
      console.log('Resent verification email to:', lastFirebaseUser.email, 'UID:', lastFirebaseUser.uid);
      toast.success('Correo de verificación reenviado. Revisa tu bandeja de entrada o spam.');
      setResendCooldown(30); // 30-second cooldown
    } catch (verificationError) {
      console.error('Error resending verification email:', verificationError.code, verificationError.message);
      const errorMessage = 'Error al reenviar el correo de verificación: ' + verificationError.message;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { email, password, confirmPassword } = formData;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Formato de correo inválido');
      toast.error('Formato de correo inválido');
      setIsSubmitting(false);
      return;
    }

    if (isLogin) {
      try {
        console.log('Submitting login form with:', email.trim());
        const response = await login({ email: email.trim(), password });
        console.log('Login response:', response);
        toast.success('Inicio de sesión exitoso');
      } catch (err) {
        console.error('Login error:', err.code, err.message);
        const errorMessage = ERROR_MESSAGES[err.code] || `${ERROR_MESSAGES.default}: ${err.message}`;
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        toast.error('Las contraseñas no coinciden');
        setIsSubmitting(false);
        return;
      }

      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        toast.error('La contraseña debe tener al menos 6 caracteres');
        setIsSubmitting(false);
        return;
      }

      try {
        console.log('Submitting signup form with:', email.trim());
        const firebaseUser = await createUser(email.trim(), password);
        console.log('Signup response:', {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
        });
        setLastFirebaseUser(firebaseUser);

        // Send email verification
        try {
          const actionCodeSettings = {
            url: 'https://homecontrol-dac34.web.app/login', // Production URL
            handleCodeInApp: true,
          };
          await sendEmailVerification(firebaseUser, actionCodeSettings);
          console.log('Verification email sent successfully to:', email.trim(), 'UID:', firebaseUser.uid);
          console.log('Action code settings:', actionCodeSettings);
          toast.success('Cuenta creada. Por favor, verifica tu correo electrónico.');
        } catch (verificationError) {
          console.error('Error sending verification email:', verificationError.code, verificationError.message);
          const errorMessage = 'Error al enviar el correo de verificación: ' + verificationError.message;
          setError(errorMessage);
          toast.error(errorMessage);
          throw verificationError;
        }

        setVerificationSent(true);
        setFormData({ email: '', password: '', confirmPassword: '' });
        setIsLogin(true);
        setResendCooldown(30); // 30-second cooldown
      } catch (err) {
        console.error('Signup error:', err.code, err.message);
        const errorMessage = ERROR_MESSAGES[err.code] || `${ERROR_MESSAGES.default}: ${err.message}`;
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Verifica tu Correo</h1>
          <p className="text-gray-600 mb-6">
            Te hemos enviado un correo de verificación a <strong>{formData.email}</strong>. Por favor,
            verifica tu correo antes de iniciar sesión. Revisa tu bandeja de spam si no lo encuentras.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleResendVerification}
              disabled={isSubmitting || resendCooldown > 0}
              className="bg-green-600 text-white py-2.5 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Enviando...'
                : resendCooldown > 0
                ? `Reenviar en ${resendCooldown}s`
                : 'Reenviar Correo de Verificación'}
            </button>
            <button
              onClick={() => {
                setVerificationSent(false);
              }}
              className="bg-indigo-600 text-white py-2.5 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
            >
              Volver a Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:bg-gray-100"
              placeholder="ejemplo@dominio.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:bg-gray-100"
              placeholder="******"
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600 focus:outline-none"
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:bg-gray-100"
                placeholder="******"
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {isLogin ? 'Autenticando...' : 'Creando cuenta...'}
              </>
            ) : (
              isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setFormData({ email: '', password: '', confirmPassword: '' });
              setVerificationSent(false);
            }}
            className="ml-1 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {isLogin ? 'Crear una cuenta' : 'Iniciar sesión'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;