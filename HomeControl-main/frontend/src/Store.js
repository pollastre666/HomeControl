import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'; // Use named import
import rootReducer from './Redux/reducers'; // Keep existing path

const initialState = {};
const middleware = [thunk];

// Safely access composeWithDevTools
const composeEnhancers =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;