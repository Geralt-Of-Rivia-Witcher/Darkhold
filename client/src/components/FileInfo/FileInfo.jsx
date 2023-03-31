import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

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

  return (
    <>
      <div className="show-credential-container" id="show-credential-container">
        <div className="file-details">{props.selectedFile.fileName}</div>
        <div className="file-details">
          Owner
          <p className="file-sub-details">{props.selectedFile.owner}</p>
        </div>
        {Cookies.get("username") === props.selectedFile.owner ? (
          <>
            {props.selectedFile.sharedWith.length > 0 ? (
              <div className="file-details">
                Shared with
                {props.selectedFile.sharedWith.map((eachUser, index) => {
                  return (
                    <table style={{ width: "100%" }}>
                      <tr>
                        <td style={{ width: "80%" }}>
                          <p className="file-sub-details" key={index}>
                            {eachUser}
                          </p>
                        </td>
                        <td>
                          <RemoveCircleOutlineOutlinedIcon
                            className="remove-icon"
                            onClick={(event) => {
                              props.removeAccessFromFile(
                                props.selectedFile._id,
                                eachUser
                              );
                            }}
                          />
                        </td>
                      </tr>
                    </table>
                  );
                })}
              </div>
            ) : (
              <></>
            )}

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
          </>
        ) : (
          <></>
        )}

        {Cookies.get("username") === props.selectedFile.owner ? (
          <div style={{ width: "50%", position: "absolute", bottom: "50px" }}>
            {deleteButtonStatus ? (
              <>
                <DoneAllIcon
                  className="delete-button-yes"
                  onClick={() => {
                    props.deleteFile(props.selectedFile._id);
                  }}
                />
                <CancelIcon
                  className="delete-button-no"
                  onClick={() => {
                    setDeleteButtonStatus(false);
                  }}
                />
              </>
            ) : (
              <>
                <DownloadOutlinedIcon
                  className="download-file-icon"
                  onClick={() => {
                    props.downloadFile(props.selectedFile);
                  }}
                />
                <DeleteForeverIcon
                  className="delete-file-icon"
                  onClick={() => {
                    setDeleteButtonStatus(true);
                  }}
                />
              </>
            )}
          </div>
        ) : (
          <div
            style={{
              width: "50%",
              position: "absolute",
              bottom: "50px",
              textAlign: "center",
            }}
          >
            <DownloadOutlinedIcon
              className="download-file-icon"
              onClick={() => {
                props.downloadFile(props.selectedFile);
              }}
            />
          </div>
        )}

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