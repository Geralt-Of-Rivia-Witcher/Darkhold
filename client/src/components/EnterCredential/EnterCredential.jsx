import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { toast } from "react-toastify";

import { BACKEND_URL } from "../../constants/index.js";

import "./Credential.styles.css";

function AddCredential(props) {
    const [platform, setPlatform] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const handleClick = (event) => {
            if (
                !document
                    .getElementById("add-credential-container")
                    .contains(event.target)
            ) {
                props.setEnterCredentialModal(false);
                document.getElementById("credential-container").style = "none";
            }
        };

        document.addEventListener("mousedown", handleClick, false);
        return () => {
            document.removeEventListener("mousedown", handleClick, false);
        };
    });

    const addCredential = (e) => {
        e.preventDefault();
        axios
            .post(
                `${BACKEND_URL}/add-new-credential`,
                {
                    platform: platform,
                    username: username,
                    email: email,
                    password: password,
                },
                { withCredentials: true }
            )
            .then((success) => {
                toast(success.data.message, { type: "success" });
                props.setEnterCredentialModal(false);
                document.getElementById("credential-container").style = "none";
                props.setFetchedCredentials(success.data.credentials);
            })
            .catch((error) => {
                toast(error.response.data.message, { type: "error" });
            });
    };

    return (
        <>
            <form onSubmit={addCredential} autoComplete="off">
                <div
                    className="add-credential-container"
                    id="add-credential-container"
                >
                    <TextField
                        required
                        className="create-credential-input-field"
                        placeholder="Platform"
                        margin="dense"
                        value={platform}
                        onChange={(event) => {
                            setPlatform(event.target.value);
                        }}
                    />
                    <TextField
                        className="create-credential-input-field"
                        placeholder="Username"
                        margin="dense"
                        value={username}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                    />
                    <TextField
                        className="create-credential-input-field"
                        placeholder="Email"
                        margin="dense"
                        type="email"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <TextField
                        className="create-credential-input-field"
                        placeholder="Password"
                        margin="dense"
                        type="password"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <Button
                        variant="contained"
                        className="add-credential-button"
                        type="submit"
                    >
                        <p className="register-button-text">Add Credential</p>
                    </Button>
                </div>
            </form>
            <div className="spacer"></div>
        </>
    );
}

export default AddCredential;
