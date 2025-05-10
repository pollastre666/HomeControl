import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./hocs/layouts/layout"; // Adjust path based on your structure

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
const EstoresIndex = lazy(() => import("./Componentes/Productos/Estores/EstoresIndex"));
const EstoresElectricosComponents = lazy(() => import("./Componentes/Productos/Estores/EstoresElectricosComponents"));
const EstoresComponentDetail = lazy(() => import("./Componentes/Productos/Estores/EstoresComponentDetail"));
const AutomationHubIndex = lazy(() => import("./Componentes/Productos/Automatizacion/AutomationHubIndex"));
const AutomationHubComponentDetail = lazy(() => import("./Componentes/Productos/Automatizacion/AutomationHubComponentDetail"));
const AccessControlIndex = lazy(() => import("./Componentes/Productos/ControlDeAcceso/AccessControlIndex"));
const AccessControlComponentDetail = lazy(() => import("./Componentes/Productos/ControlDeAcceso/AccessControlComponentDetail"));
const AdvancedSecurityIndex = lazy(() => import("./Componentes/Productos/SeguridadAvanzada/AdvancedSecurityIndex"));
const AdvancedSecurityComponentDetail = lazy(() => import("./Componentes/Productos/SeguridadAvanzada/AdvancedSecurityComponentDetail"));
const SmartHomeAutomationIndex = lazy(() => import("./Componentes/Productos/SmartHomeAutomatismos/SmartHomeAutomationIndex"));
const SmartHomeAutomationComponentDetail = lazy(() => import("./Componentes/Productos/SmartHomeAutomatismos/SmartHomeAutomationComponentDetail"));

