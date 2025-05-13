import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './Containers/Paginas/HomePage';
<<<<<<< HEAD
import LoginForm from './Componentes/Autenticacion/LoginForm';
import DataTable from './Containers/Paginas/Horarios';
import MapSection from './Componentes/Ubicacion';
=======
import DataTable from './Containers/Paginas/Horarios';
import TareasComponent from './Containers/Paginas/Tareas';
import MapContactSection from './Componentes/Ubicacion';
>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6
import Nosotros from './Containers/Paginas/Nosotros';
import AdminDashboard from './Componentes/Dashboard/AdminDashboard';
import EditorContent from './Componentes/Autenticacion/EditorContent';
import UserProfile from './Componentes/Autenticacion/UserProfile';
import Unauthorized from './Componentes/Autenticacion/Unauthorized';
import ProtectedRoute from './ProtectedRoutes';
import ErrorPage from './Containers/Errores/Error404';
import Asistencia from './Containers/Paginas/Asistencia';
import Contacto from './Componentes/Asistencia/Contacto';
<<<<<<< HEAD
=======
import LoginForm from './Componentes/Autenticacion/LoginForm';
import MasInformacion from './Componentes/Home/masInformacion';

>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
<<<<<<< HEAD
        <Route path="/Horarios" element={<DataTable />} />
        <Route path="/Ubicacion" element={<MapSection />} />
        <Route path="/Nosotros" element={<Nosotros />} />
        <Route path="/Asistencia" element={<Asistencia />} />
        <Route path="/Contacto" element={<Contacto />} />
        {/* Protected Routes */}
        <Route
=======
        <Route path="/Ubicacion" element={<MapContactSection />} />
        <Route path="/Nosotros" element={<Nosotros />} />
        <Route path="/Asistencia" element={<Asistencia />} />
        <Route path="/Contacto" element={<Contacto />} />
        <Route path="/Mas-Informacion" element={<MasInformacion />} />

        {/* Protected Routes */}
        <Route
          path="/Horarios"
          element={
            <ProtectedRoute allowedRoles={['user', 'editor', 'admin']}>
              <DataTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Tareas"
          element={
            <ProtectedRoute allowedRoles={['user', 'editor', 'admin']}>
              <TareasComponent />
            </ProtectedRoute>
          }
        />
        <Route
>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6
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
            <ProtectedRoute allowedRoles={['editor', 'admin', 'user']}>
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

        {/* Unauthorized Access */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Catch-All Error Route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;