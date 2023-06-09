const express = require('express');
var nodemailer = require('nodemailer');
const conn = require('./mysqlConnection');
var CryptoJS = require("crypto-js");

const profileRouter = express.Router();
profileRouter.use(express.json());

profileRouter.post('/create/profile', async (req, res) => {
    let table_name = process.env.PROFILE;
    let profile_name = (req.body.name)? req.body.name:null;
    let profile_email = (req.body.email)? req.body.email:null;
    let profile_fullname = (req.body.fullname)? req.body.fullname:null;
    let profile_username = (req.body.username)? req.body.username:(req.body.email)?req.body.email:null;
    let profile_password = (req.body.password)? CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET_KEY).toString() :null;
    let profile_confirmpassword = (req.body.confirmPassword)? req.body.confirmPassword:null;
    let profile_role = (req.body.role)? req.body.role:0;
    let project_id = (req.body.id)? req.body.id:0;
    let createdDate = new Date().toJSON();
    let modifiedDate = new Date().toJSON();

    if(profile_email === null || profile_username === null || profile_password === null || profile_role === 0) {
        res.status(400).json({ message: "Invalid input." });
    }
        const sqlFindAndUpdate = `SELECT count(*) as c from ${table_name} WHERE profile_email='${profile_email}'`;
        conn.query(sqlFindAndUpdate, (error, result) => {
            if(error) {
                res.status(400).json({message: 'SQL error', Error: error});
            } else {
                let sql ='';
                if(result[0].c > 0) {
                     sql = `UPDATE ${table_name} SET profile_name = '${profile_name}', profile_email = '${profile_email}', profile_fullname = '${profile_fullname}', profile_username = '${profile_username}', profile_password = '${profile_password}', profile_confirmpassword = '${profile_confirmpassword}', profile_role = ${profile_role}, project_id = '${project_id}', modifiedDate = '${modifiedDate}' WHERE profile_email='${profile_email}'`;
                } else {
                     sql = `INSERT INTO ${table_name} (profile_name, profile_email, profile_fullname, profile_username, profile_password, profile_confirmpassword, profile_role, project_id, createdDate, modifiedDate) VALUES ('${profile_name}', '${profile_email}', '${profile_fullname}', '${profile_username}', '${profile_password}', '${profile_confirmpassword}', ${profile_role}, '${project_id}', '${createdDate}', '${modifiedDate}')`;
                }
                conn.query(sql, (error, result) => {
                    if(error) {
                        res.status(400).json({ message: "Could not create user.", error: error });
                    } else {
                       let updateSQl = `UPDATE accelerator_project SET project_status = 1 WHERE project_id in (${project_id})`;
                       conn.query(updateSQl, (error, result) => {
                           if(error) {
                                res.status(400).json({ message: "Could not create user.", error: error });
                           } else {
                                res.status(200).json({ message: "User created.", rs: result});
                           }
                       })
                    }
                });
            }
        });
});

profileRouter.post("/api/login", (req, res) => {
    let table_name = process.env.PROFILE;

    const sql = `SELECT profile_id, profile_name, profile_email, profile_fullname, profile_username, profile_password, profile_confirmpassword, profile_role, project_id, createdDate, modifiedDate from ${table_name} WHERE profile_username = '${req.body.username}'`;
    conn.query(sql, (error, result) => {
        if(error) {
            res.status(404).json({ message: "User not found.", error: error });
        } else {
            if(result[0]) {
                const decryptedPassword = CryptoJS.AES.decrypt(
                    result[0].profile_password,
                    process.env.PASSWORD_SECRET_KEY
                ).toString(CryptoJS.enc.Utf8);
                if (decryptedPassword !== req.body.password) {
                    return res.status(401).json({ message: "Incorrect password" });
                }
                res.status(200).json(result[0]);
            } else {
                res.status(400).json({ message: "Could not login user" });
            }            
        }
    });
});

profileRouter.get('/api/forgotpassword/:email', (req, res) => {
    const email = req.params.email;
    let table_name = process.env.PROFILE;
    const sql = `SELECT profile_id, profile_email, profile_name, profile_username, profile_confirmpassword from ${table_name} WHERE profile_email = '${email}'`;

    conn.query(sql, (error, result) => {
        if(error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            if(result.length) {
                emailFunction(result[0].profile_email, result[0].profile_name, result[0].profile_id);
                res.json(result);                
            } else {
                res.status(400).json({ message: "There is no data for specific search."});
            }
            
        }
    });
});

