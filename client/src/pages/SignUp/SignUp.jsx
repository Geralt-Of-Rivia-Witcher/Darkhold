import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar.jsx";
import { BACKEND_URL } from "../../constants/index.js";

import "./SignUp.styles.css";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reEnteredPassword, setReEnteredPassword] = useState("");

  const signUp = (e) => {
    const toastId = toast.loading("Please wait...");

    e.preventDefault();
    if (password === reEnteredPassword) {
      axios
        .post(
          `${BACKEND_URL}/signUp`,
          {
            userName: username.trim(),
            password: password.trim(),
          },
          { withCredentials: true }
        )
        .then((success) => {
          localStorage.setItem("username", success.data.data.username);
          toast.update(toastId, {
            render: success.data.message,
            type: "success",
            isLoading: false,
            autoClose: 5000,
            closeOnClick: true,
          });
          navigate("/dashboard");
        })
        .catch((error) => {
          toast.update(toastId, {
            render: error.response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 5000,
            closeOnClick: true,
          });
        });
    } else {
      toast.update(toastId, {
        render: "Passwords must be same.",
        type: "warning",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-background-image"></div>
      <div className="form-container">
        <h1 className="heading">Create Account</h1>
        <form onSubmit={signUp} autoComplete="off">
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
          <TextField
            value={reEnteredPassword}
            required
            className="text-field"
            placeholder="Re-enter your Password"
            type="password"
            margin="dense"
            onChange={(event) => {
              setReEnteredPassword(event.target.value);
            }}
          />
          <br />
          <Button variant="contained" className="submit-button" type="submit">
            <p className="register-button-text">Register</p>
          </Button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
