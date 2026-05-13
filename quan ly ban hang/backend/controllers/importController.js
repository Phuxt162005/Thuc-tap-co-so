const database = require("../database");

// lấy lịch sử nhập
const getImports = (req, res) => {
  const sql = `
    SELECT
      i.importId,
      i.productId,
      i.quantity,
      i.branchId,
      i.importDate,
      p.name,
      p.image,
      p.importUnitPrice,
      (i.quantity * p.importUnitPrice) AS totalPrice
    FROM ImportHistory i
    JOIN Product p
      ON i.productId = p.productId
    ORDER BY i.importDate DESC
  `;

  database.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Lỗi lấy lịch sử nhập",
      });
    }

    res.json(result);
  });
};

// thêm nhập kho
const createImport = (req, res) => {
  const { productId, quantity, totalPrice, branchId } = req.body;

  // validate
  if (!productId || !quantity || !branchId) {
    return res.status(400).json({
      message: "Thiếu thông tin nhập kho",
    });
  }

  const sql = `INSERT INTO ImportHistory(productId, quantity, totalPrice, branchId, importDate)
    VALUES(?, ?, ?, ?, NOW())`;

  database.query(
    sql,
    [productId, quantity, totalPrice, branchId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Lỗi lưu lịch sử nhập",
        });
      }

      // check insert
      if (result.affectedRows === 0) {
        return res.status(400).json({
          message: "Không thể lưu lịch sử nhập",
        });
      }

      res.json({
        message: "Lưu lịch sử nhập thành công",
      });
    },
  );
};

module.exports = { getImports, createImport };
