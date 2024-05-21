let express = require('express');
let multer = require('multer');
let unzipper = require('unzipper');
let fs = require('fs');
const conn = require('./mysqlConnection');
let shortid = require('shortid');
const { exec } = require('child_process');

let routers = express.Router();

// Set up multer for handling file uploads
const upload = multer({ dest: process.env.TAGGINGSERVERPATH });

// Handle file upload
routers.post('/zipextraction-old', upload.single('zipFile'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }
console.log(file)
  // Extract the uploaded zip file
  const additionalPath = `${shortid.generate()}_extracted`;
  const extractPath = `${process.env.TAGGINGSERVERPATH}/${additionalPath}`;
  fs.createReadStream(file.path)
    .pipe(unzipper.Extract({ path: extractPath }))
    .on('close', () => {
      const table_name = process.env.TASK;
      const dataArray = JSON.parse(req.body.body);
      const assignNameOftaggersArr = [], projectNameArr = [], folderName = [];
      const folder_path = extractPath;
      const folderData = fs.readdirSync(folder_path).map(arr => arr);

      new Promise((resolve, reject) => {
        if(dataArray)
            resolve(dataArray);
        else 
            reject();
      }).then((resone) => {
          resone.forEach((v, i, arr) => {
            let updateSQL = ` UPDATE ${table_name} SET task_zip_folder_name = '${additionalPath}' WHERE 
              profile_id = (SELECT profile_id FROM accelerator_profile WHERE profile_username = '${arr[i].assignNameOftaggers}') 
              and project_id = (SELECT project_id FROM accelerator_project WHERE project_name = '${arr[i].project_name}') `;
              conn.query(updateSQL, (error, result) => {
                  if(error) {
                      res.status(400).json({message: 'Update SQL error', Error: error});
                    }
              });
              assignNameOftaggersArr.push(`'${arr[i].assignNameOftaggers}'`);
              projectNameArr.push(`'${arr[i].project_name}'`);
              folderName.push(`'${additionalPath}'`);
          });
          return folderName;
      }).then((folderName) => {
        let sqlSelect = ` SELECT count(profile_id) as profileCount, GROUP_CONCAT(profile_id) as id FROM accelerator_profile WHERE profile_username in (${assignNameOftaggersArr.join()})`;
         conn.query(sqlSelect, (error, result) => {
            if(error) {
               res.status(400).json({message: 'You have an error in your SQL syntax.', Error: error});
            } else {
               const numRecords = folderData.length || 10;
               const numPersons = result[0].profileCount || 3;
               const keys = result[0].id.split(',');
               const distribution = distributeRecords(numRecords, numPersons, keys);
               console.log("Records distribution:", distribution);
               let j = 0;
               distribution.map((v, i, arr) => {
                   let insertSQL = ` INSERT INTO accelerator_task_image (task_id, profile_id, image_imagename, image_imagepath) VALUES `;
                      for(let i=0; i<Object.values(v); i++) {
                        insertSQL+= `((select task_id from accelerator_tasks where profile_id = ${Object.keys(v)} and task_zip_folder_name=${folderName[0]} and task_freezz = 0),
                           ${Object.keys(v)}, 
                           '${folderData[j]}', 
                           '${extractPath}/${folderData[j]}') `;
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
                           let updateSQLTaskFreez = ` UPDATE ${table_name} SET task_freezz = 1 WHERE profile_id = ${Object.keys(v)} and task_zip_folder_name = ${folderName[0]} `;
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
               res.send('File uploaded and extracted successfully');
            }  
          });
      }).catch(error => {
         console.log(error);
      });
    })
    .on('error', (err) => {
      console.error('Error extracting zip file:', err);
      res.status(500).send('Error extracting zip file');
    });
});

routers.post('/zipextraction', upload.single('zipFile'), async (req, res) => {
  try {
    // Extract ZIP file
    const additionalPath = `${shortid.generate()}_extracted`;
    const zipFilePath = req.file.path;
    const extractionPath = `${process.env.TAGGINGSERVERPATH}/${additionalPath}`;
    // Python script to run
    const pythonScriptPath = `${process.env.ACCELERATORUTILSPATH}/unziptheFolder.py`;
    const command = `python "${pythonScriptPath}" "${zipFilePath}" "${extractionPath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        return;
      }      
      // Output from the Python script
      console.log('Output:', stdout);
      if(stdout) {
        const table_name = process.env.TASK;
        const dataArray = JSON.parse(req.body.body);
        const assignNameOftaggersArr = [], projectNameArr = [], taskMediaType = [], folderName = [];
        const folder_path = extractionPath;
        const folderData = fs.readdirSync(folder_path).map(arr => arr);

        new Promise((resolve, reject) => {
          if(dataArray)
              resolve(dataArray);
          else 
              reject();
        }).then((resone) => {
            resone.forEach((v, i, arr) => {
              let updateSQL = ` UPDATE ${table_name} SET task_zip_folder_name = '${additionalPath}' WHERE 
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
                folderName.push(`'${additionalPath}'`);
                taskMediaType.push(`'${arr[i].task_mediatype}'`);
            });
            return folderName;
        }).then((folderName) => {
          let sqlSelect = ` SELECT count(profile_id) as profileCount, GROUP_CONCAT(profile_id) as id FROM accelerator_profile WHERE profile_username in (${assignNameOftaggersArr.join()})`;
           conn.query(sqlSelect, (error, result) => {
              if(error) {
                 res.status(400).json({message: 'You have an error in your SQL syntax.', Error: error});
              } else {
                 const numRecords = folderData.length || 10;
                 const numPersons = result[0].profileCount || 3;
                 const keys = result[0].id.split(',');
                 const distribution = distributeRecords(numRecords, numPersons, keys);
                // console.log("Records distribution:", distribution);
                 let j = 0;
                 distribution.map((v, i, arr) => {
                     let insertSQL = ` INSERT INTO accelerator_task_image (task_id, profile_id, image_imagename, image_imagepath) VALUES `;
                        for(let i=0; i<Object.values(v); i++) {
                          insertSQL+= `((select task_id from accelerator_tasks where profile_id = ${Object.keys(v)} and task_zip_folder_name=${folderName[0]} and task_freezz = 0 and task_mediatype='image' and  task_process_type='bulk'),
                             ${Object.keys(v)}, 
                             '${folderData[j]}', 
                             '${extractionPath}/${folderData[j]}') `;
                            if(i < Object.values(v) - 1) {
                               insertSQL+= ',';
                            }
                          j=j+1;
                        }
                      conn.query(insertSQL, (error, result) => {
                          if(error) {
                             console.log({message: 'Insert SQL error.', Error: error});
                             return;
                          } else {
                             let updateSQLTaskFreez = ` UPDATE ${table_name} SET task_freezz = 1 WHERE profile_id = ${Object.keys(v)} and task_zip_folder_name = ${folderName[0]} and task_mediatype='image' and  task_process_type='bulk'`;
                              conn.query(updateSQLTaskFreez, (error, result) => {
                                  if(error) {
                                      console.error({message: 'Update SQL error', Error: error});
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
        });
      } else {
         // Any errors reported by Python script
          console.error('Errors:', stderr);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error uploading and extracting ZIP file.');
  }
});

routers.get('/bulkuploadcheck', async(req, res) => {
  console.log(req.query.args);
   let projectName = req.query.args;
   let sqlbulkupload = `SELECT project_status FROM accelerator_project WHERE project_name = '${projectName}'`;
   console.log(sqlbulkupload);
   conn.query(sqlbulkupload, (error, result) => {
       if(error) {
          res.status(400).json({message: 'SQL query issue!', error: error});
       } else {
          res.status(200).json({message: 'Return the project status.', resargs: result[0]});
       }
   });
});

/**
 * Created By: Vikas Bose | 12/03/2024
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
  
  let a = keys || [26, 29, 34];
  for (let i = 0; i < numPersons; i++) {
      let obj = {};
      const recordsToAssign = recordsPerPerson + (i < extraRecords ? 1 : 0);
      obj[a[i]] = recordsToAssign;
      distribution.push(obj);
      recordsLeft -= recordsToAssign;
  }
  return distribution;
}

module.exports = routers;
