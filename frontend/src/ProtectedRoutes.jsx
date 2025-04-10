import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Componentes/Autenticacion/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  // Mientras se carga el estado de autenticación, muestra un spinner
  if (isLoading) {
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg font-semibold text-teal-800">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos y el rol del usuario no está incluido, redirige a unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si todo está bien, renderiza el componente hijo (e.g., EditorContent)
  return children;
};

export default ProtectedRoute;