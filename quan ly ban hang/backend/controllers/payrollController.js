const database = require("../database");

const createPayroll = (req, res) => {
  const { employeeId, basicSalary, month, year, bonus, deduction } = req.body;

  // validate
  if (!employeeId || !month || !year) {
    return res.status(400).json({
      message: "Thiếu thông tin bảng lương",
    });
  }

  const totalSalary =
    Number(basicSalary || 0) + Number(bonus || 0) - Number(deduction || 0);

  // check payroll đã tồn tại chưa
  const checkSql = `
    SELECT *
    FROM Payroll
    WHERE employeeId=? AND month=? AND year=?`;

  database.query(checkSql, [employeeId, month, year], (checkErr, rows) => {
    if (checkErr) {
      return res.status(500).json({
        message: checkErr.sqlMessage,
      });
    }

    // ======================
    // ĐÃ TỒN TẠI -> UPDATE
    // ======================
    if (rows.length > 0) {
      const updateSql = `
          UPDATE Payroll
          SET
            basicSalary=?,
            bonus=?,
            deduction=?,
            totalSalary=?,
            paymentDate=NOW()
          WHERE employeeId=? AND month=? AND year=?`;

      database.query(
        updateSql,
        [
          basicSalary || 0,
          bonus || 0,
          deduction || 0,
          totalSalary,
          employeeId,
          month,
          year,
        ],
        (updateErr, result) => {
          if (updateErr) {
            return res.status(500).json({
              message: updateErr.sqlMessage,
            });
          }

          return res.json({
            message: "Cập nhật lương thành công",
          });
        },
      );
    }

    // ======================
    // CHƯA CÓ -> INSERT
    // ======================
    const insertSql = `
        INSERT INTO Payroll(
          employeeId,
          month,
          year,
          basicSalary,
          bonus,
          deduction,
          totalSalary,
          paymentDate
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, NOW())`;

    database.query(
      insertSql,
      [
        employeeId,
        month,
        year,
        basicSalary || 0,
        bonus || 0,
        deduction || 0,
        totalSalary,
      ],
      (insertErr, result) => {
        if (insertErr) {
          return res.status(500).json({
            message: insertErr.sqlMessage,
          });
        }

        res.json({
          message: "Thêm lương thành công",
        });
      },
    );
  });
};

module.exports = {
  createPayroll,
};
