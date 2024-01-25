const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const multer = require('multer');
app.use(cors());
const taskRouter = express.Router();
taskRouter.use(express.json());
const conn = require('./mysqlConnection');
const xlsx = require('xlsx');

taskRouter.post('/createtask', async (req, res) => {
    let table_name = process.env.TASK;
    // let task_id = req.body.taskId;
    let task_title = req.body.taskTitle;
    let task_status = (req.body.status) ? req.body.status : null;
    let project_id = (req.body.assignedProject) ? req.body.assignedProject : 0;
    let profile_id = (req.body.assignedTo) ? req.body.assignedTo : 0; //denoted to assigned to
    let reviewer_profile_id = (req.body.reviewer_profile_id) ? req.body.reviewer_profile_id : 0;
    let task_role = (req.body.role) ? req.body.role : 3;
    let task_mediatype = (req.body.mediaType) ? req.body.mediaType : null;
    let task_filename = (req.body.filename) ? req.body.filename : null;
    let task_filepath = (req.body.filepath) ? req.body.filepath : null;
    let createdDate = req.body.creationDate;
    let modifiedDate = new Date().toJSON();
    if (task_title === null || task_status === null || profile_id === 0 || task_role === 0) {
        res.status(400).json({ message: "Invalid Input" });
    }
    sql = `INSERT INTO ${table_name} (task_title, task_status, project_id, profile_id, reviewer_profile_id, task_role, task_mediatype, task_filename, task_filepath, createdDate, modifiedDate) VALUES ('${task_title}', '${task_status}', ${project_id}, ${profile_id}, ${reviewer_profile_id}, ${task_role},'${task_mediatype}', '${task_filename}', '${task_filepath}', '${createdDate}', '${modifiedDate}')`;
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(400).json({ message: "Could not create user.", error: error });
        } else {
            res.status(200).json({ message: "User created.", rs: result });
        }
    });
});


/**
 * File Upload
 */
let timeValue = 0;
let fileName = "";
const storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
        //cb(null, "uploads/images");
        cb(null, process.env.TAGGINGSERVERPATH);
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname;
        const fileExtension = originalName.slice(originalName.lastIndexOf("."), originalName.length);
        timeValue = Date.now();
        fileName = `${file.fieldname}-${timeValue}${fileExtension}`;
        cb(null, fileName);
    }
});

const uploadImage = multer({
    storage: storageImage
}).single("image");
taskRouter.post('/api/upload', uploadImage, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path; // Change this path as per your actual file storage location
    const fileName = req.file.filename; // Change this path as per your actual file storage location
    const responseJson = {
        message: 'File uploaded successfully',
        filePath: filePath, // Include the file path in the response
        fileName: fileName
    };
    res.status(200).json({ ...responseJson, message: 'File uploaded successfully' });
});
/**
 * End
 */
