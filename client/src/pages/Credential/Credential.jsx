import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";

import Navbar from "../../components/Navbar/Navbar.jsx";
import { BACKEND_URL } from "../../constants/index.js";
import EachCredentialContainer from "./EachCredentialContainer";
import EnterCredential from "../../components/EnterCredential/EnterCredential.jsx";
import ShowCredential from "../../components/ShowCredential/ShowCredential.jsx";

import "./Credential.styles.css";

function Credential() {
    useEffect(fetchCredentials, []);

    const [fetchedCredentials, setFetchedCredentials] = useState([]);
    const [enterCredentialModal, setEnterCredentialModal] = useState(false);
    const [showCredentialModal, setShowCredentialModal] = useState(false);
    const [clickedIndex, setClickedIndex] = useState(0);

    function fetchCredentials() {
        axios
            .get(`${BACKEND_URL}/fetch-credentials`, { withCredentials: true })
            .then((success) => {
                setFetchedCredentials(success.data.data);
            })
            .catch((error) => {});
    }

    return useSelector((state) => {
        return state.authenticationReducer.isLoggedIn ? (
            <>
                <Navbar />
                <div className="credential-container" id="credential-container">
                    <Grid container>
                        <div className="credential-background-image"></div>
                        {fetchedCredentials?.map((eachCredential, index) => {
                            return (
                                <Grid
                                    item
                                    xl={2}
                                    lg={3}
                                    md={3}
                                    sm={4}
                                    xs={6}
                                    className="credential-grid"
                                    key={index}
                                    onClick={(event) => {
                                        document.getElementById(
                                            "credential-container"
                                        ).style =
                                            "filter:blur(100px); pointer-events: none";
                                        setClickedIndex(index);
                                        setShowCredentialModal(true);
                                    }}
                                >
                                    <EachCredentialContainer
                                        platform={eachCredential.platform}
                                    />
                                </Grid>
                            );
                        })}
                        <Grid
                            item
                            xl={2}
                            lg={3}
                            md={3}
                            sm={4}
                            xs={6}
                            className="credential-grid"
                        >
                            <div
                                className="each-credential-container add-new-credential"
                                onClick={() => {
                                    document.getElementById(
                                        "credential-container"
                                    ).style =
                                        "filter:blur(100px); pointer-events: none;";
                                    setEnterCredentialModal(true);
                                }}
                            >
                                <h3 className="each-credential-platfrom">
                                    Click to Add
                                </h3>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                {enterCredentialModal ? (
                    <EnterCredential
                        className="enter-credential-modal"
                        setEnterCredentialModal={setEnterCredentialModal}
                        setFetchedCredentials={setFetchedCredentials}
                    />
                ) : null}
                {showCredentialModal ? (
                    <ShowCredential
                        fetchedCredentials={fetchedCredentials[clickedIndex]}
                        setShowCredentialModal={setShowCredentialModal}
                        setFetchedCredentials={setFetchedCredentials}
                    />
                ) : null}
            </>
        ) : (
            <Navigate to="/login" />
        );
    });
}

export default Credential;
