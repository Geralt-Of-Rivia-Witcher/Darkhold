import React, { useEffect } from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar.jsx";
import { BACKEND_URL } from "../../constants/index.js";

import "./Login.styles.css";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkTokenStatus();
  }, []);

  const checkTokenStatus = () => {
    axios
      .get(`${BACKEND_URL}/verify`, {
        withCredentials: true,
      })
      .then((success) => {
        navigate("/dashboard");
      });
  };

  const login = (e) => {
    e.preventDefault();
    axios
      .post(
        `${BACKEND_URL}/signIn`,
        {
          userName: username.trim(),
          password: password.trim(),
        },
        { withCredentials: true }
      )
      .then((success) => {
        localStorage.setItem("username", success.data.data.username);
        toast(success.data.message, { type: "success" });
        navigate("/dashboard");
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
          <Button variant="contained" className="submit-button" type="submit">
            <p className="register-button-text">Login</p>
          </Button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
