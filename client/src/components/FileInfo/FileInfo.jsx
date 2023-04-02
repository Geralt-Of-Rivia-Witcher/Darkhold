import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import "./FileInfo.styles.css";
import "animate.css";

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
        {localStorage.getItem("username") === props.selectedFile.owner ? (
          <>
            {props.selectedFile.sharedWith.length > 0 ? (
              <div className="file-details">
                Shared with
                {props.selectedFile.sharedWith.map((eachUser, index) => {
                  return (
                    <table style={{ width: "100%" }} key={index}>
                      <tbody>
                        <tr>
                          <td style={{ width: "80%" }}>
                            <p className="file-sub-details">{eachUser}</p>
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
                      </tbody>
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

        {localStorage.getItem("username") === props.selectedFile.owner ? (
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
      </div>
      <div className="spacer"></div>
    </>
  );
}

export default ShowCredential;
