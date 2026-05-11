const mysql = require("mysql2");

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "phuxt162005",
  database: "CSDL_quanlybanhang",
});

database.connect((err) => {
  if (err) {
    console.log("Không kết nối được CSDL:", err);
  } else {
    console.log("Kết nối CSDL thành công");
  }
});

database.on("error", (err) => {
  console.log("Database error:", err);
});

module.exports = database;
