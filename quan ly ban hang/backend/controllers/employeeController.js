b;
const database = require("../database");

// lấy nhân viên
const getEmployees = (req, res) => {
  const sql = `
    SELECT e.*, u.username, u.password, u.role, p.basicSalary, p.month, p.year
    FROM Employee e
    LEFT JOIN User u ON e.employeeId = u.employeeId
    LEFT JOIN Payroll p
    ON p.payrollId = (
      SELECT payrollId
      FROM Payroll
      WHERE employeeId = e.employeeId
      ORDER BY year DESC, month DESC
      LIMIT 1)`;

  database.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

// thêm nhân viên
const createEmployee = (req, res) => {
  const { name, dob, phone, branchId, username, password, role } = req.body;

  const sqlEmployee = `INSERT INTO Employee (name, dob, phone, branchId) VALUES (?, ?, ?, ?)`;

  database.query(sqlEmployee, [name, dob, phone, branchId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    const employeeId = result.insertId;

    // nếu có account
    if (username && password) {
      const sqlUser = `INSERT INTO User(username, password, role, employeeId) VALUES (?, ?, ?, ?)`;

      database.query(
        sqlUser,
        [username, password, role || "employee", employeeId],
        (err2) => {
          if (err2) {
            return res.status(500).json(err2);
          }

          res.json({
            message: "Thêm account thành công",
            employeeId,
          });
        },
      );
    } else {
      res.json({
        message: "Thêm nhân viên thành công",
        employeeId,
      });
    }
  });
};

// sửa nhân viên
const updateEmployee = (req, res) => {
  const { id } = req.params;

  const { name, dob, phone, branchId, username, password, role } = req.body;

  const sqlEmployee = `UPDATE Employee SET name=?, dob=?, phone=?, branchId=? WHERE employeeId=?`;

  database.query(sqlEmployee, [name, dob, phone, branchId, id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    // check user
    database.query(
      `SELECT * FROM User WHERE employeeId=?`,
      [id],
      (checkErr, users) => {
        if (checkErr) {
          return res.status(500).json(checkErr);
        }

        // đã tồn tại
        if (users.length > 0) {
          const sqlUser = `UPDATE User SET username=?, password=?, role=? WHERE employeeId=?`;

          database.query(sqlUser, [username, password, role, id], (err2) => {
            if (err2) {
              return res.status(500).json(err2);
            }

            res.json({
              message: "Cập nhật nhân viên thành công",
            });
          });
        }

        // chưa có account
        else {
          const insertUser = `INSERT INTO User(username, password, role, employeeId) VALUES (?, ?, ?, ?)`;

          database.query(
            insertUser,
            [username, password, role || "employee", id],
            (err3) => {
              if (err3) {
                return res.status(500).json(err3);
              }

              res.json({
                message: "Cập nhật nhân viên thành công",
              });
            },
          );
        }
      },
    );
  });
};

// xóa nhân viên
const deleteEmployee = (req, res) => {
  const { id } = req.params;

  database.query(`DELETE FROM Employee WHERE employeeId=?`, [id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Xóa nhân viên thành công",
    });
  });
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
