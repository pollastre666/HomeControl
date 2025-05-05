import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './Componentes/Autenticacion/AuthProvider';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);
  const toastId = React.useRef(null);

  // Delay loader para evitar parpadeo en cargas rápidas
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Debounce para notificaciones
  const showDebouncedToast = (message, type = 'warn') => {
    if (!toast.isActive(toastId.current)) {
      toastId.current = toast[type](message, { toastId: message });
    }
  };

  if (isLoading || showLoader) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-12 w-12 text-teal-600"
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
          <p className="text-lg font-semibold text-teal-800">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.debug('Redirección a login desde:', location.pathname);
    showDebouncedToast('Acceso restringido: Debes iniciar sesión', 'warning');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Intento de acceso no autorizado: ${user.role} a ${location.pathname}`);
    showDebouncedToast('No tienes permisos para esta sección', 'error');
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Solo renderizar hijos si pasa todas las validaciones
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;