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
let shortid = require('shortid');
let fs = require('fs');
//const { id } = require('date-fns/locale');

/**
 * Created By: Vikas Bose | 11/02/2024
 * Description: This API call select the details from profile table and fetch the project id, if there. Then insert the project id into create task table with comma saparator
 */
taskRouter.post('/createtask', async (req, res) => {
    let table_name_task = process.env.TASK;
    let table_name_profile = process.env.PROFILE;
    let table_name_project = process.env.PROJECT;
    let task_folder_name = req.body.category || `folderName_${shortid.generate()}`;
    let task_title = req.body.taskTitle || `title_${shortid.generate()}`;
    let task_status = (req.body.status) ? req.body.status : null;
    let reviewer_task_status = null;
    let project_id = (req.body.assignedProject) ? req.body.assignedProject : 0;
    let profile_id = (req.body.assignedTo) ? req.body.assignedTo : 0; //denoted to assigned to
    let reviewer_profile_id = (req.body.reviewer_profile_id) ? req.body.reviewer_profile_id : 0;
    let task_role = (req.body.role) ? req.body.role : 3;
    let task_mediatype = (req.body.mediaType) ? req.body.mediaType : null;
    let task_filename = (req.body.fileName) ? req.body.fileName : null;
    let task_filepath = (req.body.filePath) ? req.body.filePath : null;
    let task_process_type = 'manual';
    let createdDate = req.body.creationDate;
    let modifiedDate = new Date().toJSON().substring(0, 10);
    if (task_title === null || task_status === null || profile_id === 0 || task_role === 0) {
        res.status(400).json({ message: "Invalid Input" });
    }

    let projects = [];
    let selectSQL = ` SELECT profile_id, project_id FROM ${table_name_profile} WHERE profile_id = ${profile_id}`;
    conn.query(selectSQL, (error, selectRes) => {
        if (error) {
            res.status(400).json({ message: "SQL error.", error: error });
        } else {
            projects.push(project_id, selectRes[0]['project_id']);
            let sqlProject = `SELECT project_status FROM ${table_name_project} WHERE project_id = ${project_id}`;
            conn.query(sqlProject, (error, result) => {
                if(error) {
                    res.status(400).json({ message: "SQL error.", error: error });
                } else {
                    if(result[0].project_status === 0) {
                        res.status(200).json({ message: "Manager does not belong to the project.", error: result[0].project_status });
                    } else {
                        let sqlUpdate = ` update ${table_name_profile} SET project_id = '${projects.reverse()}' where profile_id = ${profile_id}`;
                        conn.query(sqlUpdate, (error, updateRes) => {
                            if(error) {
                                res.status(400).json({ message: "SQL error.", error: error });
                            } else {
                                insertTaskSql = ` INSERT INTO ${table_name_task} (task_folder_name, task_title, task_status, reviewer_task_status, project_id, profile_id, reviewer_profile_id, task_role, task_mediatype, task_zip_folder_name, task_process_type, createdDate, modifiedDate) VALUES ('${task_folder_name}', '${task_title}', '${task_status}', '${reviewer_task_status}', '${project_id}', ${profile_id}, ${reviewer_profile_id}, ${task_role},'${task_mediatype}', '${shortid.generate()+'_extracted'}', '${task_process_type}', '${createdDate}', '${modifiedDate}') `;
                                conn.query(insertTaskSql, (error, taskInsertRes) => {
                                    if(error) {
                                        res.status(400).json({ message: "SQL error.", error: error });
                                    } else{
                                        let table_media_type = '', media_fields = [];
                                        if(task_mediatype === 'image') {
                                            table_media_type = 'accelerator_task_image';
                                            media_fields = [`task_id`, `profile_id`, `image_imagename`, `image_imagepath`, `createdDate`, `modifiedDate`].join();
                                        }
                                        /* if(task_mediatype === 'doc') {
                                            table_media_type = 'accelerator_task_doc';
                                            media_fields = [`task_id`, `profile_id`, `media_filename`, `media_filepath`, `createdDate`, `modifiedDate`].join();
                                        } */
                                        sql = `INSERT INTO ${table_media_type} (${media_fields}) VALUES `;
                                            for(let i=0; i<task_filename.length; i++) {
                                                sql+= `('${taskInsertRes.insertId}', '${profile_id}', '${task_filename[i]}', '${task_filepath[i].replace(/\\/g, '/')}', '${createdDate}', '${modifiedDate}')`;
                                                if(i < task_filename.length - 1) {
                                                    sql += ', ';
                                                }
                                            }
                                        console.log("SQL = ", sql);
                                        conn.query(sql, (error, sqlRes) => {
                                            if(error) {
                                                res.status(400).json({ message: "SQL error.", error: error });
                                            } else {
                                                res.status(200).json({ message: "Task created.", rs: sqlRes });
                                            }
                                        });  
                                    } //end else
                                });                    
                            } //end else
                        }); 
                    } //end else
                } //end else
            });                             
        } //end else
    });    
});

