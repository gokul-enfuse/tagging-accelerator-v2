const express = require('express');
const mysql = require('mysql');
const taskRouter = express.Router();
taskRouter.use(express.json());
const conn = require('./mysqlConnection');


taskRouter.post('/createtask', async (req, res) => {
    let table_name = process.env.TASK;
    // let task_id = req.body.taskId;
    let task_title = req.body.taskTitle;
    let task_status = (req.body.status)?req.body.status:null;
    let project_id = (req.body.assignedProject)?req.body.assignedProject:0;
    let profile_id = (req.body.assignedTo)?req.body.assignedTo:0; //denoted to assigned to
    let reviewer_profile_id	= (req.body.reviewer_profile_id)?req.body.reviewer_profile_id: 0;
    let task_role = (req.body.role) ? req.body.role : 3;
    let createdDate = req.body.creationDate;
    let modifiedDate = new Date().toJSON();

    if (task_title === null || task_status === null || profile_id === 0 || task_role === 0) {
        res.status(400).json({ message: "Invalid Input" });
    }
    sql = `INSERT INTO ${table_name} (task_title, task_status, project_id, profile_id, reviewer_profile_id, task_role, createdDate, modifiedDate) VALUES ('${task_title}', '${task_status}', ${project_id}, ${profile_id}, ${reviewer_profile_id}, ${task_role}, '${createdDate}', '${modifiedDate}')`;
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(400).json({ message: "Could not create user.", error: error });
        } else {
            res.status(200).json({ message: "User created.", rs: result });
        }
    });
});


taskRouter.post('/taskbyfilter', async (req, res) => {
    const arg = `accelerator_tasks.profile_id = ${req.body.assignedTo}`;
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id`
    await gettask(arg, res, 'accelerator_tasks', join);
});

taskRouter.get('/getalltask', async (req, res) => {
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id`
    await gettask(null, res, 'accelerator_tasks', join);
});
taskRouter.get('/gettaskbyproject/:projectId', async (req, res) => {
    const projectId = req.params.projectId;
    const condi = `project_id = ${projectId}`;

    let join = `accelerator_project ON accelerator_tasks.project_id = ${projectId}`
    await gettask(condi, res, 'accelerator_tasks', null);
});

taskRouter.get('/getreviewertask', async (req, res) => {
    let join = `accelerator_profile ON accelerator_tasks.reviewer_profile_id = accelerator_profile.profile_id`
    await gettask(null, res, 'accelerator_tasks', join);
});

taskRouter.delete('/task/:taskid', async (req, res) => {
    const taskid = req.params.taskid;
    await deletetask(` task_id = ${taskid}`, res, 'accelerator_tasks');
});

taskRouter.get('/completedtasks', async (req, res) => {
    const condi = `task_status = 'Completed'`;
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id`
    await gettask(condi, res, 'accelerator_tasks', join);
})


taskRouter.put('/updatetask/:id', async (req, res) => {
    const table_name = process.env.TASK;
    const task_id = req.params.id;
    const modifiedDate = new Date().toJSON();

    sql = `UPDATE ${table_name} SET task_title = '${req.body.record.task_title}', task_status = '${req.body.record.task_status}', reviewer_task_status = '${req.body.record.reviewer_task_status}', reviewer_profile_id = ${req.body.record.reviewer_profile_id}, task_role = ${req.body.record.task_role}, modifiedDate = '${req.body.record.modifiedDate}' WHERE task_id=${task_id}`;
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(400).json({ message: "Could not update the task.", error: error });
        } else {
            res.status(200).json({ message: "Task updated.", rs: result });
        }
    });
});

taskRouter.get('/projectlist', async(req, res) => {
    let table_name = 'accelerator_project';
    await gettask(null, res, table_name, null);
})

let gettask = (arg = null, res, table_name = null, join = null) => {
    //task_id, task_title, task_status, profile_id, task_role, createdDate, modifiedDate
    let sql = `SELECT * from ${table_name}`;
    if (join != null) {
        sql += ` INNER JOIN ${join}`;
    }
    if (arg != null) {
        sql += ` WHERE ${arg}`;
    }
    console.log("sql:",sql)
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            res.json(result);
        }
    });
}

let deletetask = (arg = null, res, table_name = null) => {
    let sql = `DELETE * FROM ${table_name} WHERE ${arg}`;
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            res.json(result);
        }
    });
}



module.exports = taskRouter;