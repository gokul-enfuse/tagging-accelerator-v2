
require('dotenv').config();
const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'accelerator',
    port: 3306,
    timezone: '+00:00'
});

conn.connect(error => {
    if (error) {
        console.error('Error connecting to MySQL:', error);
        return;
    }
    console.log('Connected to MySQL as id ' + conn.threadId);
});

module.exports = conn;
