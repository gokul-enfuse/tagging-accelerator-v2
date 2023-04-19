const express = require('express');
const projectRouter = express.Router();
projectRouter.use(express.json());
const conn = require('./mysqlConnection');

projectRouter.post('/create/project', async (req, res) => {
    let table_name = process.env.PROJECT;
    let project_Name = req.body.projectName;
    let project_clientname = req.body.client;
    let project_domain = req.body.domain;
    let project_status = (req.body.assignTo)?req.body.assignTo:0; //it is boolean flag to make understand the project has assigned or not.
    let createdDate = new Date().toJSON();
    let modifiedDate = new Date().toJSON();

    if(project_Name === null || project_clientname === null || project_domain === null) {
        res.status(400).json({message: "Invalid Input" });
    }

    sql = `INSERT INTO ${table_name} (project_Name, project_clientname, project_domain, project_status, createdDate, modifiedDate) VALUES ('${project_Name}', '${project_clientname}', ${project_domain}, ${project_status}, '${createdDate}', '${modifiedDate}')`;

    conn.query(sql, (error, result) => {
        if(error) {
            res.status(400).json({ message: "Could not create user.", error: error });
        } else {
            res.status(200).json({ message: "User created.", rs: result});
        }
    });
});

projectRouter.get('/allprojects', async (req, res) => {
    const table_name = process.env.PROJECT;
    await getprojects(null, res, table_name);
});

let getprojects = (arg = null, res, table_name = null) => {
    let sql = `SELECT project_id, project_Name, project_clientname, project_domain, project_status, createdDate, modifiedDate from ${table_name}`;
    if(arg!=null) {
        sql += ` WHERE ${arg}`;
    }
    conn.query(sql, (error, result) => {
        if(error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            res.json(result);
        }
    });
}

module.exports = projectRouter;