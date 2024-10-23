import React, { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
// import { TextField, InputAdornment, IconButton } from "@mui/material";
import { TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { useFormik } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import axios from "axios";
import logo from './enfuse-logo.png';
// import google from './goggleSignin.png';
import { DOMAIN } from "../Constant";



const Forgotpassword = () => {
    const { pid, pemail } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
        } else if (password.length < 5 || password.length > 25) {
            setError('Password must be between 5 and 25 characters.');
        } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
            setError('Password must include letters, numbers, and special characters.');
        } else if (/^(password|12345|qwerty|abc123)$/i.test(password)) {
            setError('Weak password. Please choose a stronger password.');
        } else {
            setError('');
            const value = {
                newpassword: password,
                confirmpassword: confirmPassword,
                username: pemail,
                pid: pid
            };

            let baseURL = `${DOMAIN}/api/resetpassword`;
            axios.post(baseURL, value).then((response) => {
                if (response.status === 200) {
                    navigate("/");
                }
            });
        }
    };

    return (
        <div className="container">
            <div className={"signin signin_wrapper"} style={{ margin: "100px" }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TextField
                        label="User Name"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        className="textField"
                        disabled
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton>
                                        <PersonIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        defaultValue={pemail}
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        className="textField"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton>
                                        <LockIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        className="textField"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton>
                                        <LockIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {error && <Typography style={{ fontSize: '12px' }} color="error">{error}</Typography>}
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    )
};

export default Forgotpassword;
