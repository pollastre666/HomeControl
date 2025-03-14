import { BrowserRouter as Router } from 'react-router-dom';

import store from './Store';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { Provider } from 'react-redux';
import AnimatedRoutes from './Routes';  

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <Router>
       <AnimatedRoutes /> 
        </Router>
      </Provider>
      </HelmetProvider>
  );
}

export default App;