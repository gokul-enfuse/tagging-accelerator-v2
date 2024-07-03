const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'accelerator',
    port: 3306
});
 
conn.connect(error => {
   if (error) {
      console.log("Error: ", error);
   } else {
      console.log("mysql DB connected!");
   }
});

module.exports = conn;
