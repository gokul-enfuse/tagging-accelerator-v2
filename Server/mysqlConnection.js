const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
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
