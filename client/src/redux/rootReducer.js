import { combineReducers } from "redux";

import { authenticationReducer } from "./Authentication/authenticationReducer";

const rootReducer = combineReducers({
    authenticationReducer: authenticationReducer,
});

export default rootReducer;
