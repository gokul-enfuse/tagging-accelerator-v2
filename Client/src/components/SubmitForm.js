import React from 'react'
import { Fade } from 'react-awesome-reveal';
import logo from './enfuse-logo.png';


const SubmitForm = () => {
    const myStyle = {
        top:"50%",
        left:"50%",
        position:"absolute",
        transform:"translate(-50%, -50%)",
        textAlign:"center",
        color: '#161D6F ',
        fontSize: "25px",
        fontWeight: "bold",
        textShadow: "3px 3px 3px #98DED9",        
    }
    return (
        <div>
            <center>
                <img src={logo} alt='logo' align='center' />
            </center>
            <Fade delay={500}>
                <div style={myStyle}>
                    <h1> Welcome! </h1>
                    <p> You are Logged In </p>
                </div>
            </Fade>
        </div>
    )
}

export default SubmitForm;
