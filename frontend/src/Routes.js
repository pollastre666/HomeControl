import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './Containers/Paginas/HomePage'; 
import LoginForm from './Componentes/Autenticacion/Login';
import { AnimatePresence } from 'framer-motion';
import DataTable from './Containers/Paginas/Horarios';
import MapSection from './Componentes/Ubicacion';
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        {/* Error Display */}

        {/* Home Display */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Horarios" element={<DataTable />} />
        <Route path="/Ubicacion" element={<MapSection />} />

      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
