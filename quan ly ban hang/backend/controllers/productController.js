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

  const totalImported = Number(stock || 0);
  const importPrice = Number(importUnitPrice || 0) * totalImported;

  const sql = `INSERT INTO Product (name, price, stock, categoryId, image, importUnitPrice, totalImported, importPrice, branchId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  database.query(
    sql,
    [
      name,
      price,
      stock,
      categoryId,
      image,
      importUnitPrice || 0,
      totalImported,
      importPrice,
      branchId,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      const productId = result.insertId;

      if (Number(stock) > 0) {
        const importSql = `INSERT INTO ImportHistory (productId, quantity, totalPrice, branchId, importDate)
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
      image,
      importUnitPrice,
      totalImported,
      importPrice,
      branchId,
      id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json(err);
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

  database.query("DELETE FROM Product WHERE productId=?", [id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Xóa sản phẩm thành công",
    });
  });
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
