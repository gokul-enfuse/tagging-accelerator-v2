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
import google from './goggleSignin.png';
import { DOMAIN } from "../Constant";



const SignIn = () => {
  const { setAuth } = useAuth();
  const [isOpen] = useState(true);
  const [isEmailVisible, setIsEmailVisible] = useState(false);

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
      const baseURL = `${DOMAIN}/api/login`

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
  function showEmailField() {
    setIsEmailVisible(true);
  }
  function validateInput() {
    const email = document.getElementById("reset-email").value;
    console.log("input:", email)
    if (email === "") {
      alert("Please fill in the input field.")
    } else {
      axios
        .post(`${DOMAIN}/user/reset`, { email })
        .then(response => {
          console.log("response data :", response.data)
          alert("Please check your Email")

        })
        .catch(error => console.error(error));
    }
  }

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

          {/*<button type="button" className="google-button" style={ {background: "#fafafa"}}>
           <img src= {google} alt="Google Icon" className="google-icon" />
      </button>*/}
          {!isEmailVisible && (

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
          )}

          {formik.touched.username && formik.errors.username ? (
            <div className="error_msg">{formik.errors.user}</div>
          ) : null}

          {!isEmailVisible && (
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
          )}

          {formik.touched.password && formik.errors.password ? (
            <div className="error_msg">{formik.errors.password}</div>
          ) : null}

          {isEmailVisible && (
            <TextField
              name="email"
              type="text"
              placeholder="Enter your Email"
              className="textField"
              id="reset-email"
            // onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
            // value={formik.values.username}
            />
          )}

          <div onClick={() => validateInput()} className="forgot-password" style={{ textAlign: "center" }}>

            <p style={{ marginBottom: 0 }}>Forgot Password? <a href="#" onClick={showEmailField}>Click here</a></p>

          </div>

          <button type="submit">Login</button>

        </form>
        {/* )} */}
      </div>
    </div>
  );
};

export default SignIn;
