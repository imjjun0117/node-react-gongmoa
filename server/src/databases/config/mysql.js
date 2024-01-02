const mysql = require('mysql2');
const db = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '1q2w3e$R',
    database : 'gongmoa',
    port : '3306'
  });

  db.connect();

  module.exports = db;