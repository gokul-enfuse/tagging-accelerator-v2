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
    let createdDate = new Date().toJSON().substring(0, 10);
    let modifiedDate = new Date().toJSON().substring(0, 10);

    if(project_Name === null || project_clientname === null || project_domain === null) {
        res.status(400).json({message: "Invalid Input" });
    }

    sql = `INSERT INTO ${table_name} (project_Name, project_clientname, project_domain, project_status, createdDate, modifiedDate) VALUES ('${project_Name}', '${project_clientname}', '${project_domain}', ${project_status}, '${createdDate}', '${modifiedDate}')`;
    conn.query(sql, (error, result) => {
        if(error) {
            res.status(400).json({ message: "Could not create project due to SQL error.", error: error.sqlMessage });
        } else {
            res.status(200).json({ message: "Project created.", rs: result.affectedRows});
        }
    });
});

projectRouter.get('/allprojects', async (req, res) => {
    const table_name = process.env.PROJECT;
    const { project_ids } = req.query;
    const arg = (project_ids)?` project_id in (${project_ids})`:null;
    await getprojects(arg, res, table_name, null);
});

/**
 * Created By: Vikas Bose | 20/02/2024
 */
projectRouter.get('/profilerelateproject', async (req, res) => {
    const table_name = process.env.PROJECT;
    const { project_ids } = req.query;
    const arg = (project_ids)?` project_id in (${project_ids})`:` project_id not in (null)`;
    await getprojectsDuplicate(arg, res, table_name, null);
});

projectRouter.get('/specificprojects', async (req, res) => {
    const table_name = process.env.PROJECT;
    await getprojects(null, res, table_name, null);
});

/**
 * Created By: Vikas Bose | 08/02/2024
 */
projectRouter.get('/listoworker', async(req, res) => {
    const { role_id } = req.query;
    const table_name = process.env.PROFILE;
    const condi = (role_id === '2')?` WHERE profile_role = ${role_id}` : ` WHERE profile_role in (${role_id})`;
    await listOfWorkers(table_name, res, condi);
});

let getprojects = (arg = null, res, table_name = null, join = null) => {
    let sql = `SELECT project_id, project_Name, project_clientname, project_domain, project_status, createdDate, modifiedDate from ${table_name}`;
    if(join!=null) {
        sql += join;
    }
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
};

/**
 * Created By: Vikas Bose | 20/02/2024
 * @param {*} arg 
 * @param {*} res 
 * @param {*} table_name 
 * @param {*} join 
 */
let getprojectsDuplicate = (arg = null, res, table_name = null, join = null) => {
    let sql = `SELECT GROUP_CONCAT(project_id) as project_id, GROUP_CONCAT(project_Name) as project_name, GROUP_CONCAT(project_clientname) as project_clientname, GROUP_CONCAT(project_domain) as project_domain, GROUP_CONCAT(project_status) as project_status, createdDate, modifiedDate from ${table_name}`;
    if(join!=null) {
        sql += join;
    }
    if(arg!=null) {
        sql += ` WHERE ${arg}`;
    }
    //console.log("Vikas= ", sql)
    conn.query(sql, (error, result) => {
        if(error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            res.json(result);
        }
    });
};
/**
 * Created By: Vikas Bose | 08/02/2024
 * @param {*} table_name 
 * @param {*} res 
 * @param {*} condi 
 */
let listOfWorkers = (table_name, res, condi) => {
    let sql = ` SELECT profile_id, profile_fullname, profile_username, profile_role, project_id FROM ${table_name} ${condi}`;
    conn.query(sql, (error, result) => {
        if(error) {
            res.status(404).json({ message: "Data not found.", error: error.sqlMessage });
        } else {
            res.json(result);
        }
    });

};

module.exports = projectRouter;