function AnimatedRoutes() {
  const location = useLocation();

  // Define component IDs for all categories
  const persianasComponentIds = ['lamas', 'cajon', 'eje', 'motor', 'guias', 'control'];
  const estoresComponentIds = ['tejido', 'tubo', 'motor-estores', 'rieles', 'control-estores', 'contrapeso'];
  const automationHubComponentIds = ['central-unit', 'connectivity-module', 'sensors', 'app-interface', 'voice-control', 'power-supply'];
  const accessControlComponentIds = ['keypad', 'rfid-reader', 'door-lock', 'intercom', 'mobile-access', 'security-panel'];
  const advancedSecurityComponentIds = ['camera', 'alarm-system', 'motion-detector', 'smart-lock', 'control-app', 'notification-system'];
  const smartHomeAutomationComponentIds = ['motorized-shutters', 'smart-lighting', 'climate-control', 'smart-plugs', 'automation-controller', 'scene-scheduler'];

  // Combine all component IDs for validation
  const allComponentIds = [
    ...persianasComponentIds,
    ...estoresComponentIds,
    ...automationHubComponentIds,
    ...accessControlComponentIds,
    ...advancedSecurityComponentIds,
    ...smartHomeAutomationComponentIds,
  ];

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="text-center text-gray-600">Cargando...</div>}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Layout>
                <Home /> {/* Ensure Home does not include a footer */}
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <LoginForm />
              </Layout>
            }
          />
          <Route
            path="/Ubicacion"
            element={
              <Layout>
                <MapContactSection />
              </Layout>
            }
          />
          <Route
            path="/Nosotros"
            element={
              <Layout>
                <Nosotros />
              </Layout>
            }
          />
          <Route
            path="/Asistencia"
            element={
              <Layout>
                <Asistencia />
              </Layout>
            }
          />
          <Route
            path="/Contacto"
            element={
              <Layout>
                <Contacto />
              </Layout>
            }
          />
          <Route
            path="/solicitar-reparacion"
            element={
              <Layout>
                <RepairContactForm />
              </Layout>
            }
          />
          <Route
            path="/solicitar-presupuesto"
            element={
              <Layout>
                <BudgetContactForm />
              </Layout>
            }
          />
          <Route
            path="/buscar-punto-venta"
            element={
              <Layout>
                <StoreLocatorContactForm />
              </Layout>
            }
          />
          <Route
            path="/contacto-atencion-cliente"
            element={
              <Layout>
                <CustomerServiceContactForm />
              </Layout>
            }
          />
          <Route
            path="/Mas-Informacion"
            element={
              <Layout>
                <MasInformacion />
              </Layout>
            }
          />
          <Route
            path="/Persianas"
            element={
              <Layout>
                <PersianasIndex />
              </Layout>
            }
          />
          <Route
            path="/Estores"
            element={
              <Layout>
                <EstoresIndex />
              </Layout>
            }
          />
          <Route
            path="/estores-components"
            element={
              <Layout>
                <EstoresElectricosComponents />
              </Layout>
            }
          />
          <Route
            path="/automation-hub"
            element={
              <Layout>
                <AutomationHubIndex />
              </Layout>
            }
          />
          <Route
            path="/access-control"
            element={
              <Layout>
                <AccessControlIndex />
              </Layout>
            }
          />
          <Route
            path="/advanced-security"
            element={
              <Layout>
                <AdvancedSecurityIndex />
              </Layout>
            }
          />
          <Route
            path="/smart-home-automation"
            element={
              <Layout>
                <SmartHomeAutomationIndex />
              </Layout>
            }
          />
          <Route
            path="/components/:componentId"
            element={
              <Layout>
                <RouteComponentSelector
                  persianasComponentIds={persianasComponentIds}
                  estoresComponentIds={estoresComponentIds}
                  automationHubComponentIds={automationHubComponentIds}
                  accessControlComponentIds={accessControlComponentIds}
                  advancedSecurityComponentIds={advancedSecurityComponentIds}
                  smartHomeAutomationComponentIds={smartHomeAutomationComponentIds}
                  allComponentIds={allComponentIds}
                />
              </Layout>
            }
          />
          <Route
            path="/Horarios"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["user", "editor", "admin"]}>
                  <DataTable />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/Tareas"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["user", "editor", "admin"]}>
                  <TareasComponent />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/editor/content"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["editor", "admin", "user"]}>
                  <EditorContent />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/user/profile"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["user", "editor", "admin"]}>
                  <UserProfile />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["user", "editor", "admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <Layout>
                <Unauthorized />
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <ErrorPage />
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function RouteComponentSelector({
  persianasComponentIds,
  estoresComponentIds,
  automationHubComponentIds,
  accessControlComponentIds,
  advancedSecurityComponentIds,
  smartHomeAutomationComponentIds,
  allComponentIds,
}) {
  const location = useLocation();
  const componentId = location.pathname.split('/').filter(Boolean).pop();

  console.log('Current path:', location.pathname);
  console.log('Extracted componentId:', componentId);

  if (!allComponentIds.includes(componentId)) {
    console.log('No match for componentId:', componentId, 'Rendering ErrorPage');
    return <ErrorPage />;
  }

  if (persianasComponentIds.includes(componentId)) {
    console.log('Rendering ComponentDetail for:', componentId);
    return <ComponentDetail />;
  } else if (estoresComponentIds.includes(componentId)) {
    console.log('Rendering EstoresComponentDetail for:', componentId);
    return <EstoresComponentDetail />;
  } else if (automationHubComponentIds.includes(componentId)) {
    console.log('Rendering AutomationHubComponentDetail for:', componentId);
    return <AutomationHubComponentDetail />;
  } else if (accessControlComponentIds.includes(componentId)) {
    console.log('Rendering AccessControlComponentDetail for:', componentId);
    return <AccessControlComponentDetail />;
  } else if (advancedSecurityComponentIds.includes(componentId)) {
    console.log('Rendering AdvancedSecurityComponentDetail for:', componentId);
    return <AdvancedSecurityComponentDetail />;
  } else if (smartHomeAutomationComponentIds.includes(componentId)) {
    console.log('Rendering SmartHomeAutomationComponentDetail for:', componentId);
    return <SmartHomeAutomationComponentDetail />;
  }

  console.log('Fallback: No match for componentId:', componentId, 'Rendering ErrorPage');
  return <ErrorPage />;
}

export default AnimatedRoutes;