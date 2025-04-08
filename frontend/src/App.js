import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import store from './Store';
import { AuthProvider } from './Componentes/Autenticacion/AuthContext' // Ajustado
import AnimatedRoutes from './Routes';

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <AuthProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </AuthProvider>
      </Provider>
    </HelmetProvider>
  );
}

export default App;