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
    console.log("sql q:", sql)
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
        cb(null, "uploads/images");
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

    console.log('File received:', req.file);

    console.log('File received:', req.file.filename);



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




// taskRouter.post('/api/excelupload', uploadExcel, (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const filePath = req.file.path; // Change this path as per your actual file storage location
//     const fileName = req.file.filename; // Change this path as per your actual file storage location

//     console.log('Excel File received:', req.file.filename);

//     // Parse the Excel file and insert data into the database
//     const workbook = xlsx.readFile(filePath);
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const excelData = xlsx.utils.sheet_to_json(worksheet);

//     // Insert excelData into the MySQL database
//     // ...

//     const responseJson = {
//         message: 'Excel File uploaded successfully',
//         filePath: filePath, // Include the file path in the response
//         fileName: fileName,
//         excelData: excelData // Include parsed Excel data in the response
//     };
//     res.status(200).json({ ...responseJson, message: 'Excel File uploaded successfully' });
// });

// taskRouter.post('/api/excelupload', upload.fields([{ name: 'excelFile' }, { name: 'zipFile' }, { name: 'excelData' }]), async (req, res) => {
//     const excelFile = req.files['excelFile'][0];
//     const zipFile = req.files['zipFile'][0];
//     const excelData = JSON.parse(req.body['excelData']);

//     if (!excelFile || !zipFile || !excelData) {
//         return res.status(400).json({ message: 'Missing files or data' });
//     }
//     try {
//         // Read and process excelFile, zipFile, and excelData as needed
//         // Insert excelData into your MySQL database
//         // ...

//         res.status(200).json({ message: 'Upload successful' });
//     } catch (error) {
//         console.error('Error during upload:', error);
//         res.status(500).json({ message: 'Error during upload', error: error.message });
//     }
// });

// taskRouter.post('/api/excelupload', (req, res) => {
//     console.log("re.body:", req.body);
//     const excelData = req.body.excelData;
//     console.log("excelData:", req.body.excelData);
//     res.status(200).json({ message: 'Data received successfully' });

// });

// taskRouter.post('/api/excelupload', (req, res) => {
//     // console.log("data:", req.body.excelData);

//     try {
//         if (!req.body.excelData) {
//             return res.status(400).json({ message: 'No data uploaded' });
//         }

//         const data = req.body.excelData;
//         console.log("tasktitle:", data[0].task_title)

//         const task_title = data.task_title || '';
//         const task_status = data.task_status || null;
//         const project_id = data.projectid || 0;
//         const profile_id = data.profile_id || 0;
//         const reviewer_profile_id = data.reviewer_profile_id || 0;
//         const task_role = data.task_role || 3;
//         const task_mediatype = data.task_mediatype || null;
//         const task_filename = data.task_filename || null;
//         const task_filepath = data.task_filepath || null;
//         const createdDate = data.createdDate;
//         const modifiedDate = new Date().toJSON();

//         // if (!task_title || !task_status || !profile_id || !task_role) {
//         //     return res.status(400).json({ message: "Invalid Input" });
//         // }

//         const table_name = process.env.TASK;
//         const sql = `INSERT INTO ${table_name} (task_title, task_status, project_id, profile_id, reviewer_profile_id, task_role, task_mediatype, task_filename, task_filepath, createdDate, modifiedDate)
//                      VALUES ('${task_title}', '${task_status}', ${project_id}, ${profile_id}, ${reviewer_profile_id}, ${task_role}, '${task_mediatype}', '${task_filename}', '${task_filepath}', '${createdDate}', '${modifiedDate}')`;

//         console.log("SQL query:", sql);

//         conn.query(sql, (error, result) => {
//             if (error) {
//                 res.status(400).json({ message: "Could not create task.", error: error });
//             } else {
//                 res.status(200).json({ message: "Task created.", rs: result });
//             }
//         });
//     } catch (error) {
//         console.error('Error during excel data upload:', error);
//         res.status(500).json({ message: 'Error during excel data upload', error: error.message });
//     }
// });

// taskRouter.post('/api/excelupload', (req, res) => {
//     // console.log("data:", req.body.excelData);

//     try {
//         if (!req.body.excelData || !Array.isArray(req.body.excelData)) {
//             return res.status(400).json({ message: 'No data uploaded or data is not an array' });
//         }

//         const dataArray = req.body.excelData;

//         // Define an array to store the SQL queries for each record
//         const sqlQueries = [];

