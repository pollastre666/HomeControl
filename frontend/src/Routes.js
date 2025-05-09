import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const Home = lazy(() => import("./Containers/Paginas/HomePage"));
const DataTable = lazy(() => import("./Containers/Paginas/Horarios"));
const TareasComponent = lazy(() => import("./Containers/Paginas/Tareas"));
const MapContactSection = lazy(() => import("./Componentes/Ubicacion"));
const Nosotros = lazy(() => import("./Containers/Paginas/Nosotros"));
const AdminDashboard = lazy(() => import("./Componentes/Dashboard/AdminDashboard"));
const EditorContent = lazy(() => import("./Componentes/Autenticacion/EditorContent"));
const UserProfile = lazy(() => import("./Componentes/Autenticacion/UserProfile"));
const Unauthorized = lazy(() => import("./Componentes/Autenticacion/Unauthorized"));
const ProtectedRoute = lazy(() => import("./ProtectedRoutes"));
const ErrorPage = lazy(() => import("./Containers/Errores/Error404"));
const Asistencia = lazy(() => import("./Containers/Paginas/Asistencia"));
const Contacto = lazy(() => import("./Componentes/Asistencia/Contacto"));
const LoginForm = lazy(() => import("./Componentes/Autenticacion/LoginForm"));
const MasInformacion = lazy(() => import("./Componentes/Home/masInformacion"));
const RepairContactForm = lazy(() => import("./Componentes/Asistencia/Componentes/ComponentesSoporte/RepairContactForm"));
const BudgetContactForm = lazy(() => import("./Componentes/Asistencia/Componentes/ComponentesSoporte/BudgetContactForm"));
const StoreLocatorContactForm = lazy(() => import("./Componentes/Asistencia/Componentes/ComponentesSoporte/StoreLocatorContactForm"));
const CustomerServiceContactForm = lazy(() => import("./Componentes/Asistencia/Componentes/ComponentesSoporte/CustomerServiceContactForm"));
const PersianasIndex = lazy(() => import("./Componentes/Productos/Persianas/PeresianasIndex"));
const ComponentDetail = lazy(() => import("./Componentes/Productos/Persianas/ComponentDetail"));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="text-center text-gray-600">Cargando...</div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/Ubicacion" element={<MapContactSection />} />
          <Route path="/Nosotros" element={<Nosotros />} />
          <Route path="/Asistencia" element={<Asistencia />} />
          <Route path="/Contacto" element={<Contacto />} />
          <Route path="/solicitar-reparacion" element={<RepairContactForm />} />
          <Route path="/solicitar-presupuesto" element={<BudgetContactForm />} />
          <Route path="/buscar-punto-venta" element={<StoreLocatorContactForm />} />
          <Route path="/contacto-atencion-cliente" element={<CustomerServiceContactForm />} />
          <Route path="/Mas-Informacion" element={<MasInformacion />} />
          <Route path="/Persianas" element={<PersianasIndex />} />
          <Route path="/components/:componentId" element={<ComponentDetail />} />
          <Route
            path="/Horarios"
            element={
              <ProtectedRoute allowedRoles={["user", "editor", "admin"]}>
                <DataTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Tareas"
            element={
              <ProtectedRoute allowedRoles={["user", "editor", "admin"]}>
                <TareasComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/content"
            element={
              <ProtectedRoute allowedRoles={["editor", "admin", "user"]}>
                <EditorContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute allowedRoles={["user", "editor", "admin"]}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user", "editor", "admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;