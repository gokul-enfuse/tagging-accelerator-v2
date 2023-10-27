// const express = require('express');
// const mysql = require('mysql');
// const app = express();


// // Create a MySQL connection
// const dbConnection = mysql.createConnection({
//     host: 'localhost',
//     // port: 3307,
//     user: 'root',
//     password: '',
//     database: 'accelerator'
// });

// // Connect to the MySQL database
// dbConnection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL');

//     // Function to run the initial query
//     function runInitialQuery() {
//         const table_name = 'app1url';
//         const appName = 'tagging-tool';
//         const appPort = 1
//        // const appPort = '3002'; // You should set the appropriate value for appPort
//         const sql = `INSERT INTO ${table_name} (appName, appPort) VALUES (?, ?)`;
//         const values = [appName, appPort];

//         dbConnection.query(sql, values, (error, result) => {
//             if (error) {
//                 console.error('Error executing initial query:', error);
//             } else {
//                 console.log('Initial query executed successfully');
//             }
//         });
//     }

//     // Call the function to run the initial query
//     runInitialQuery();

//     // Start the server
//     // const port = 3002;
//     // app.listen(port, () => {
//     //     console.log(`Server is running on http://localhost:${port}`);
//     // });
// });
