const mysql = require('mysql');
require('dotenv').config(); // npm install dotenv --save

const db = mysql.createPool({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
});

module.exports = db;

