import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './Containers/Paginas/HomePage';  // Asegúrate de que esta importación sea correcta

import { AnimatePresence } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        {/* Error Display */}

        {/* Home Display */}
        <Route path="/" element={<Home />} />  {/* Cambié HomePage por Home aquí */}
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
