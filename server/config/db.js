const mysql = require('mysql');

const db = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '6632',
  database: 'management',
});

module.exports = db;