import React, { useEffect } from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar.jsx";
import { BACKEND_URL } from "../../constants/index.js";
import { loginAction } from "../../redux/Authentication/authenticationAction.js";

import "./Login.styles.css";

function SignUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/check-logged-in`, { withCredentials: true })
            .then((success) => {
                dispatch(loginAction({ username: success.data.username }));
                navigate("/credential");
            })
            .catch((error) => {});
    }, []);

    const login = (e) => {
        e.preventDefault();
        axios
            .post(
                `${BACKEND_URL}/login`,
                {
                    username: username.trim(),
                    password: password.trim(),
                },
                { withCredentials: true }
            )
            .then((success) => {
                toast(success.data.message, { type: "success" });
                dispatch(loginAction({ username: success.data.username }));
                navigate("/credential");
            })
            .catch((error) => {
                toast(error.response.data.message, { type: "error" });
            });
    };

    return (
        <>
            <Navbar />
            <div className="login-background-image"></div>
            <div className="form-container">
                <h1 className="heading">Login</h1>
                <form onSubmit={login} autoComplete="off">
                    <TextField
                        value={username}
                        required
                        className="text-field"
                        placeholder="Enter your Username"
                        margin="dense"
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                    />
                    <br />
                    <TextField
                        value={password}
                        required
                        className="text-field"
                        placeholder="Enter your Password"
                        type="password"
                        margin="dense"
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <br />
                    <Button
                        variant="contained"
                        className="submit-button"
                        type="submit"
                    >
                        <p className="register-button-text">Login</p>
                    </Button>
                </form>
            </div>
        </>
    );
}

export default SignUp;
