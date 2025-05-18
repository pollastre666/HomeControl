import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Layout from "./hocs/layouts/layout";
import { useAuth } from "./Componentes/Autenticacion/AuthProvider";

console.log('Loaded REACT_APP_STRIPE_PUBLIC_KEY:', process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51ROl5WRCz11UNurnDiqgkjLo3hOmSGZeRrEOvqOBtxK68hw3VolJZaIIvXSfKYBS3quOZ6wM3jOBE5GkqVY8pp0800vZNyTIAF');

const Home = lazy(() => import("./Containers/Paginas/HomePage"));
//const DataTable = lazy(() => import("./Containers/Paginas/Horarios"));
const TareasComponent = lazy(() => import("./Containers/Paginas/Tareas"));
const MapContactSection = lazy(() => import("./Componentes/Ubicacion"));
const Nosotros = lazy(() => import("./Containers/Paginas/Nosotros"));
const AdminDashboard = lazy(() => import("./Componentes/Dashboard/AdminDashboard"));
const EditorDashboard = lazy(() => import("./Componentes/Dashboard/EditorDashboard"));
const UserDashboard = lazy(() => import("./Componentes/Dashboard/UserDashboard"));
const EditorContent = lazy(() => import("./Componentes/Autenticacion/EditorContent"));
const UserProfile = lazy(() => import("./Componentes/Autenticacion/UserProfile"));
const Unauthorized = lazy(() => import("./Componentes/Autenticacion/Unauthorized"));
const ProtectedRoute = lazy(() => import("./ProtectedRoutes"));
const ErrorPage = lazy(() => import("./Containers/Errores/Error404"));
const Asistencia = lazy(() => import("./Containers/Paginas/Asistencia"));
const Contacto = lazy(() => import("./Componentes/Asistencia/Contacto"));
const LoginForm = lazy(() => import("./Componentes/Autenticacion/LoginForm"));
const ForgotPassword = lazy(() => import("./Componentes/Autenticacion/ForgotPassword"));
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
const Productos = lazy(() => import("./Containers/Paginas/Productos"));
;
const DeviceControl = lazy(() => import("./Componentes/IoT/DeviceControl"));
const AddDevice = lazy(() => import("./Componentes/IoT/AddDevice"));
const Schedules = lazy(() => import("./Componentes/IoT/Schedules"));

function AnimatedRoutes() {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  const persianasComponentIds = ['lamasAluminio', 'cajonPVC', 'ejeAcero', 'motorSmart', 'guiasLaterales', 'controlRemoto'];
  const estoresComponentIds = ['tejido', 'tubo', 'motor-estores', 'rieles', 'control-estores', 'contrapeso'];
  const automationHubComponentIds = ['central-unit', 'connectivity-module', 'sensors', 'app-interface', 'voice-control', 'power-supply'];
  const accessControlComponentIds = ['keypad', 'rfid-reader', 'door-lock', 'intercom', 'mobile-access', 'security-panel'];
  const advancedSecurityComponentIds = ['camera', 'alarm-system', 'motion-detector', 'smart-lock', 'control-app', 'notification-system'];
  const smartHomeAutomationComponentIds = ['motorized-shutters', 'smart-lighting', 'climate-control', 'smart-plugs', 'automation-controller', 'scene-scheduler'];

  const allComponentIds = [
    ...persianasComponentIds,
    ...estoresComponentIds,
    ...automationHubComponentIds,
    ...accessControlComponentIds,
    ...advancedSecurityComponentIds,
    ...smartHomeAutomationComponentIds,
  ];

  return (
    <Elements stripe={stripePromise}>
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="text-center text-gray-600 py-8">Cargando...</div>}>
          {isLoading ? (
            <div className="text-center text-gray-600 py-8">Cargando...</div>
          ) : (
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Layout><Home /></Layout>} />

              {/* Resto de rutas públicas */}
              <Route path="/Ubicacion" element={<Layout><MapContactSection /></Layout>} />
              <Route path="/Nosotros" element={<Nosotros />} />
              <Route path="/Asistencia" element={<Layout><Asistencia /></Layout>} />
              <Route path="/Contacto" element={<Layout><Contacto /></Layout>} />
              <Route path="/solicitar-reparacion" element={<Layout><RepairContactForm /></Layout>} />
              <Route path="/solicitar-presupuesto" element={<Layout><BudgetContactForm /></Layout>} />
              <Route path="/buscar-punto-venta" element={<Layout><StoreLocatorContactForm /></Layout>} />
              <Route path="/contacto-atencion-cliente" element={<Layout><CustomerServiceContactForm /></Layout>} />
              <Route path="/Mas-Informacion" element={<Layout><MasInformacion /></Layout>} />
              <Route path="/Productos" element={<Layout><Productos title="Nuestros Productos" description="Descubre todas nuestras soluciones para un hogar inteligente." /></Layout>} />
              <Route path="/Persianas" element={<Layout><PersianasIndex /></Layout>} />
              <Route path="/Estores" element={<Layout><EstoresIndex /></Layout>} />
              <Route path="/estores-components" element={<Layout><EstoresElectricosComponents /></Layout>} />
              <Route path="/automation-hub" element={<Layout><AutomationHubIndex /></Layout>} />
              <Route path="/access-control" element={<Layout><AccessControlIndex /></Layout>} />
              <Route path="/advanced-security" element={<Layout><AdvancedSecurityIndex /></Layout>} />
              <Route path="/smart-home-automation" element={<Layout><SmartHomeAutomationIndex /></Layout>} />
              <Route path="/components/:componentId" element={<Layout><RouteComponentSelector persianasComponentIds={persianasComponentIds} estoresComponentIds={estoresComponentIds} automationHubComponentIds={automationHubComponentIds} accessControlComponentIds={accessControlComponentIds} advancedSecurityComponentIds={advancedSecurityComponentIds} smartHomeAutomationComponentIds={smartHomeAutomationComponentIds} allComponentIds={allComponentIds} /></Layout>} />
              <Route path="/devices/:deviceId/control" element={<Layout><DeviceControl /></Layout>} />
              <Route path="/devices/add" element={<Layout><AddDevice /></Layout>} />
              <Route path="/schedules" element={<Schedules />} />
              {/* Rutas de autenticación */}
              <Route path="/login" element={<Layout><LoginForm /></Layout>} />
              <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
              <Route path="/unauthorized" element={<Layout><Unauthorized /></Layout>} />

              {/* Rutas protegidas */}
              {/*<Route path="/Horarios" element={<ProtectedRoute allowedRoles={["user", "editor", "admin"]}><DataTable /></ProtectedRoute>} />*/}
              {<Route path="/Tareas" element={<ProtectedRoute allowedRoles={["user", "editor", "admin"]}><TareasComponent /></ProtectedRoute>} /> }
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/editor/dashboard" element={<ProtectedRoute allowedRoles={["editor"]}><EditorDashboard /></ProtectedRoute>} />
              <Route path="/editor/content" element={<ProtectedRoute allowedRoles={["editor", "admin"]}><EditorContent /></ProtectedRoute>} />
              <Route path="/user/profile" element={<ProtectedRoute allowedRoles={["user", "editor", "admin"]}><UserProfile /></ProtectedRoute>} />
              <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={["user"]}><UserDashboard /></ProtectedRoute>} />

              {/* Ruta de error */}
              <Route path="*" element={<Layout><ErrorPage /></Layout>} />
            </Routes>
          )}
        </Suspense>
      </AnimatePresence>
    </Elements>
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

  console.log('RouteComponentSelector: Current path:', location.pathname);
  console.log('RouteComponentSelector: Extracted componentId:', componentId);

  if (!allComponentIds.includes(componentId)) {
    console.log('RouteComponentSelector: No match for componentId:', componentId, 'Rendering ErrorPage');
    return <ErrorPage />;
  }

  if (persianasComponentIds.includes(componentId)) {
    console.log('RouteComponentSelector: Rendering ComponentDetail for:', componentId);
    return <ComponentDetail />;
  } else if (estoresComponentIds.includes(componentId)) {
    console.log('RouteComponentSelector: Rendering EstoresComponentDetail for:', componentId);
    return <EstoresComponentDetail />;
  } else if (automationHubComponentIds.includes(componentId)) {
    console.log('RouteComponentSelector: Rendering AutomationHubComponentDetail for:', componentId);
    return <AutomationHubComponentDetail />;
  } else if (accessControlComponentIds.includes(componentId)) {
    console.log('RouteComponentSelector: Rendering AccessControlComponentDetail for:', componentId);
    return <AccessControlComponentDetail />;
  } else if (advancedSecurityComponentIds.includes(componentId)) {
    console.log('RouteComponentSelector: Rendering AdvancedSecurityComponentDetail for:', componentId);
    return <AdvancedSecurityComponentDetail />;
  } else if (smartHomeAutomationComponentIds.includes(componentId)) {
    console.log('RouteComponentSelector: Rendering SmartHomeAutomationComponentDetail for:', componentId);
    return <SmartHomeAutomationComponentDetail />;
  }

  console.log('RouteComponentSelector: Fallback: No match for componentId:', componentId, 'Rendering ErrorPage');
  return <ErrorPage />;
}

export default AnimatedRoutes;