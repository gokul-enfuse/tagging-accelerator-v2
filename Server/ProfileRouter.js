const express = require('express');
const profileRouter = express.Router();
profileRouter.use(express.json());
const CryptoJS = require("crypto-js");
const conn = require('./mysqlConnection');

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
                console.log(result[0].c);
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

profileRouter.get('/getalltaggers', async (req, res) => {
    let table_name = process.env.PROFILE;
    let join = ` inner join accelerator_project ON ${table_name}.project_id = accelerator_project.project_id inner join accelerator_role ON ${table_name}.profile_role = accelerator_role.role_id`;
    getuser('profile_role = 3', res, table_name, join);
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
    conn.query(sql, (error, result) => {
        if(error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            if(result.length) {
                console.log("result latest:", result)
                res.json(result);
                
            } else {
                res.status(200).json({ message: "There is no data for specific search."});
            }
            
        }
    });
}

module.exports = profileRouter;
