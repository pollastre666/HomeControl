import { BrowserRouter as Router } from 'react-router-dom';

import store from './Store';  // Si el archivo es Store.js, usa 'Store'

import { Provider } from 'react-redux';
import AnimatedRoutes from './Routes';  // Asegúrate de que el nombre del archivo y la ruta sean correctos

function App() {
  return (

      <Provider store={store}>
        <Router>
       <AnimatedRoutes /> 
        </Router>
      </Provider>

  );
}

export default App;