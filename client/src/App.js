import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/LogIn/LogIn";
import Credential from "./pages/Credential/Credential";

import theme from "./styles/theme.js";

import "./App.styles.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/signUp" element={<SignUp />} />
                        <Route exact path="/login" element={<Login />} />
                        <Route
                            exact
                            path="/credential"
                            element={<Credential />}
                        />
                    </Routes>
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