/**
 * Created By: Vikas Bose | 11/02/2024
 * File Upload
 */
let timeValue = 0;
let fileName = "";
const storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
        //cb(null, "uploads/images");
        console.log("fileDetails=", file);
        let folderPath = (file.mimetype === 'image/jpeg')?process.env.TAGGINGSERVERPATH+'/manual/image/' : process.env.TAGGINGSERVERPATH+'/manual/doc/';
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        cb(null, folderPath);
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
}).array("images");

taskRouter.post('/api/upload', uploadImage, (req, res) => {
    let pathArr = [], fileNameArr = [];
    if (!req.files) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    if(req.files.length >= 1) {
        const filePath = req.files.map((v, i, itmes) => itmes[i].path); // Change this path as per your actual file storage location
        const fileName = req.files.map((v, i, itmes) => itmes[i].filename); // Change this path as per your actual file storage location
        const responseJson = {
            message: 'File uploaded successfully',
            filePath: filePath, // Include the file path in the response
            fileName: fileName
        };
        res.status(200).json({ ...responseJson, message: 'File uploaded successfully' });
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

/**
 * Created By: Vikas Bose | 15/02/2024
 * TAGGER STARTED
 */

/* taskRouter.get('/gettaggername', async (req, res) => {
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id`;
    await gettask(null, res, 'accelerator_tasks', join);
}); */

taskRouter.get('/gettaggertask', async (req, res) => {
    let fields = [`accelerator_tasks.task_id`, 
                `accelerator_tasks.task_folder_name`, 
                `accelerator_tasks.task_title`, 
                `task_status`,
                `task_mediatype`, 
                `accelerator_tasks.profile_id`, 
                `role_name`, 
                `profile_name`, 
                `profile_email`, 
                `profile_username`, 
                `accelerator_tasks.project_id`, 
                `accelerator_tasks.createdDate`, 
                `(select count(image_id) from accelerator_task_image WHERE task_id = accelerator_tasks.task_id and profile_id = accelerator_tasks.profile_id) as numimage`, 
                `(select GROUP_CONCAT(image_imagename) from accelerator_task_image WHERE task_id = accelerator_tasks.task_id and profile_id = accelerator_tasks.profile_id) as imagename`, 
                `task_process_type`, 
                `(select count(media_id) from accelerator_task_doc WHERE task_id = accelerator_tasks.task_id and profile_id = accelerator_tasks.profile_id) as numdocs`, 
                `(select GROUP_CONCAT(media_filename) from accelerator_task_doc WHERE task_id = accelerator_tasks.task_id and profile_id = accelerator_tasks.profile_id) as docname`].join();

    let join = ` inner join accelerator_profile as ap ON accelerator_tasks.profile_id = ap.profile_id
    inner join accelerator_role as ar ON accelerator_tasks.task_role = ar.role_id
    inner join accelerator_project as apro ON accelerator_tasks.project_id = apro.project_id`

    let arg = ` WHERE task_role = 3 and task_status not in ('Done', 'waiting for review')`;

    let groupby = ` GROUP By profile_id, task_folder_name, accelerator_tasks.project_id`;

    await executeSqlQuery(arg, res, 'accelerator_tasks', fields, join, groupby);
});

taskRouter.get('/gettaskbyproject/:projectId', async (req, res) => {
    const projectId = req.params.projectId;
    const condi = `accelerator_tasks.project_id = ${projectId}`;
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id AND accelerator_tasks.task_role = accelerator_profile.profile_role`;
    const sql = `SELECT accelerator_tasks.*, accelerator_profile.profile_username AS profile_username FROM accelerator_tasks INNER JOIN accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id WHERE accelerator_tasks.project_id =${projectId};`
    await runsql(sql, res);

});

/**
 * Created By: Vikas Bose | 10/02/2024
 * REVIEWER STARTED
 */
taskRouter.get('/getreviewername', async (req, res) => {
    let condi = `task_role = 4`
    let join = `accelerator_profile ON accelerator_tasks.reviewer_profile_id = accelerator_profile.profile_id`;
    await gettask(condi, res, 'accelerator_tasks', join);
});

taskRouter.get('/getreviewertask', async (req, res) => {
    const { reviewer_profile_id, project_id } = req.query;
    let fields = [`accelerator_tasks.task_id`, `accelerator_tasks.task_folder_name`, `accelerator_tasks.task_title`, `task_status`, 'reviewer_task_status', 'reviewer_profile_id', `task_mediatype`, `accelerator_tasks.profile_id`, `accelerator_tasks.task_role`, `role_name`, `profile_name`, `profile_email`, `profile_username`, `accelerator_tasks.project_id`, `accelerator_tasks.createdDate`, `count(image_id) as numimage`, `GROUP_CONCAT(image_imagename) as imagename`, `accelerator_tasks.modifiedDate`, `task_process_type`].join()
    let join = ` INNER JOIN accelerator_profile ON accelerator_tasks.reviewer_profile_id = accelerator_profile.profile_id INNER JOIN accelerator_role ON accelerator_tasks.task_role = accelerator_role.role_id INNER JOIN accelerator_task_image ON accelerator_tasks.task_id = accelerator_task_image.task_id`;
    let arg = ` WHERE task_role = 4 and task_status in ('waiting for review')`;
    let groupby = ` GROUP By task_folder_name, accelerator_tasks.project_id, accelerator_task_image.task_id`;
    await gettaskForReviewers(arg, res, 'accelerator_tasks', fields, join, groupby);
});

/**
 * END
 */

taskRouter.delete('/task/:taskid', async (req, res) => {
    const taskid = req.params.taskid;
    await deletetask(` task_id = ${taskid}`, res, 'accelerator_tasks');
});

/**
 * TABLES:: accelerator_tasks, accelerator_profile, accelerator_project
 */
taskRouter.get('/completedtasks', async (req, res) => {
    const condi = `task_status = 'Done'`;
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id INNER JOIN accelerator_project ON accelerator_tasks.project_id = accelerator_project.project_id`
    await gettask(condi, res, 'accelerator_tasks', join);
})
taskRouter.get('/passtasks', async (req, res) => {
    const condi = `task_status = 'Pass'`;
    let join = `accelerator_profile ON accelerator_tasks.profile_id = accelerator_profile.profile_id`
    await gettask(condi, res, 'accelerator_tasks', join);
})
/**
 * Modified By Vikas Bose | 23/02/2024
 */
taskRouter.put('/updatetask/:id', async (req, res) => {
    const { task_status, profile_id, reviewer_profile_id, task_role } = req.body.record;
    let table_task = process.env.TASK;
    let table_task_image = process.env.TASK_IMAGES;
    const task_id = req.params.id;
    const modifiedDate = new Date().toJSON().substring(0, 10);
    if(reviewer_profile_id) {
        sql = ` UPDATE ${table_task} SET task_status = "${task_status}", reviewer_profile_id = "${reviewer_profile_id}", task_role = ${task_role}, modifiedDate = "${modifiedDate}" WHERE task_id = ${task_id} and profile_id = ${profile_id} `;
    } else {
        sql = ` UPDATE ${table_task} SET task_status = "${task_status}", modifiedDate = "${modifiedDate}" WHERE task_id = ${task_id} and profile_id = ${profile_id} `;
    }
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(400).json({ message: "Could not update the task.", error: error });
        } else {
            //res.status(200).json({ message: "Task updated.", rs: result });
            if(reviewer_profile_id) {
                sqlUpdate = ` UPDATE ${table_task_image} SET profile_id = ${reviewer_profile_id} WHERE task_id = ${task_id}`;
                conn.query(sqlUpdate, (error, imgRes) => {
                    if(error) {
                        res.status(400).json({ message: "Could not update the task.", error: error });
                    } else {
                        res.status(200).json({ message: "Task updated.", rs: imgRes });
                    }
                });
            } else {
                res.status(200).json({ message: "Task updated.", rs: result });
            }
        }
    });
});

