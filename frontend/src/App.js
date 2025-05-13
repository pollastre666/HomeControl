import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import store from './Store';
import { AuthProvider } from './Componentes/Autenticacion/AuthProvider';
import AnimatedRoutes from './Routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <AnimatedRoutes />
            <ToastContainer />
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  );
}

export default App;