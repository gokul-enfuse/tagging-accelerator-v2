import React, { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, InputAdornment, IconButton } from "@mui/material";
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

    const formik = useFormik({
        initialValues: {
          newpassword: "",
          confirmpassword: "",
          username: pemail,
          pid: pid
        },
        validationSchema: Yup.object({
            newpassword: Yup.string().min(5).required("New Password is required"),
            confirmpassword: Yup.string().min(5).required("Confirm Password is required"),
        }),
        onSubmit: (values) => { 
            let baseURL = `${DOMAIN}/api/resetpassword`;

            axios.post(baseURL, values).then((response) => { 
                if(response.status === 200) {
                    navigate("/");
                }
            });
        }
    });

return (

    <div className="container">
        <div className={"signin signin_wrapper"} style={{ margin: "100px" }}>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                name="username"
                type="text"
                placeholder="Username"
                className="textField"
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <IconButton>
                        <PersonIcon />
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
                disabled="disabled"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={pemail}
                />
                <TextField
                    name="newpassword"
                    type="password"
                    placeholder="Enter new password"
                    className="textField"
                    id="newpassword"
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <IconButton>
                            <LockIcon />
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newpassword}
                />
                <TextField
                    name="confirmpassword"
                    type="password"
                    placeholder="Enter confirm password"
                    className="textField"
                    id="confirmpassword"
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <IconButton>
                            <LockIcon />
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmpassword}
                />

                <button type="submit">Reset Password</button>

            </form>
        </div>
    </div>

)};

export default Forgotpassword;
