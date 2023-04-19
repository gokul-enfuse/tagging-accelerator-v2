// // import React from "react";
// // import { Route, Navigate } from "react-router-dom";

// // const ProtectedRoute = ({auth, component: Component, ...rest}) => {

// //     return(

// //         <Route{... rest} render={(props) => {
// //             if (auth) return <component{...props}/>
// //             if(!auth) return <Navigate to={{path: "/", state: {from: props.location}}}
// //         />
// //         }} />
// //     );
// // };




// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';

// const ProtectedRoute = ({ component: Component, ...rest }) => (
//     <Route {...rest} render={(props) => (
//         localStorage.getItem('user')
//             ? <Component {...props} />
//             : <Redirect to='/login' />
//     )} />
// );

// export default ProtectedRoute;

 