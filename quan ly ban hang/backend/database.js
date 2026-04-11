const mysql = require("mysql2");

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "phuxt162005",
  database: "CSDL_quanlybanhang",
});

module.exports = database;
