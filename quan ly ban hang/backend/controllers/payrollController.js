const database = require("../database");

const createPayroll = (req, res) => {
  const { employeeId, basicSalary, month, year, bonus, deduction } = req.body;

  const totalSalary =
    Number(basicSalary || 0) + Number(bonus || 0) - Number(deduction || 0);

  const sql = `INSERT INTO Payroll(employeeId, month, year, basicSalary, bonus, deduction, totalSalary, paymentDate)
    VALUES(?, ?, ?, ?, ?, ?, ?, NOW())`;

  database.query(
    sql,
    [
      employeeId,
      month,
      year,
      basicSalary,
      bonus || 0,
      deduction || 0,
      totalSalary,
    ],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Cập nhật lương thành công",
      });
    },
  );
};

module.exports = { createPayroll };
