import { combineReducers } from "redux"; // Asegúrate de que esta línea sea correcta

const initialState = {
    someData: [],
};

const someReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_DATA":
            return {
                ...state,
                someData: [...state.someData, action.payload],
            };
        default:
            return state;
    }
};

// Combina todos los reducers
const rootReducer = combineReducers({
    some: someReducer, // Aquí puedes agregar otros reducers
});

export default rootReducer;