taskRouter.post('/api/excelupload', (req, res) => {
    try {
        if (!req.body.excelData || !Array.isArray(req.body.excelData)) {
            return res.status(400).json({ message: 'No data uploaded or data is not an array' });
        }

        const dataArray = req.body.excelData;
        const table_name = process.env.TASK;

        dataArray.forEach((data) => {
            const task_title = data.task_title || '';
            const task_status = data.task_status || 'To Do';
            const project_id = data.project_id || '';
            const profile_id = data.profile_id || 0;
            const reviewer_profile_id = data.reviewer_profile_id || 0;
            const task_role = data.task_role || 3;
            const task_mediatype = data.task_mediatype || null;
            const task_filename = data.task_filename || null;
            const task_filepath = data.task_filepath || null;
            const createdDate = data.createdDate;
            const modifiedDate = data.modifiedDate;

            const sql = "INSERT INTO ?? (task_title, task_status, project_id, profile_id, reviewer_profile_id, task_role, task_mediatype, task_filename, task_filepath, createdDate, modifiedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const values = [table_name, task_title, task_status, project_id, profile_id, reviewer_profile_id, task_role, task_mediatype, task_filename, task_filepath, createdDate, modifiedDate];

            conn.query(sql, values, (error, result) => {
                if (error) {
                    res.status(400).json({ message: "Could not create tasks.", error: error });
                }
            });
        });

        res.status(200).json({ message: "Tasks created successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Error during excel data upload', error: error.message });
    }
});


taskRouter.post('/taskbyfilter', async (req, res) => {
    const arg = `accelerator_tasks.profile_id = ${req.body.assignedTo}`;
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id`
    await gettask(arg, res, 'accelerator_tasks', join);
});

taskRouter.get('/getalltask', async (req, res) => {
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id`;
    await gettask(null, res, 'accelerator_tasks', join);
});

taskRouter.get('/getreviewername', async (req, res) => {
    let join = `accelerator_profile ON accelerator_tasks.reviewer_profile_id = accelerator_profile.profile_id`;
    await gettask(null, res, 'accelerator_tasks', join);
});

taskRouter.get('/gettaggername', async (req, res) => {
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id`;
    await gettask(null, res, 'accelerator_tasks', join);
});

taskRouter.get('/gettaskbyproject/:projectId', async (req, res) => {
    const projectId = req.params.projectId;
    const condi = `accelerator_tasks.project_id = ${projectId}`;
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id AND accelerator_tasks.task_role = accelerator_profile.profile_role`;
    const sql = `SELECT accelerator_tasks.*, accelerator_profile.profile_username AS profile_username FROM accelerator_tasks INNER JOIN accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id WHERE accelerator_tasks.project_id =${projectId};`
    await runsql(sql, res);

});

taskRouter.get('/getreviewertask', async (req, res) => {
    let join = `accelerator_profile ON accelerator_tasks.reviewer_profile_id = accelerator_profile.profile_id`
    await gettask(null, res, 'accelerator_tasks', join);
});
taskRouter.get('/gettaggertask', async (req, res) => {
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id`
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
taskRouter.get('/passtasks', async (req, res) => {
    const condi = `task_status = 'Pass'`;
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id`
    await gettask(condi, res, 'accelerator_tasks', join);
})


taskRouter.put('/updatetask/:id', async (req, res) => {
    const table_name = process.env.TASK;
    const task_id = req.params.id;
    const modifiedDate = new Date().toJSON();
    
    if (req.body.record.tagger_id) {
        sql = `UPDATE ${table_name} SET task_title = '${req.body.record.task_title}', task_status = '${req.body.record.task_status}', reviewer_task_status = '${req.body.record.reviewer_task_status}', reviewer_profile_id = ${req.body.record.reviewer_profile_id}, task_role = ${req.body.record.task_role} ,profile_id = ${req.body.record.tagger_id}, modifiedDate = '${req.body.record.modifiedDate}' WHERE task_id in (${task_id})`;
    } else {
        sql = `UPDATE ${table_name} SET task_title = '${req.body.record.task_title}', task_status = '${req.body.record.task_status}', reviewer_task_status = '${req.body.record.reviewer_task_status}', reviewer_profile_id = ${req.body.record.reviewer_profile_id}, task_role = ${req.body.record.task_role} ,modifiedDate = '${req.body.record.modifiedDate}' WHERE task_id in (${task_id})`;
    }
    //console.log("sql1:", sql)
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(400).json({ message: "Could not update the task.", error: error });
        } else {
            res.status(200).json({ message: "Task updated.", rs: result });
        }
    });
});
taskRouter.put('/updatetaskprofile/:profile_id', async (req, res) => {
    const table_name = process.env.TASK;
    const profile_id = req.params.profile_id;
    const modifiedDate = new Date().toJSON();

    const sql = `UPDATE ${table_name} SET task_title = '${req.body.record.task_title}', task_status = '${req.body.record.task_status}', reviewer_task_status = '${req.body.record.reviewer_task_status}', reviewer_profile_id = ${req.body.record.reviewer_profile_id}, task_role = ${req.body.record.task_role}, profile_id = '${req.body.record.profile_id}', modifiedDate = '${modifiedDate}' WHERE profile_id = ${profile_id}`;
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(400).json({ message: "Could not update the task.", error: error });
        } else {
            res.status(200).json({ message: "Task updated.", rs: result });
        }
    });
});
taskRouter.get('/projectlist', async (req, res) => {
    let table_name = 'accelerator_project';
    await gettask(null, res, table_name, null);
})
taskRouter.get('/getmismatchedidtask', async (req, res) => {
    let table_name = 'accelerator_tasks'
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id`;
    let additionalCondition = 'accelerator_profile.profile_id IS NULL';
    await getmismatchedidtask(null, res, 'accelerator_tasks', join, additionalCondition);
});

taskRouter.post('/updateAssignment/:id', async (req, res) => {

    const table_name = process.env.TASK;
    const task_id = req.params.id;
    const modifiedDate = new Date().toJSON();
    let taggerId = req.body.record && req.body.record.tagger_id ? `, profile_id = ${req.body.record.assignedTo}` : '';
    console.log("taggerid:", req.body.assignedTo);
    const sql = `
    UPDATE ${table_name} 
    SET 
        task_title = '${req.body.record.task_title}', 
        task_status = '${req.body.record.task_status}', 
        reviewer_task_status = '${req.body.record.reviewer_task_status}', 
        reviewer_profile_id = ${req.body.record.reviewer_profile_id}, 
        task_role = ${req.body.record.task_role}, 
         profile_id = ${req.body.assignedTo}, 
        modifiedDate = '${modifiedDate}' 
        ${taggerId}
    WHERE task_id = ${task_id}
`;
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(400).json({ message: "Could not update the task.", error: error });
        } else {
            res.status(200).json({ message: "Task updated.", rs: result });
        }
    });
});

let getmismatchedidtask = (arg = null, res, table_name = null, join = null, additionalCondition = '') => {
    let sql = `
        SELECT
            accelerator_tasks.task_id,
            accelerator_tasks.task_title,
            accelerator_tasks.task_mediatype,
            accelerator_tasks.task_filename,
            accelerator_tasks.task_filepath,
            accelerator_tasks.task_status,
            accelerator_tasks.profile_id,
            accelerator_tasks.task_role,
            accelerator_tasks.createdDate,
            accelerator_tasks.modifiedDate,
            accelerator_tasks.project_id,
            accelerator_tasks.createdDate AS profile_createdDate,
            accelerator_tasks.modifiedDate AS profile_modifiedDate
        FROM
            accelerator_tasks
        LEFT JOIN
            accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id
        WHERE
    ${arg ? `${arg} AND ` : ''}
    ${additionalCondition}
`;
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            res.json(result);
        }
    });

};


let gettask = (arg = null, res, table_name = null, join = null) => {
    //task_id, task_title, task_status, profile_id, task_role, createdDate, modifiedDate
    let sql = `SELECT * from ${table_name}`;
    if (join != null) {
        sql += ` INNER JOIN ${join}`;
    }
    if (arg != null) {
        sql += ` WHERE ${arg}`;
    }
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            res.json(result);
        }
    });
}

const runsql = (sql, res) => {
    //task_id, task_title, task_status, profile_id, task_role, createdDate, modifiedDate
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