//         dataArray.forEach((data) => {
//             const task_title = data.task_title || '';
//             const task_status = data.task_status || 'To Do';
//             const project_id = `'${data.project_id || ''}'`;
//             const profile_id = data.profile_id || 0;
//             const reviewer_profile_id = data.reviewer_profile_id || 0;
//             const task_role = data.task_role || 3;
//             const task_mediatype = data.task_mediatype || null;
//             const task_filename = data.task_filename || null;
//             const task_filepath = data.task_filepath || null;
//             const createdDate = data.createdDate;
//             const modifiedDate = new Date().toJSON();

//             const table_name = process.env.TASK;
//             const sql = `INSERT INTO ${table_name} (task_title, task_status, project_id, profile_id, reviewer_profile_id, task_role, task_mediatype, task_filename, task_filepath, createdDate, modifiedDate)
//                          VALUES ('${task_title}', '${task_status}', ${project_id}, ${profile_id}, ${reviewer_profile_id}, ${task_role}, '${task_mediatype}', '${task_filename}', '${task_filepath}', '${createdDate}', '${modifiedDate}')`;

//             sqlQueries.push(sql)
//         })

//         // Perform batch insert by joining SQL queries with semicolon
//         const batchInsertSQL = sqlQueries.join('; ');

//         console.log("Batch SQL queries:", batchInsertSQL)

//         conn.query(batchInsertSQL, (error, result) => {
//             if (error) {
//                 res.status(400).json({ message: "Could not create tasks.", error: error });
//             } else {
//                 res.status(200).json({ message: "Tasks created.", rs: result });
//             }
//         })
//     } catch (error) {
//         console.error('Error during excel data upload:', error);
//         res.status(500).json({ message: 'Error during excel data upload', error: error.message });
//     }
// })


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
            const modifiedDate = new Date().toJSON();

            const sql = "INSERT INTO ?? (task_title, task_status, project_id, profile_id, reviewer_profile_id, task_role, task_mediatype, task_filename, task_filepath, createdDate, modifiedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const values = [table_name, task_title, task_status, project_id, profile_id, reviewer_profile_id, task_role, task_mediatype, task_filename, task_filepath, createdDate, modifiedDate];

            conn.query(sql, values, (error, result) => {
                if (error) {
                    console.error('Error during task creation:', error);
                    res.status(400).json({ message: "Could not create tasks.", error: error });
                }
            });
        });

        res.status(200).json({ message: "Tasks created successfully." });
    } catch (error) {
        console.error('Error during excel data upload:', error);
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
    const sql =
        `SELECT accelerator_tasks.*, accelerator_profile.profile_username AS profile_username FROM accelerator_tasks INNER JOIN accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id WHERE accelerator_tasks.project_id =${projectId};`
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
    console.log('Profile ID:', req.params.profile_id); // Add this console.log statement
    console.log('task_title:', req.body.record.task_title);
    console.log('task_title:', req.body.record.profile_id);


    if (req.body.record.tagger_id) {

        sql = `UPDATE ${table_name} SET task_title = '${req.body.record.task_title}', task_status = '${req.body.record.task_status}', reviewer_task_status = '${req.body.record.reviewer_task_status}', reviewer_profile_id = ${req.body.record.reviewer_profile_id}, task_role = ${req.body.record.task_role} ,profile_id = ${req.body.record.tagger_id}, modifiedDate = '${req.body.record.modifiedDate}' WHERE task_id=${task_id}`;

    }
    else {
        sql = `UPDATE ${table_name} SET task_title = '${req.body.record.task_title}', task_status = '${req.body.record.task_status}', reviewer_task_status = '${req.body.record.reviewer_task_status}', reviewer_profile_id = ${req.body.record.reviewer_profile_id}, task_role = ${req.body.record.task_role} ,modifiedDate = '${req.body.record.modifiedDate}' WHERE task_id=${task_id}`;

    }
    console.log("sql1:", sql)
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

    console.log('Profile ID:', req.params.profile_id); // Add this console.log statement
    console.log('task_title:', req.body.record.task_title);

    const sql = `UPDATE ${table_name} SET task_title = '${req.body.record.task_title}', task_status = '${req.body.record.task_status}', reviewer_task_status = '${req.body.record.reviewer_task_status}', reviewer_profile_id = ${req.body.record.reviewer_profile_id}, task_role = ${req.body.record.task_role}, profile_id = '${req.body.record.profile_id}', modifiedDate = '${modifiedDate}' WHERE profile_id = ${profile_id}`;
    console.log("sql2:", sql)

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

let gettask = (arg = null, res, table_name = null, join = null) => {
    //task_id, task_title, task_status, profile_id, task_role, createdDate, modifiedDate
    let sql = `SELECT * from ${table_name}`;
    if (join != null) {
        sql += ` INNER JOIN ${join}`;
    }
    if (arg != null) {
        sql += ` WHERE ${arg}`;
    }
    console.log("sql:", sql)
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

    console.log("sql:", sql)
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



