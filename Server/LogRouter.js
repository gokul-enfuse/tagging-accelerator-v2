const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const logRouter = express.Router();
logRouter.use(express.json());
let fs = require('fs');
const path = require('path');

/**
 * ==============================================================Log Error functionality ==========================================
 */

/**
 * Created By: Mayur Patil | 30/08/2024
 */
taskRouter.post('/api/logs', (req, res) => {
    const { logFileName, ...logMessage } = req.body;

    // Generate file name based on today's date
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const logPath = path.join(__dirname, 'logs', `tagging_${datePart}.log`);
    // Log message with timestamp
    const logEntry = `[${logMessage.timestamp}] ${logMessage.name}: ${logMessage.message}\nStack Trace:\n${logMessage.stack}\n\n`;

    // Check if the log file exists
    fs.access(logPath, fs.constants.F_OK, (err) => {
        if (err) {
        // File does not exist, so create and write to it
        fs.writeFile(logPath, logEntry, (err) => {
            if (err) {
            console.error("Failed to create log file:", err);
            return res.status(500).send("Failed to create log file");
            }
            res.send("Log file created and log saved");
        });
        } else {
        // File exists, append the log entry
        fs.appendFile(logPath, logEntry, (err) => {
            if (err) {
            console.error("Failed to append to log file:", err);
            return res.status(500).send("Failed to append to log file");
            }
            res.send("Log saved");
        });
        }
    });
});

/**
 * End
 */


/**
 * ===============================================================Functions =========================================================
 */