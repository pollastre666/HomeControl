import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './Containers/Paginas/HomePage'; 
import LoginForm from './Componentes/Autenticacion/LoginForm';
import DataTable from './Containers/Paginas/Horarios';
import MapSection from './Componentes/Ubicacion';
import Nosotros from './Containers/Paginas/Nosotros';
import AdminDashboard from './Componentes/Dashboard/AdminDashboard';
import EditorContent from './Componentes/Autenticacion/EditorContent'; // Ajustado
import UserProfile from './Componentes/Autenticacion/UserProfile'; // Ajustado
import Unauthorized from './Componentes/Autenticacion/Unauthorized'; // Ajustado
import ProtectedRoute from './ProtectedRoutes'; // Ajustado

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Horarios" element={<DataTable />} />
        <Route path="/Ubicacion" element={<MapSection />} />
        <Route path="/Nosotros" element={<Nosotros />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/content"
          element={
            <ProtectedRoute allowedRoles={['editor', 'admin']}>
              <EditorContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRoles={['user', 'editor', 'admin']}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user', 'editor', 'admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Ruta de acceso denegado */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Ruta por defecto */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;