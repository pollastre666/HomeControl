import React from 'react';
import { useAuth } from './Componentes/Autenticacion/AuthProvider';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  console.log('ProtectedRoute: user=', user, 'isLoading=', isLoading, 'allowedRoles=', allowedRoles);

  if (isLoading) {
    return <div className="text-center text-gray-600 py-8">Cargando...</div>;
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute: Rol no autorizado, redirigiendo a /unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;