taskRouter.put('/updatetaskprofile/:profile_id', async (req, res) => {
    const table_name = process.env.TASK;
    const profile_id = req.params.profile_id;
    const modifiedDate = new Date().toJSON().substring(0, 10);

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
});

taskRouter.post('/updateAssignment/:id', async (req, res) => {

    const table_name = process.env.TASK;
    const task_id = req.params.id;
    const modifiedDate = new Date().toJSON().substring(0, 10);
    let taggerId = req.body.record && req.body.record.tagger_id ? `, profile_id = ${req.body.record.assignedTo}` : '';
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
/**
 * created by vikas
 * created date :: 05/02/2024
 */
taskRouter.put('/updatereviewertask/:id', async (req, res) => {
    const { task_status, profile_id, reviewer_profile_id, task_role, reviewer_task_status } = req.body.record;
    let table_task = process.env.TASK;
    let table_task_image = process.env.TASK_IMAGES;
    const task_id = req.params.id;
    const modifiedDate = new Date().toJSON().substring(0, 10);

    const sql = ` UPDATE ${table_task} SET task_status = "${task_status}", task_role = ${task_role}, reviewer_task_status = "${reviewer_task_status}", modifiedDate = "${modifiedDate}" WHERE task_id = ${task_id} and profile_id = ${profile_id} and reviewer_profile_id = ${reviewer_profile_id}`;
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(400).json({ message: "Could not update the task.", error: error });
        } else {
            if(task_status === 'Reassigned') {
                sqlUpdate = ` UPDATE ${table_task_image} SET profile_id = ${profile_id} WHERE task_id = ${task_id}`;
                conn.query(sqlUpdate, (error, imgRes) => {
                    if(error) {
                        res.status(400).json({ message: "Could not update the task.", error: error });
                    } else {
                        res.status(200).json({ message: "Task updated.", rs: imgRes });
                    }
                });
            } else {
                res.status(200).json({ message: "Task updated.", rs: result });
            }
        }
    });
});


