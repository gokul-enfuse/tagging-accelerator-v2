const express = require('express');
const mysql = require('mysql');
const taskRouter = express.Router();
taskRouter.use(express.json());
const conn = require('./mysqlConnection');


taskRouter.post('/createtask', async (req, res) => {
    let table_name = process.env.TASK;
   // let task_id = req.body.taskId;
    let task_title = req.body.taskTitle;
    let task_status = req.body.status;
    let profile_id = req.body.assignedTo; //denoted to assigned to
    let task_role = req.body.role;
    let creationDate = req.body.creationDate;
    let modifiedDate = new Date().toJSON();

    if(task_title === null || task_status === null || profile_id === 0 || task_role === 0) {
        res.status(400).json({message: "Invalid Input"});
    }
    sql = `INSERT INTO ${table_name} (task_title, task_status, profile_id, task_role, createdDate, modifiedDate) VALUES ('${task_title}', '${task_status}', ${profile_id}, ${task_role}, '${createdDate}', '${modifiedDate}')`;

    conn.query(sql, (error, result) => {
        if(error) {
            res.status(400).json({ message: "Could not create user.", error: error });
        } else {
            res.status(200).json({ message: "User created.", rs: result});
        }
    });
})


taskRouter.post('/taskbyfilter', async (req, res) => {

    console.log("request is for tagger:", req.body.assignedTo)
    Task.find({ assignedTo: req.body.assignedTo }, (err, docs) => {
        if (err) {
            console.error(err);
        } else {
            console.log(docs);
        }
        res.status(200).send(docs)
        console.log('doc is for tagger:', docs);
    });

    // console.log('doc is:', query);
    // res.json(query)
})

taskRouter.get('/getalltask', async (req, res) => {
     await gettask(null, res, 'accelerator_tasks');
})

taskRouter.delete('/task/:taskid', async (req, res) => {
    const taskid = req.params.taskid;
    await deletetask(` task_id = ${taskid}`, res, 'accelerator_tasks');
});

taskRouter.get('/completedtasks', async (req, res) => {
    const condi = 'task_status = completed';
    await gettask(condi, res, 'accelerator_tasks');
})

taskRouter.put('/updatetask/:id', async (req, res) => {
    const table_name = process.env.TASK;
    const task_id = req.params.id;

    sql = `UPDATE ${table_name} SET task_title = '${task_title}', task_status = '${task_status}', profile_id = '${profile_id}', task_role = '${task_role}', modifiedDate = '${modifiedDate}' WHERE task_id=${task_id}`;

    conn.query(sql, (error, result) => {
        if(error) {
            res.status(400).json({ message: "Could not update the task.", error: error });
        } else {
            res.status(200).json({ message: "Task updated.", rs: result});
        }
    });
});

let gettask = (arg = null, res, table_name = null) => {
    let sql = `SELECT task_id, task_title, task_status, profile_id, task_role, createdDate, modifiedDate from ${table_name}`;
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

let deletetask = (arg = null, res, table_name = null) => {
    let sql = `DELETE * FROM ${table_name} WHERE ${arg}`;
    conn.query(sql, (error, result) => {
        if(error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            res.json(result);
        }
    });
}



module.exports = taskRouter;