import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import logo from './enfuse-logo.png';

const SignIn = () => {
  const { setAuth } = useAuth();
  const [isOpen] = useState(true);


  let navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [isSubmitSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().min(5).required("Password is required"),
    }),

    onSubmit: (values) => {     
      const baseURL = "http://localhost:5000/api/login"

      axios.post(baseURL, values).then((response) => {
        if (response.status === 200) {
          if (response.data.profile_role === 1) {
            navigate("/admin");
          } else if (response.data.profile_role === 3) {
            navigate("/tagger");
          } else if (response.data.profile_role === 4) {
            navigate("/reviewer");
          } else if (response.data.profile_role === 2) {
            navigate("/manager");
          }
        } else {
          console.warn("check the response")
        }
        setAuth(response.data);
      }).catch((error) => {
          alert(error.response.data.message);
        });
      // navigate('/admin', { replace: false });
      navigate(from, { replace: true });
    }
  });

  return (

    <div className="container">

      <div className={!isSubmitSuccess ? "signin signin_wrapper" : "signin signin_success"} style={{ margin: "100px" }}>
        {/* <div className="signin signin_wrapper"  style={{margin:"100px"}}> */}

        {/* {isSubmitSuccess ? (
          <SubmitForm />
        ) : ( */}
        <form onSubmit={formik.handleSubmit}>

          <div className='top-section'>
            <img style={{ width: isOpen ? "130px" : "50px" }} src={logo} alt='logo' />
          </div>
           {/*<h2>Login Form</h2>*/}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />

          {formik.touched.username && formik.errors.username ? (
            <div className="error_msg">{formik.errors.user}</div>
          ) : null}

          <TextField
            name="password"
            type="password"
            placeholder="Password"
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error_msg">{formik.errors.password}</div>
          ) : null}

          <button type="submit">Login</button>

        </form>
        {/* )} */}
      </div>
    </div>
  );
};

export default SignIn;