/**
 * ==============================================================Bulk Upload functionality ==========================================
 */

/**
 * Created By: Vikas Bose | 11/03/2024
 */
taskRouter.post('/api/excelupload', (req, res) => {
    let uniqueId = shortid.generate();
    try {
        if (!JSON.parse(req.body.excelData) || !Array.isArray(JSON.parse(req.body.excelData))) {
            return res.status(400).json({ message: 'No data uploaded or data is not an array' });
        }

        const dataArray = JSON.parse(req.body.excelData);
        const table_name = process.env.TASK;
        const table_project = process.env.PROJECT;

        /* let sqlProject = ` SELECT project_status FROM ${table_project} WHERE project_name = '${dataArray[0].project_name}'`;
        console.log(sqlProject); */

        let sqlInsert = ` INSERT INTO ${table_name} (task_folder_name, task_title, task_status, reviewer_task_status, project_id, profile_id, numOfItemAssignToTagger, reviewer_profile_id, numOfItemAssignToReviewer, task_mediatype, task_zip_folder_name, task_role, task_process_type, createdDate, modifiedDate)
                        VALUES `;
        dataArray.forEach((v, i, data) => {
            const task_folder_name = data[i].task_folder_name || `folderName_${uniqueId}`;
            const task_title = data[i].task_title || `title_${uniqueId}`;
            const task_status = data[i].task_status || 'To Do';
            const reviewer_task_status = null;
            const project_name = data[i].project_name || '';
            const tagger_profile_name = data[i].assignNameOftaggers || '';
            const numOfItemAssignToTagger = data[i].numOfItemAssignToTagger || 0;
            const reviewer_profile_name = data[i].assignNameOfReviewers || '';
            const numOfItemAssignToReviewer = data[i].numOfItemAssignToReviewer || 0;
            const task_mediatype = data[i].task_mediatype || null;
            const task_zip_folder_name = null;
            const createdDate = data[i].createdDate || new Date().toJSON().substring(0, 10);
            const modifiedDate = data[i].modifiedDate || new Date().toJSON().substring(0, 10);

            sqlInsert +=` ('${task_folder_name}', '${task_title}', '${task_status}', '${reviewer_task_status}', 
                            (SELECT project_id FROM accelerator_project WHERE project_name = '${project_name}'), 
                            (SELECT profile_id FROM accelerator_profile WHERE profile_username = '${tagger_profile_name}'), 
                            ${numOfItemAssignToTagger},
                            (select profile_id from accelerator_profile where profile_username = '${reviewer_profile_name}'),
                            ${numOfItemAssignToReviewer},
                            '${task_mediatype}',
                            '${task_zip_folder_name}',
                            3,
                            'bulk',
                            '${createdDate}',
                            '${modifiedDate}')`;
                if(i < dataArray.length-1) {
                    sqlInsert+= ',';
                }            
        });
        conn.query(sqlInsert, (error, result) => {
            if (error) {
                res.status(400).json({ message: "Could not create tasks.", error: error.sqlMessage });
            } else {
                dataArray.forEach((v, i, arr) => {
                    let sqlSelectProfile  = `SELECT (TRIM(BOTH ',' FROM accelerator_profile.project_id)) as project_id, (SELECT project_id FROM accelerator_project WHERE project_name = '${arr[i].project_name}') as project_id_two FROM accelerator_profile WHERE profile_username = '${arr[i].assignNameOftaggers}'`;
                        conn.query(sqlSelectProfile, (error, resSelectProfile) => {
                            if(error) {
                                console.log(error);
                                return;
                            } else {
                                let projectId = resSelectProfile[0].project_id+','+resSelectProfile[0].project_id_two;
                                let updateProfileSQL = ` UPDATE accelerator_profile SET project_id = '${projectId}' WHERE profile_username = '${arr[i].assignNameOftaggers}' `;
                                conn.query(updateProfileSQL, (error, resUpdateProfile) => {
                                    if(error) {
                                        console.log(error);
                                        return;
                                    } else {
                                        console.log("Profile details updated.");
                                    }
                                });
                            }
                        });
                });
                res.status(200).json({ message: "Task updated.", res: result.statusText });   
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during excel data upload', error: error.message });
    }
});

/**
 * created by vikas
 * created date :: 14/03/2024
 */
taskRouter.delete('/delZipTask', async(req, res) => {
    let reqDetails = req.body.details;
    let projectName = [], taggerName = [];
    reqDetails.map((v, i, arr) => {
        projectName.push(`'${arr[i].project_name}'`);
        taggerName.push(`'${arr[i].assignNameOftaggers}'`);
    });
    deleteSQL = ` DELETE FROM accelerator_tasks WHERE 
        project_id in (SELECT project_id FROM accelerator_project WHERE project_name in (${projectName})) AND 
        profile_id in (SELECT profile_id FROM accelerator_profile WHERE profile_username in (${taggerName}))`;
    //console.log("deleteSQL = ", deleteSQL);
    conn.query(deleteSQL, (error, result) => {
        if(error) {
            res.status(400).json({message:'Delete SQL error', Error: error});
        } else {
            res.status(200).json({message:'Delete succesfully.', resDel: result});
        }
    });
});

/**
 * End
 */


/**
 * ===============================================================Functions =========================================================
 */

/**
 * 
 * @param {*} arg 
 * @param {*} res 
 * @param {*} table_name 
 * @param {*} join 
 */
let gettask = (arg = null, res, table_name = null, join = null) => {
    //task_id, task_title, task_status, profile_id, task_role, createdDate, modifiedDate
    let sql = `SELECT * from ${table_name}`;
    if (join != null) {
        sql += ` INNER JOIN ${join}`;
    }
    if (arg != null) {
        sql += ` WHERE ${arg}`;
    }
    //console.log("SQL=", sql)
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            res.json(result);
        }
    });
};

