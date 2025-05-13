<<<<<<< HEAD
import { createStore, applyMiddleware } from "redux";
import { thunk } from 'redux-thunk';

import rootReducer from "./Redux/reducers"; // Asegúrate de que la ruta sea correcta
import { composeWithDevTools } from "redux-devtools-extension";
=======
import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk'; // Use named import
import rootReducer from './Redux/reducers'; // Keep existing path
>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6

const initialState = {};
const middleware = [thunk];

<<<<<<< HEAD
const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
=======
// Safely access composeWithDevTools
const composeEnhancers =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6
);

export default store;