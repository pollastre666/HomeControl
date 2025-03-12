import { createStore, applyMiddleware } from "redux";
import { thunk } from 'redux-thunk';

import rootReducer from "./Redux/reducers"; // Asegúrate de que la ruta sea correcta
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {};
const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;