profileRouter.post('/api/resetpassword', (req, res) => {
    const profile_id = req.body.pid;
    const email = req.body.username;
    const nPassword = CryptoJS.AES.encrypt(req.body.newpassword, process.env.PASSWORD_SECRET_KEY).toString();
    const cPassword = req.body.confirmpassword;
    
    let table_name = process.env.PROFILE;
    const sql = `UPDATE ${table_name} SET profile_password = '${nPassword}', profile_confirmpassword = '${cPassword}' WHERE profile_id = ${profile_id}`;
    
    conn.query(sql, (error, result) => {
        if(error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            emailFunction(email, email, cPassword);
            res.status(200).json({status: 200});            
        }
    });
});

profileRouter.get('/getalltaggers', async (req, res) => {
    let table_name = process.env.PROFILE;
    let join = ` inner join accelerator_project ON ${table_name}.project_id = accelerator_project.project_id inner join accelerator_role ON ${table_name}.profile_role = accelerator_role.role_id`;
    getuser('accelerator_profile.profile_role = 3', res, table_name, join);
});

profileRouter.get('/allprofiles', async (req, res) => {
    let table_name = process.env.PROFILE;
    let join = ` inner join accelerator_project ON ${table_name}.project_id = accelerator_project.project_id inner join accelerator_role ON ${table_name}.profile_role = accelerator_role.role_id`;
    getuser(null, res, table_name, join);
});

let getuser = (arg = null, res, table_name = null ,join = null) => {
    let sql = `SELECT profile_id, profile_name, profile_email, profile_fullname, profile_username, profile_password, profile_confirmpassword, profile_role, ${table_name}.project_id, ${table_name}.createdDate, ${table_name}.modifiedDate, project_name, role_name from ${table_name}`;
    if(join != null) {
        sql += join
    }
    if(arg) {
        sql += ` WHERE ${arg}`;
    }
    // console.log("sql:", sql)
    conn.query(sql, (error, result) => {
        if(error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            if(result.length) {
                res.json(result);                
            } else {
                res.status(200).json({ message: "There is no data for specific search."});
            }
            
        }
    });
}


/**
 * Method Name: Email
 * Description: To send an email with spacific template pattern
 * Created By: Vikas Bose | 03/04/2023
 * Modified By: 
 */
let emailFunction = (email, username, password)=> {

    var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'vikasr82@gmail.com',
        pass: 'ispnurgwhzontnms'
    }
    });
   // console.log(CryptoJS.AES.encrypt(email, "Key").toString(), CryptoJS.HmacSHA256(email, "key").toString());
    let contentOne = `
        <div>You recently requested to reset the password for your [${process.env.HOST}] account. Click the link below to proceed.</div>
        <div><a href=${process.env.HOST}resetpassword/${password}/${email}>Reset Password</a></div>
        <div>If you did not request a password reset, please ignore this email.</div>
        <div>If you have any comments or questions do not hesitate to reach us at <a>[email to customer portal support team]</a></div>
    `
    let contentTwo = `
        <div style='color:blue;padding:13px 0px 13px 0px' align='center'>UserName</div>
        <div style='padding:13px 0px 13px 0px' align='center'>${email}</div>
        <div style='color:blue;padding:13px 0px 13px 0px' align='center'>Password</div>
        <div style='padding:13px 0px 13px 0px' align='center'>${password}</div>
        <div style='padding:15px 0px 15px 0px' align='center'>Please click this link below and login with your credentials</div>
        <div style='padding:13px 0px 13px 0px' align='center'><a href=${process.env.HOST}>Login Here</a></div>`
    let mainContent = (typeof password === 'number')?contentOne : contentTwo;
    let a = `<html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="style.css" />
            <title>Browser</title>
            </head>

            <body>
            <div>
                <div align='center'><img src='cid:bestWishBanner'></div>
                <div style='width:500px;margin-left:400px;'>
                    <h2 align='center'>Hi ${username}</h2>
                    <p>                    
                        ${mainContent}                    
                    <div>Thanks</div>
                    <div>The Enfuse[customer portal] Team</div>

                    <div style='padding:20px 0px 20px 0px; background-color:black; height:45px;color:white;text-align:center'>Copyright © 2022 All Rights Reserved. EnFuse Solutions</div>
                    </p>
                </div>`;
        a += `</div></body></html>`;
    var mailOptions = {
    from: 'vikasr82@gmail.com',
    to: email,
    subject: 'Enfuse Reset Password',
    html: a
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}

module.exports = profileRouter;
