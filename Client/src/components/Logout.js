// import React, { useState } from "react";


// const Logout = () => {
//   const { auth, setAuth } = useAuth();

 


  

//   return (

//     <div className="container">
//       <div className={!isSubmitSuccess ? "signin signin_wrapper" : "signin signin_success"} style={{ margin: "100px" }}>
//         {/* <div className="signin signin_wrapper"  style={{margin:"100px"}}> */}

//         {/* {isSubmitSuccess ? (
//           <SubmitForm />
//         ) : ( */}
//           <form onSubmit={formik.handleSubmit}>
//             <TextField
//               name="username"
//               type="text"
//               placeholder="Username"
//               className="textField"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment>
//                     <IconButton>
//                       <PersonIcon />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.username}
//             />

//             {formik.touched.username && formik.errors.username ? (
//               <div className="error_msg">{formik.errors.user}</div>
//             ) : null}

//             <TextField
//               name="password"
//               type="password"
//               placeholder="Password"
//               className="textField"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment>
//                     <IconButton>
//                       <LockIcon />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.password}
//             />
//             {formik.touched.password && formik.errors.password ? (
//               <div className="error_msg">{formik.errors.password}</div>
//             ) : null}

//             <button type="submit">Login</button>

//           </form>
//         {/* )} */}
//       </div>
//     </div>
//   );
// };

// export default Logout;
