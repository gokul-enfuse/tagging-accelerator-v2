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
// import google from './goggleSignin.png';
import { DOMAIN } from "../Constant";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { message } from "antd";


const SignIn = () => {
  const { setAuth } = useAuth();
  const [isOpen] = useState(true);
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Login');

  let navigate = useNavigate();
  const location = useLocation();  
  const from = location.state?.from?.pathname || "/";
  const [isSubmitSuccess] = useState(false);
  let currentURL = window.location.href;
  let porturl = new URL(currentURL);
  let appPort = porturl.port;

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: ""
    },
    validationSchema: Yup.object({
      password: (!isEmailVisible)?Yup.string().min(5).required("Password is required"):'',
    }),

    onSubmit: (values) => {     
      let baseURL;
      if(!isEmailVisible) {
        baseURL = `${DOMAIN}/api/login`;

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
            /**
            * Created Date: 22/02/2024 | Vikas Bose
            * START
            */
              axios.post(`${DOMAIN}/storePort`, { port: appPort })
                .then((response) => {
                  // Handle the response if needed
                  console.log("Port stored in the Database:", response.data.message);
                })
                .catch((error) => {
                  console.error("Error storing port in the backend:", error);
                });
            /**
            * END
            */
          } else {
            console.warn("check the response")
          }
          setAuth(response.data);
        }).catch((error) => {
          showAlert(error.response.data.message);
        });
      // navigate('/admin', { replace: false });
        navigate(from, { replace: true });
      } else {
        if (values.email){

          baseURL = `${DOMAIN}/api/forgotpassword/${values.email}`;
          axios.get(baseURL).then(response => {
             if (response.status === 200) {
                 showAlert("Password has been sent to your email id.");
             } else {
                 console.warn("check the response")
             }
          }).catch(error => {
            showAlert(error.response.data.message);
          });
          navigate('/', { replace: true });

        }
        else{
          showAlert("please enter your email");
        }
      } 
    }
  });
  function showEmailField() {
    setButtonTitle('Submit');
    setIsEmailVisible(true);
    validateInput();
  }
  function validateInput() {
    // const email = document.getElementById("reset-email").value;
    const email = formik.values.email;
    if (email === "") {
      showAlert("error","Please fill in the input field.",)
    } else {
      axios
        .post(`${DOMAIN}/user/reset`, { email })
        .then(response => {
          // showAlert("Please check your Email")
          showAlert("error", "Please check your Email");

        })
        .catch(error => console.error(error));
    }
  }
  const showAlert = (iconType,title, messageText) => {
    Swal.fire({
      // title: '',
      // text: 'Success',
      // icon: message,
      // confirmButtonText: 'OK',

      title: title,
      text: messageText,
      icon: iconType,
      confirmButtonText: "Ok",
    });
  };
  return (

    <div className="container">

      <div className={!isSubmitSuccess ? "signin signin_wrapper" : "signin signin_success"} style={{ margin: "100px" }}>
        {/* <div className="signin signin_wrapper"  style={{margin:"100px"}}> */}

        {/* {isSubmitSuccess ? (
          <SubmitForm />
        ) : ( */}
        <form >

          <div className='top-section'>
            <img style={{ width: isOpen ? "130px" : "50px" }} src={logo} alt='logo' />
          </div>
          {/*<h2>Login Form</h2>*/}

          {/*<button type="button" className="google-button" style={ {background: "#fafafa"}}>
           <img src= {google} alt="Google Icon" className="google-icon" />
      </button>*/}
         {/* Login page starts here*/}
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
         {/* Forgotpassword view starts here*/}
          {isEmailVisible && (
            <TextField
              name="email"
              type="text"
              placeholder="Enter your Email"
              className="textField"
              id="reset-email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
             value={formik.values.email}
            />
          )}

          <div className="forgot-password" style={{ textAlign: "center" }}>
            {!isEmailVisible && (
            <p style={{ marginBottom: 0 }}>Forgot Password? <a href="#" onClick={showEmailField}>Click here</a></p>)}
            <input type="hidden" name="hidForgotPassword" id="hidForgotPassword" value={isEmailVisible} />
          </div>

          <button type="submit" onClick={formik.handleSubmit}>{buttonTitle}</button>

        </form>
        {/* )} */}
      </div>
    </div>
  );
};

export default SignIn;
