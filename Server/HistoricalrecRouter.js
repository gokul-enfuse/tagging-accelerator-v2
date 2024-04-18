const express = require('express');
const conn = require('./mysqlConnection');

const historicalRecRouter = express.Router();
historicalRecRouter.use(express.json());

historicalRecRouter.get('/api/historicalRec', async (req, res) => {
    let addition = [`profile_username`, `project_name`];
    let table_task = `accelerator_tasks`, table_profile = `accelerator_profile`;
    let fields = [`task_id`, `task_folder_name`, `task_status`, `${table_task}.project_id`, `project_name`, `${table_task}.profile_id`, `u1.profile_username as tagger`, `reviewer_profile_id`, `u2.profile_username as reviewer`, `task_mediatype`, `task_process_type`, `${table_task}.createdDate`];
    let join = ` INNER JOIN ${table_profile} u1 ON ${table_task}.profile_id = u1.profile_id INNER JOIN ${table_profile} u2 ON ${table_task}.reviewer_profile_id = u2.profile_id INNER JOIN accelerator_project ON ${table_task}.project_id = accelerator_project.project_id `
    let condi = ` task_status = 'completed'`;
    
    await getHistoricalRec(res, table_task, fields, join, condi);
});


/**
 * ================================================================Functions
 */

const getHistoricalRec = (response, tablename, fields, join=null, condition=null) => {
    let sqlSelect = ` SELECT ${fields} FROM ${tablename}`;
        if(join!=null) {
            sqlSelect+= ` ${join}`;
        }
        if(condition!=null) {
            sqlSelect+= ` WHERE ${condition}`;
        }
    //console.log("sqlSelect ", sqlSelect);
    conn.query(sqlSelect, (error, result) => {
        if(error) {
            response.status(404).json({ message: "Data not found.", error: error });
        } else {
            response.json(result);
        }
    })
}

module.exports = historicalRecRouter;
