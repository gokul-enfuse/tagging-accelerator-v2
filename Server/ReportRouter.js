const express = require('express');
const conn = require('./mysqlConnection');
const fs = require('fs');
const util = require('util');

const reportRecRouter = express.Router();

reportRecRouter.get('/api/report-result', async (req, res) => {
    let table_report = `accelerator_report`;
    let fields = [`report_id`, `task_id`, `task_folder_name`, `task_status`, `project_name`, `tagger_name as tagger`, `reviewer_name as reviewer`, `task_mediatype`, `task_process_type`, `image_json_data`, `createdDate`];
    let condi = ` task_status = 'completed'`;
    
    await getReportRec(res, table_report, fields, null, condi);
});

reportRecRouter.get('/api/download-report', async(req, res) => {
    let table_report = `accelerator_report`;
    let fields = ['image_json_data']
})


const getReportRec = (response, tablename, fields, join=null, condition=null) => {
    let sqlSelect = ` SELECT ${fields} FROM ${tablename}`;
        if(join!=null) {
            sqlSelect+= ` ${join}`;
        }
        if(condition!=null) {
            sqlSelect+= ` WHERE ${condition}`;
        }
    conn.query(sqlSelect, (error, result) => {
        if(error) {
            response.status(404).json({ message: "Data not found.", error: error });
        } else {
            try {
                result.map((arr, i) => {
                    fs.access(`${process.env.ACCELERATORREPORTS}/Report${result[i].report_id}${result[i].task_id}${result[i].project_name}.json`, fs.constants.F_OK, (error) => {
                        if(error) {
                            fs.writeFileSync(`${process.env.ACCELERATORREPORTS}/Report${result[i].report_id}${result[i].task_id}${result[i].project_name}.json`, JSON.stringify(result[i].image_json_data), { flag: 'wx' }, function (err) {
                                if(err) throw err;
                                console.log("It's saved!");
                            });
                        } else {
                            console.log('File already exists. No action taken.');
                        }
                    })           
                });                
            }catch(error) {
                console.error(error);
            }
            response.json(result);
        }
    });
};

module.exports = reportRecRouter;
