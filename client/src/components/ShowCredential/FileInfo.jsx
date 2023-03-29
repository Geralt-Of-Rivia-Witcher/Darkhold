import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import axios from "axios";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";

import { BACKEND_URL } from "../../constants/index.js";

import "./FileInfo.styles.css";
import "animate.css";

const handleIconClick = async (event, textToCopy) => {
  await navigator.clipboard.writeText(textToCopy);
  toast("Copied", { type: "success" });
  event.target.classList.add("animate__rubberBand");
  setTimeout(() => {
    event.target.classList.remove("animate__rubberBand");
  }, 1100);
};

function ShowCredential(props) {
  const [deleteButtonStatus, setDeleteButtonStatus] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const handleClick = (event) => {
      if (
        !document
          .getElementById("show-credential-container")
          .contains(event.target)
      ) {
        props.setShowFileInfoModal(false);
        document.getElementById("credential-container").style = "none";
      }
    };

    document.addEventListener("mousedown", handleClick, false);
    return () => {
      document.removeEventListener("mousedown", handleClick, false);
    };
  });

  const deleteCredential = (credentialId) => {
    axios
      .delete(
        `${BACKEND_URL}/delete-credentials?credentialId=${credentialId}`,
        {
          withCredentials: true,
        }
      )
      .then((success) => {
        toast(success.data.message, { type: "success" });
        props.setShowCredentialModal(false);
        document.getElementById("credential-container").style = "none";
        props.setFetchedCredentials(success.data.credentials);
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error" });
      });
  };

  return (
    <>
      <div className="show-credential-container" id="show-credential-container">
        <div className="file-details">{props.selectedFile.fileName}</div>
        <div className="file-details">
          Owner
          <p className="file-sub-details">{props.selectedFile.owner}</p>
        </div>
        <div className="file-details">
          Shared with
          {props.selectedFile.sharedWith.map((eachUser, index) => {
            return (
              <p className="file-sub-details" key={index}>
                {eachUser}
              </p>
            );
          })}
        </div>
        <div className="show-credential-input-field-container">
          <TextField
            required
            className="show-credential-input-field"
            placeholder="Enter a username to share this file"
            margin="dense"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                props.shareFile(props.selectedFile._id, username);
              }
            }}
          />
        </div>
        {/* <div className="show-credential-input-field-container">
          <TextField
            required
            className="show-credential-input-field"
            placeholder="Not Available"
            margin="dense"
            value={props.fetchedCredentials.username}
          />
          <ContentCopyIcon
            className="copy-icon animate__animated"
            onClick={(event) => {
              handleIconClick(event, props.fetchedCredentials.username);
            }}
          />
        </div>
        <div className="show-credential-input-field-container">
          <TextField
            required
            className="show-credential-input-field"
            placeholder="Not Available"
            margin="dense"
            type="email"
            value={props.fetchedCredentials.email}
          />
          <ContentCopyIcon
            className="copy-icon animate__animated"
            onClick={(event) => {
              handleIconClick(event, props.fetchedCredentials.email);
            }}
          />
        </div>
        <div className="show-credential-input-field-container">
          <TextField
            required
            className="show-credential-input-field"
            placeholder="Not Available"
            margin="dense"
            type="password"
            value={props.fetchedCredentials.password}
          />
          <ContentCopyIcon
            className="copy-icon animate__animated"
            onClick={(event) => {
              handleIconClick(event, props.fetchedCredentials.password);
            }}
          />
        </div>
        {deleteButtonStatus ? (
          <div style={{ width: "50%" }}>
            <DoneAllIcon
              className="delete-button-yes"
              onClick={() => {
                deleteCredential(props.fetchedCredentials._id);
              }}
            />
            <CancelIcon
              className="delete-button-no"
              onClick={() => {
                setDeleteButtonStatus(false);
              }}
            />
          </div>
        ) : (
          <DeleteForeverIcon
            className="delete-credential-icon"
            onClick={() => {
              setDeleteButtonStatus(true);
            }}
          />
        )} */}
      </div>
      <div className="spacer"></div>
    </>
  );
}

export default ShowCredential;
