import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { BACKEND_URL } from "../../constants/index.js";
import { logoutAction } from "../../redux/Authentication/authenticationAction.js";

import "./Navbar.styles.css";

function Navbar() {
    const dispatch = useDispatch();
    var username, isLoggedIn;

    useSelector((state) => {
        username = state.authenticationReducer.username;
        isLoggedIn = state.authenticationReducer.isLoggedIn;
    });

    const [anchorElUser, setAnchorElUser] = useState(null);
    const open = Boolean(anchorElUser);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    function logout() {
        axios
            .post(`${BACKEND_URL}/logout`, { withCredentials: true })
            .then((success) => {
                handleCloseUserMenu();
                toast(success.data.message, { type: "success" });
                dispatch(logoutAction());
                <Navigate to="/" replace />;
            })
            .catch((error) => {
                toast(error.response.data.message, { type: "error" });
            });
    }

    return (
        <AppBar position="fixed" color="secondary">
            <div className="navbar-container">
                <a href="/" style={{ color: "white" }}>
                    <h1 className="navbar-heading">HOLOCRON</h1>
                </a>

                {isLoggedIn ? (
                    <>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu}>
                                <Avatar
                                    alt={username}
                                    src="/static/images/avatar/2.jpg"
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorElUser}
                            open={open}
                            onClose={handleCloseUserMenu}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </AppBar>
    );
}

export default Navbar;
