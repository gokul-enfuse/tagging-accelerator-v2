let express = require('express');
let multer = require("multer");
let fs = require("fs");
let shortid = require("shortid");
const { ChildProcess } = require('child_process');
const conn = require('./mysqlConnection');
let { exec } = require("child_process");

let commRouters = express.Router();

const upload = multer({dest: process.env.TAGGINGDOCSERVERPATH});

commRouters.post('/api/commzipextraction', upload.single('zipFileDoc'), async(req, res) => {
    try {
        const commAdditionalPath = `${shortid.generate()}_extracted`;
        const commZipFilePath = req.file.path;
        const commExtractionPath = `${process.env.TAGGINGDOCSERVERPATH}/${commAdditionalPath}`;
        //pyhton script run
        const pythonScriptPath = `${process.env.ACCELERATORUTILSPATH}/unziptheFolder.py`;
        const command = `python "${pythonScriptPath}" "${commZipFilePath}" "${commExtractionPath}"`;
        exec(command, (error, stdout, stderr) => {
            if(error) {
                console.error(`Error executing Python script: ${error}`);
                return;
            }
            if(stdout) {
                const table_task = process.env.TASK;
                const dataArray = JSON.parse(req.body.body);
                const assignNameOftaggersArr = [], projectNameArr = [], taskMediaType = [], folderName = [];
                const folder_path = commExtractionPath;
                const folderData = fs.readdirSync(folder_path).map(arr => arr);
                
                new Promise((resolve, reject) => {
                    if(dataArray)
                        resolve(dataArray);
                    else
                        reject()
                }).then(resone => {
                    //console.log(resone)
                    resone.forEach((v, i, arr) => {
                        let updateSQL = ` UPDATE ${table_task} SET task_zip_folder_name = '${commAdditionalPath}' WHERE 
                          profile_id = (SELECT profile_id FROM accelerator_profile WHERE profile_username = '${arr[i].assignNameOftaggers}') 
                          and project_id = (SELECT project_id FROM accelerator_project WHERE project_name = '${arr[i].project_name}') 
                          and task_mediatype = '${arr[i].task_mediatype}' `;
                          conn.query(updateSQL, (error, result) => {
                              if(error) {
                                  res.status(400).json({message: 'Update SQL error', Error: error});
                               }
                          });
                          assignNameOftaggersArr.push(`'${arr[i].assignNameOftaggers}'`);
                          projectNameArr.push(`'${arr[i].project_name}'`);
                          folderName.push(`'${commAdditionalPath}'`);
                          taskMediaType.push(`${arr[i].task_mediatype}`)
                      });
                      return folderName;
                }).then(folderName => {
                    let sqlSelect = ` SELECT count(profile_id) as profileCount, GROUP_CONCAT(profile_id) as id FROM accelerator_profile WHERE profile_username in (${assignNameOftaggersArr.join()})`;
                    conn.query(sqlSelect, (error, result) => {
                        if(error) {
                            res.status(400).json({message: 'You have an error in your SQL syntax.', Error: error});
                        } else {
                            console.log(taskMediaType);
                            const numRecords = folderData.length || 10;
                            const numPersons = result[0].profileCount || 3;
                            const keys = result[0].id.split(',');
                            const distribution = distributeRecords(numRecords, numPersons, keys);
                            console.log("Records distribution:", distribution);
                            let table_name_arr = ['accelerator_task_doc', 'accelerator_task_audio', 'accelerator_task_video'];
                            let table_name = (taskMediaType[0] === 'doc')? table_name_arr[0] : table_name_arr[1];
                            let j = 0;
                            distribution.map((v, i, arr) => {
                                let insertSQL = ` INSERT INTO ${table_name} (task_id, profile_id, media_filename, media_filepath) VALUES `;
                                    for(let i=0; i<Object.values(v); i++) {
                                    insertSQL+= `((select task_id from accelerator_tasks where profile_id = ${Object.keys(v)} and task_zip_folder_name=${folderName[0]} and task_freezz = 0 and task_mediatype='${taskMediaType[0]}' order by task_id LIMIT 0, 1),
                                        ${Object.keys(v)}, 
                                        '${folderData[j]}', 
                                        '${commExtractionPath}/${folderData[j]}') `;
                                        if(i < Object.values(v) - 1) {
                                        insertSQL+= ',';
                                        }
                                    j=j+1;
                                    }
                                // console.log("insertSQL = ", insertSQL);
                                conn.query(insertSQL, (error, result) => {
                                    if(error) {
                                        console.log({message: 'Insert SQL error.', Error: error});
                                        return;
                                    } else {
                                        let updateSQLTaskFreez = ` UPDATE ${table_task} SET task_freezz = 1 WHERE profile_id = ${Object.keys(v)} and task_zip_folder_name = ${folderName[0]} and task_mediatype='${taskMediaType[0]}' `;
                                        conn.query(updateSQLTaskFreez, (error, result) => {
                                            if(error) {
                                                res.status(400).json({message: 'Update SQL error', Error: error});
                                            } else {
                                                console.log("Insert SQL executed.");
                                            }
                                        });
                                    }
                                });
                            });
                            res.send('ZIP file uploaded, extracted, and details stored successfully.');
                        }  
                    });
                }).catch(error => {
                    console.log(error);
                })
            } else {//End stdout
                console.log('Errors ::', stderr);
            }
        })
    }catch(error) {
        console.log(error);
    }
});


/**
 * ======================================================================Functions
 */
/**
 * Created By: Vikas Bose | 24/04/2024
 * @param {*} numRecords 
 * @param {*} numPersons 
 * @param {*} keys 
 * @returns 
 */
function distributeRecords(numRecords, numPersons, keys) {
    const recordsPerPerson = Math.floor(numRecords / numPersons);
    const extraRecords = numRecords % numPersons;
    const distribution = [];
    let recordsLeft = numRecords;
    let a = keys || [26, 29, 30];

    for(let i=0; i<numPersons; i++) {
        let obj = {};
        const recordsToAssign = recordsPerPerson + (i < extraRecords ? 1 : 0);
        obj[a[i]] = recordsToAssign;
        distribution.push(obj);
        recordsLeft -= recordsToAssign;
    }
    return distribution;
} //End Function

module.exports = commRouters;
