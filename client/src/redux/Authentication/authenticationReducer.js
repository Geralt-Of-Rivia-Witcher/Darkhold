import { LOG_IN, LOG_OUT } from "./authenticationTypes.js";

const initialState = {
    isLoggedIn: false,
    username: "",
};

export const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOG_IN:
            return {
                ...state,
                isLoggedIn: true,
                username: action.payload.username,
            };

        case LOG_OUT:
            return {
                ...state,
                isLoggedIn: false,
                username: "",
            };

        default:
            return state;
    }
};
