const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const database = require("./database");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Kết nối database
database.connect((err) => {
  if (err) {
    console.log("Không kết nối được CSDL:", err);
  } else {
    console.log("Kết nối CSDL thành công");
  }
});

// test server
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ---------- API product ----------
app.get("/products", (req, res) => {
  const sql = "select * from Product";

  database.query(sql, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

// thêm sản phẩm
app.post("/products", (req, res) => {
  const { name, price, stock, categoryId } = req.body;

  const sql = `insert into Product(name, price, stock, categoryId) values (?, ?, ?, ?)`;

  database.query(sql, [name, price, stock, categoryId], (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({ message: "Thêm sản phẩm thành công" });
    }
  });
});

// Cập nhật tồn kho
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  const sql = `update Product set stock = ? where productId = ?`;

  database.query(sql, [stock, id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      res.json({ message: "Cập nhật vào kho thành công" });
    }
  });
});

// Xóa sản phẩm
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  const sql = "delete from Product where productId = ?";

  database.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({ message: "Xóa sản phẩm thành công" });
    }
  });
});

// ---------- API Employee ----------

// Lấy danh sách nhân viên
app.get("/employees", (req, res) => {
  const sql = "select * from Employee";

  database.query(sql, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

// Thêm nhân viên
app.post("/employees", (req, res) => {
  const { name, dob, phone, branchId } = req.body;

  const sql = `insert into Employee(name, dob, phone, branchId) values(?, ?, ?, ?)`;

  database.query(sql, [name, dob, phone, branchId], (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({ message: "Thêm nhân viên thành công" });
    }
  });
});

// ---------- API Branch ----------

// Lấy chi nhánh
app.get("/branches", (req, res) => {
  const sql = "select * from Branch";

  database.query(sql, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

// Thêm chi nhánh
app.post("/branches", (req, res) => {
  const { name, address, phone } = req.body;

  const sql = `insert into Branch(name, address, phone) values(?, ?, ?)`;

  database.query(sql, [name, address, phone], (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({ message: "Thêm chi nhánh thành công" });
    }
  });
});

// ---------- API Invoice --------

// Lấy hóa đơn
app.get("/orders", (req, res) => {
  const sql = "select * from Invoice";

  database.query(sql, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

// Tạo hóa đơn + chi tiết hóa đơn
app.post("/orders", (req, res) => {
  const { employeeId, customerId, total, items } = req.body;

  const sql = `insert into Invoice(date, employeeId, customerId, total) value(now(), ?, ?, ?)`;

  database.query(sql, [employeeId, customerId, total], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    const invoiceId = result.insertId;

    if (!items || items.length === 0) {
      return res.json({
        message: "Tạo hóa đơn thành công",
        invoiceId,
      });
    }

    const detailValues = items.map((item) => [
      invoiceId,
      item.productId,
      item.quantity,
      item.price,
    ]);

    const detailSql = `insert into InvoiceDetail(invoiceId, productId, quantity, price) values ?`;

    database.query(detailSql, [detailValues], (detailErr, detailResult) => {
      if (detailErr) {
        return res.status(500).json(detailErr);
      }
      res.json({ message: "Than toán thành công!", invoiceId });
    });
  });
});

// running server
app.listen(5000, () => {
  console.log("Server is running");
});
