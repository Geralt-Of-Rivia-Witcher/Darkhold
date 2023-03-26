import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";

import "./Home.styles.css";

function Home() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="home-background-image"></div>
            <div className="home-div">
                <h1 className="home-page-heading">Holocron</h1>
                <div className="home-button-container">
                    <Button
                        variant="contained"
                        className="home-button"
                        onClick={() => {
                            navigate("/login");
                        }}
                    >
                        <p className="register-button-text">Login</p>
                    </Button>
                    <Button
                        variant="contained"
                        className="home-button"
                        onClick={() => {
                            navigate("/signup");
                        }}
                    >
                        <p className="register-button-text">Sign Up</p>
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Home;
