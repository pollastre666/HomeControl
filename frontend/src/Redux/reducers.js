import { combineReducers } from "redux";


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


const rootReducer = combineReducers({
    some: someReducer,
});

export default rootReducer;
  