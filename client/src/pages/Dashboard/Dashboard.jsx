import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";

import Navbar from "../../components/Navbar/Navbar.jsx";
import { BACKEND_URL } from "../../constants/index.js";
import EachCredentialContainer from "./EachCredentialContainer";
import ShowCredential from "../../components/ShowCredential/ShowCredential.jsx";

import "./Dashboard.styles.css";

function Dashboard() {
  useEffect(fetchFilesList, []);

  const [fetchedFileList, setFetchedFileList] = useState([]);
  const [showCredentialModal, setShowCredentialModal] = useState(false);

  function fetchFilesList() {
    axios
      .get(`${BACKEND_URL}/getFileList`, { withCredentials: true })
      .then((response) => {
        setFetchedFileList(response.data.files);
      })
      .catch((error) => {});
  }

  function downloadFile(file) {
    axios
      .get(`${BACKEND_URL}/downloadFile/${file._id}`, {
        withCredentials: true,
        responseType: "blob",
      })
      .then(({ data }) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", file.fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        document.getElementById("credential-container").style = "none";
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${BACKEND_URL}/uploadFile`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        fetchFilesList();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // return state.authenticationReducer.isLoggedIn ? (
  return document.cookie.length > 12 ? (
    <>
      <Navbar />
      <div className="credential-container" id="credential-container">
        <Grid container>
          <div className="credential-background-image"></div>
          {fetchedFileList?.map((eachFile, index) => {
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
                  document.getElementById("credential-container").style =
                    "filter:blur(100px); pointer-events: none";
                  // setShowCredentialModal(true);
                  downloadFile(eachFile);
                }}
              >
                <EachCredentialContainer fileName={eachFile.fileName} />
              </Grid>
            );
          })}
          <input
            type="file"
            id="fileUpload"
            style={{ display: "none" }}
            onChange={(event) => {
              uploadFile(event.target.files[0]);
            }}
          />
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
                document.getElementById("fileUpload").click();
              }}
            >
              <h3 className="each-credential-platfrom">Click to Upload</h3>
            </div>
          </Grid>
        </Grid>
      </div>
      {/* {showCredentialModal ? (
          <ShowCredential
            fetchedCredentials={fetchedCredentials[clickedIndex]}
            setShowCredentialModal={setShowCredentialModal}
            setFetchedCredentials={setFetchedCredentials}
          />
        ) : null} */}
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default Dashboard;
