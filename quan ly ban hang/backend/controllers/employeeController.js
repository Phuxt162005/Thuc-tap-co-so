const database = require("../database");

// lấy nhân viên
const getEmployees = (req, res) => {
  const sql = `
    SELECT e.*, u.username, u.password, u.role,
           p.basicSalary, p.month, p.year
    FROM Employee e
    LEFT JOIN \`User\` u
      ON e.employeeId = u.employeeId
    LEFT JOIN Payroll p
      ON p.payrollId = (
        SELECT payrollId
        FROM Payroll
        WHERE employeeId = e.employeeId
        ORDER BY year DESC, month DESC
        LIMIT 1
      )`;

  database.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.sqlMessage,
      });
    }

    res.json(result);
  });
};

const createEmployee = (req, res) => {
  const { name, dob, phone, branchId, username, password, role } = req.body;

  if (!name || !dob || !branchId) {
    return res.status(400).json({
      message: "Vui lòng nhập đầy đủ thông tin",
    });
  }

  // admin tạo account -> check username trước
  if (username && password) {
    database.query(
      `SELECT * FROM \`User\` WHERE username=?`,
      [username],
      (checkErr, users) => {
        if (checkErr) {
          return res.status(500).json({
            message: checkErr.sqlMessage,
          });
        }

        // username đã tồn tại
        if (users.length > 0) {
          return res.status(400).json({
            message: "Username đã tồn tại",
          });
        }

        // username hợp lệ -> tạo employee
        insertEmployee();
      },
    );
  } else {
    // manager tạo nhân viên không account
    insertEmployee();
  }

  // function tạo employee
  function insertEmployee() {
    const sqlEmployee = `
      INSERT INTO Employee(name, dob, phone, branchId)
      VALUES (?, ?, ?, ?)`;

    database.query(sqlEmployee, [name, dob, phone, branchId], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.sqlMessage,
        });
      }

      const employeeId = result.insertId;

      // không có account
      if (!username || !password) {
        return res.json({
          message: "Thêm nhân viên thành công",
          employeeId,
        });
      }

      // tạo account
      database.query(
        `INSERT INTO \`User\`
          (username, password, role, employeeId)
          VALUES (?, ?, ?, ?)`,
        [username, password, role || "employee", employeeId],
        (err2) => {
          if (err2) {
            return res.status(500).json({
              message: err2.sqlMessage,
            });
          }

          res.json({
            message: "Thêm account thành công",
            employeeId,
          });
        },
      );
    });
  }
};

// sửa nhân viên
const updateEmployee = (req, res) => {
  const { id } = req.params;

  const { name, dob, phone, branchId, username, password, role } = req.body;

  if (!name || !dob || !branchId) {
    return res.status(400).json({
      message: "Vui lòng nhập đầy đủ thông tin",
    });
  }

  const sqlEmployee = `
    UPDATE Employee
    SET name=?, dob=?, phone=?, branchId=?
    WHERE employeeId=?`;

  database.query(
    sqlEmployee,
    [name, dob, phone, branchId, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.sqlMessage,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Nhân viên không tồn tại",
        });
      }

      // manager sửa
      if (!username && !password) {
        return res.json({
          message: "Cập nhật nhân viên thành công",
        });
      }

      // check username trùng
      database.query(
        `SELECT * FROM \`User\`
         WHERE username=? AND employeeId != ?`,
        [username, id],
        (checkErr, existedUsers) => {
          if (checkErr) {
            return res.status(500).json({
              message: checkErr.sqlMessage,
            });
          }

          if (existedUsers.length > 0) {
            return res.status(400).json({
              message: "Username đã tồn tại",
            });
          }

          database.query(
            `SELECT * FROM \`User\` WHERE employeeId=?`,
            [id],
            (userErr, users) => {
              if (userErr) {
                return res.status(500).json({
                  message: userErr.sqlMessage,
                });
              }

              // update user
              if (users.length > 0) {
                database.query(
                  `UPDATE \`User\`
                   SET username=?, password=?, role=?
                   WHERE employeeId=?`,
                  [username, password, role, id],
                  (err2) => {
                    if (err2) {
                      return res.status(500).json({
                        message: err2.sqlMessage,
                      });
                    }

                    res.json({
                      message: "Cập nhật nhân viên thành công",
                    });
                  },
                );
              }

              // insert user
              else {
                database.query(
                  `INSERT INTO \`User\`
                  (username, password, role, employeeId)
                  VALUES (?, ?, ?, ?)`,
                  [username, password, role || "employee", id],
                  (err3) => {
                    if (err3) {
                      return res.status(500).json({
                        message: err3.sqlMessage,
                      });
                    }

                    res.json({
                      message: "Cập nhật nhân viên thành công",
                    });
                  },
                );
              }
            },
          );
        },
      );
    },
  );
};

// xóa nhân viên
const deleteEmployee = (req, res) => {
  const { id } = req.params;

  database.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    database.query(
      `DELETE FROM Payroll WHERE employeeId=?`,
      [id],
      (payrollErr) => {
        if (payrollErr) {
          return database.rollback(() => {
            res.status(500).json({
              message: payrollErr.sqlMessage,
            });
          });
        }

        database.query(
          `DELETE FROM \`User\` WHERE employeeId=?`,
          [id],
          (userErr) => {
            if (userErr) {
              return database.rollback(() => {
                res.status(500).json({
                  message: userErr.sqlMessage,
                });
              });
            }

            database.query(
              `DELETE FROM Employee WHERE employeeId=?`,
              [id],
              (employeeErr, result) => {
                if (employeeErr) {
                  return database.rollback(() => {
                    res.status(500).json({
                      message: employeeErr.sqlMessage,
                    });
                  });
                }

                if (result.affectedRows === 0) {
                  return database.rollback(() => {
                    res.status(404).json({
                      message: "Nhân viên không tồn tại",
                    });
                  });
                }

                database.commit((commitErr) => {
                  if (commitErr) {
                    return database.rollback(() => {
                      res.status(500).json({
                        message: commitErr.message,
                      });
                    });
                  }

                  res.json({
                    message: "Xóa nhân viên thành công",
                  });
                });
              },
            );
          },
        );
      },
    );
  });
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
