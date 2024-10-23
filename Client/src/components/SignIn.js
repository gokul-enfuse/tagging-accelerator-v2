import React, { useState, useEffect } from "react";
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


const SignIn = () => {
  const { auth, setAuth } = useAuth();
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
  const [isFormVisible, setIsFormVisible] = useState(true);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
      setIsFormVisible(false);
      navigate('/admin');
    } else {
      setIsFormVisible(true);
    }
  }, [auth, setAuth]);

  const showAlert = (messageText, iconType="info") => {
    Swal.fire({
      title: "",
      text: messageText,
      icon: iconType,
      confirmButtonText: "Ok",
    });
  };
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const handleEmailChange = e => {
    setEmail(e.target.value);
    if (e.target.validity.valid) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: ""
    },
    validationSchema: Yup.object({
      username: (!isEmailVisible)?Yup.string().min(5).required("Username is required"):'',
      password: (!isEmailVisible)?Yup.string().min(5).required("Password is required"):'',
    }),

    onSubmit: (values) => {     
      let baseURL;
      if(!isEmailVisible) {
        baseURL = `${DOMAIN}/api/login`;

        axios.post(baseURL, values,{ withCredentials: true }).then((response) => {
          if (response.status === 200) {
            setAuth(response.data);
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
          showAlert(error.response.data.message, "error");
        });
      // navigate('/admin', { replace: false });
        setIsFormVisible(false);
        navigate(from, { replace: true });
      } else {
        if (email){

          baseURL = `${DOMAIN}/api/forgotpassword/${email}`;
          axios.get(baseURL).then(response => {
             if (response.status === 200) {
                 showAlert("Password has been sent to your email id.", "success");
             } else {
                 console.warn("check the response")
             }
          }).catch(error => {
            showAlert(error.response.data.message, "error");
          });
          navigate('/', { replace: true });

        } else{
          showAlert("please enter your email", "error");
        }
      } 
    }
  });
  function showEmailField() {
    setButtonTitle('Submit');
    setIsEmailVisible(true);
    //validateInput();
  }

  function showLoginField() {
    setButtonTitle('Submit');
    setIsEmailVisible(false);
    //validateInput();
  }
  function validateInput() {
    // const email = document.getElementById("reset-email").value;
    const email = formik.values.email;
    if (email === "") {
      showAlert("Please fill in the input field.", "error")
    } else {
      axios
        .post(`${DOMAIN}/user/reset`, { email })
        .then(response => {
          // showAlert("Please check your Email")
          showAlert("Please check your Email", "error");

        })
        .catch(error => console.error(error));
    }
  }
  
  return (

    <div className="container">

      <div className={!isSubmitSuccess ? "signin signin_wrapper" : "signin signin_success"} style={{ margin: "100px", display: isFormVisible ? 'block' : 'none' }}>
        {/* <div className="signin signin_wrapper"  style={{margin:"100px"}}> */}

        {/* {isSubmitSuccess ? (
          <SubmitForm />
        ) : ( */}

        {isFormVisible && (
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
            <div className="error_msg">{formik.errors.username}</div>
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
             onChange={handleEmailChange}
             value={email}
             error={emailError}
             helperText={
              emailError ? "Please enter your email (abc@gmail.com)" : ""
            }
            inputProps={{
               type: "email",
            }}
             required label="Email"
            />
          )}

         {!isEmailVisible && (
          <div className="forgot-password" style={{ textAlign: "center" }}>            
            <p style={{ marginBottom: 0 }}>Forgot Password? <a href="#" onClick={showEmailField}>Click here</a></p>
            <input type="hidden" name="hidForgotPassword" id="hidForgotPassword" value={isEmailVisible} />
          </div> )}

          {isEmailVisible && (
          <div className="forgot-password" style={{ textAlign: "center" }}>            
            <p style={{ marginBottom: 0 }}>Go Back to Login? <a href="#" onClick={showLoginField}>Click here</a></p>
            <input type="hidden" name="hidForgotPassword" id="hidForgotPassword" value={!isEmailVisible} />
          </div> )}

          <button className="Btn" type="submit" onClick={formik.handleSubmit}>{buttonTitle}</button>

        </form>

        )}



        {/* )} */}
      </div>
    </div>
  );
};

export default SignIn;
