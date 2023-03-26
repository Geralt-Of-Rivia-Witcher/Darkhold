import { LOG_IN, LOG_OUT } from "./authenticationTypes.js";

export const loginAction = (props) => {
    return {
        type: LOG_IN,
        payload: { username: props.username },
    };
};

export const logoutAction = () => {
    return {
        type: LOG_OUT,
    };
};
