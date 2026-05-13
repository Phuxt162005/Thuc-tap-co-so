const database = require("../database");

// lấy sản phẩm
const getProducts = (req, res) => {
  const sql = "SELECT * FROM Product";

  database.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Lỗi server",
      });
    }

    res.json(result);
  });
};

// thêm sản phẩm
const createProduct = (req, res) => {
  const { name, price, stock, categoryId, image, importUnitPrice, branchId } =
    req.body;

  // validate
  if (!name || !price || stock === undefined || !branchId) {
    return res.status(400).json({
      message: "Thiếu thông tin sản phẩm",
    });
  }

  const totalImported = Number(stock || 0);
  const importPrice = Number(importUnitPrice || 0) * totalImported;

  const sql = `INSERT INTO Product
    (name, price, stock, categoryId, image, importUnitPrice, totalImported, importPrice, branchId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  database.query(
    sql,
    [
      name,
      price,
      stock,
      categoryId || 1,
      image || "",
      importUnitPrice || 0,
      totalImported,
      importPrice,
      branchId,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      // check insert
      if (result.affectedRows === 0) {
        return res.status(400).json({
          message: "Không thể thêm sản phẩm",
        });
      }

      const productId = result.insertId;

      // tạo lịch sử nhập
      if (Number(stock) > 0) {
        const importSql = `INSERT INTO ImportHistory
          (productId, quantity, totalPrice, branchId, importDate)
          VALUES (?, ?, ?, ?, NOW())`;

        database.query(
          importSql,
          [productId, stock, importPrice, branchId],
          (importErr) => {
            if (importErr) {
              return res.status(500).json({
                message: "Lỗi lưu lịch sử nhập",
              });
            }

            res.json({
              message: "Thêm sản phẩm thành công",
            });
          },
        );
      } else {
        res.json({
          message: "Thêm sản phẩm thành công",
        });
      }
    },
  );
};

// sửa
const updateProduct = (req, res) => {
  const { id } = req.params;

  const {
    name,
    price,
    stock,
    image,
    importUnitPrice,
    totalImported,
    branchId,
  } = req.body;

  // validate
  if (!name || !price || stock === undefined || !branchId) {
    return res.status(400).json({
      message: "Thiếu thông tin cập nhật",
    });
  }

  const importPrice = Number(importUnitPrice || 0) * Number(totalImported || 0);

  const sql = `UPDATE Product
    SET name=?, price=?, stock=?, image=?, importUnitPrice=?, totalImported=?, importPrice=?, branchId=?
    WHERE productId=?`;

  database.query(
    sql,
    [
      name,
      price,
      stock,
      image || "",
      importUnitPrice || 0,
      totalImported || 0,
      importPrice,
      branchId,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      // check update
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm",
        });
      }

      res.json({
        message: "Cập nhật sản phẩm thành công",
      });
    },
  );
};

// xóa
const deleteProduct = (req, res) => {
  const { id } = req.params;

  database.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    // xóa lịch sử nhập
    database.query(
      `DELETE FROM ImportHistory WHERE productId=?`,
      [id],
      (importErr) => {
        if (importErr) {
          return database.rollback(() => {
            res.status(500).json({
              message: importErr.sqlMessage,
            });
          });
        }

        // xóa sản phẩm
        database.query(
          `DELETE FROM Product WHERE productId=?`,
          [id],
          (productErr, result) => {
            if (productErr) {
              return database.rollback(() => {
                res.status(500).json({
                  message: productErr.sqlMessage,
                });
              });
            }

            if (result.affectedRows === 0) {
              return database.rollback(() => {
                res.status(404).json({
                  message: "Không tìm thấy sản phẩm",
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
                message: "Xóa sản phẩm thành công",
              });
            });
          },
        );
      },
    );
  });
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