const runsql = (sql, res) => {
    //task_id, task_title, task_status, profile_id, task_role, createdDate, modifiedDate
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            res.json(result);
        }
    });
};

let deletetask = (arg = null, res, table_name = null) => {
    let sql = `DELETE * FROM ${table_name} WHERE ${arg}`;
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            res.json(result);
        }
    });
};

/**
 * created by vikas
 * created date :: 05/02/2024
 * @param {*} arg 
 * @param {*} res 
 * @param {*} table_name 
 * @param {*} fields 
 * @param {*} join 
 */
let gettaskForReviewers = (arg = null, res, table_name = null, fields = null, join = null, groupby = null) => {
    let sql = `SELECT ${fields} from ${table_name}`;
    if (join != null) {
        sql += ` ${join}`;
    }
    if (arg != null) {
        sql += ` ${arg}`;
    }
    if (groupby != null) {
        sql += ` ${groupby}`;
    }
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            res.json(result);
        }
    });
}

/**
 * created by vikas
 * created date :: 21/02/2024
 * @param {*} arg 
 * @param {*} res 
 * @param {*} table_name 
 * @param {*} fields 
 * @param {*} join 
 */
let executeSqlQuery = (arg = null, res, table_name = null, fields = null, join = null, groupby = null) => {
    let sql = `SELECT ${fields} from ${table_name}`;
    if (join != null) {
        sql += ` ${join}`;
    }
    if (arg != null) {
        sql += ` ${arg}`;
    }
    if (groupby != null) {
        sql += ` ${groupby}`;
    }
   //console.log(sql);
    conn.query(sql, (error, result) => {
        if (error) {
            res.status(404).json({ message: "Data not found.", error: error });
        } else {
            res.json(result);
        }
    });
}

/**
 * 
 * @param {*} last_inserted_id 
 * @param {*} profile_id 
 * @returns 
 */
let executePythonScript = (last_inserted_id, profile_id, numOfIteration) => {
    const { spawn } = require('child_process');
    let runPy = new Promise((resolve, reject) => {
        const pyScript = spawn('python', ['D:/Project - Internal/python-OD/readingContentOfFolder/readingContentOfFolder.py', last_inserted_id, profile_id, numOfIteration]);
            pyScript.stdout.on('data', (data) => {
                resolve(data);
            });
            pyScript.stderr.on('data', (data) => {
                reject(data);
            });
    });
    return runPy;
}

module.exports = taskRouter;
