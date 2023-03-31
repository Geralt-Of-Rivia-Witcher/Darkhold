import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar.jsx";
import { BACKEND_URL } from "../../constants/index.js";
import EachCredentialContainer from "./EachCredentialContainer";
import FileInfo from "../../components/FileInfo/FileInfo.jsx";

import "./Dashboard.styles.css";

function Dashboard() {
  useEffect(fetchFilesList, []);

  const [fetchedFileList, setFetchedFileList] = useState([]);
  const [showFileInfoModal, setShowFileInfoModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
        setShowFileInfoModal(false);
        toast("File downloaded successfully", { type: "success" });
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error" });
      });
  }

  function uploadFile(file) {
    const toastId = toast.loading("Uploading file...");
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
        toast.update(toastId, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
        });
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error" });
      });
  }

  function shareFile(fileId, username) {
    axios
      .post(
        `${BACKEND_URL}/shareFile`,
        {
          fileId: fileId,
          shareWith: username,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        fetchFilesList();
        setShowFileInfoModal(false);
        document.getElementById("credential-container").style = "none";
        toast(response.data.message, { type: "success" });
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error" });
      });
  }

  function removeAccessFromFile(fileId, userName) {
    axios
      .post(
        `${BACKEND_URL}/removeAccessFromFile`,
        {
          fileId: fileId,
          userName: userName,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        fetchFilesList();
        setShowFileInfoModal(false);
        document.getElementById("credential-container").style = "none";
        toast(response.data.message, { type: "success" });
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error" });
      });
  }

  function deleteFile(fileId) {
    axios
      .delete(`${BACKEND_URL}/deleteFile/${fileId}`, {
        withCredentials: true,
      })
      .then((response) => {
        fetchFilesList();
        setShowFileInfoModal(false);
        document.getElementById("credential-container").style = "none";
        toast(response.data.message, { type: "success" });
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error" });
      });
  }

  return Cookies.get("auth_token") ? (
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
                  setShowFileInfoModal(true);
                  setSelectedFile(eachFile);
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
      {showFileInfoModal ? (
        <FileInfo
          setShowFileInfoModal={setShowFileInfoModal}
          selectedFile={selectedFile}
          shareFile={shareFile}
          removeAccessFromFile={removeAccessFromFile}
          downloadFile={downloadFile}
          deleteFile={deleteFile}
        />
      ) : null}
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default Dashboard;
