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

historicalRecRouter.get('/api/getallprofile', async(req, res) => {
    let {role_id} = req.query;
    let table_profile = process.env.PROFILE;
    let fields = [`profile_id`, `profile_username`, `profile_role`];
    let condi = ` profile_role in (${role_id.join()})`;

    await getHistoricalRec(res, table_profile, fields, null, condi);
});

historicalRecRouter.put('/api/updateprofile', async(req, res) => {
    const {new_profile_id, new_reviewer_profile_id, task_id, old_reviewer_profile_id} = req.query;
    let table_task =process.env.TASK;
    let table_task_image = process.env.TASK_IMAGES;
    let setFields = ` SET profile_id = ${new_profile_id}, reviewer_profile_id = ${new_reviewer_profile_id}, task_role = 3, task_status = 'To Do', reviewer_task_status = ''`;
    let condi = ` task_id = ${task_id}`;
    let setfieldsTwo = ` SET profile_id = ${new_profile_id}`;
    let condiTwo = ` task_id = ${task_id} and profile_id = ${old_reviewer_profile_id}`;

    if(new_profile_id && new_reviewer_profile_id && task_id) {
        await updateHistoricalRec(res, table_task, table_task_image, setFields, setfieldsTwo, condi, condiTwo);
    } else {
        res.status(400).json({message: 'Invalid arguments.'});
    }
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
    });
};

const updateHistoricalRec = (response, tablename, tablenametwo = null, setfields, setfieldsTwo = null, conditions, conditionsTwo = null) => {
    let sqlUpdate = ` UPDATE ${tablename} ${setfields} WHERE ${conditions}`;
    conn.query(sqlUpdate, (error, result) => {
        if(error) {
            response.status(400).json({ message: "Data not updated.", error: error });
        } else {
            if(tablenametwo) {
                let sqlUpdateTwo = ` UPDATE ${tablenametwo} ${setfieldsTwo} WHERE ${conditionsTwo} `;
                console.log(sqlUpdateTwo);
                conn.query(sqlUpdateTwo, (error, resultT) => {
                    if(error) {
                        response.status(400).json({ message: "Data not updated.", error: error });
                    } else {
                        response.json(resultT);
                    }
                });
            } else {
                response.json(result);
            }
        }
    });
};

module.exports = historicalRecRouter;
