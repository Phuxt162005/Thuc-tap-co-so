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
      return res.status(500).json({ message: "Lỗi server" });
    } else {
      res.json(result);
    }
  });
});

// login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "select * from `User` where username = ? and password = ?";

  database.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi server" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    const user = result[0];

    res.json({
      message: "Đăng nhập thành công",
      role: user.role,
      username: user.username,
    });
  });
});

// thêm sản phẩm
app.post("/products", (req, res) => {
  const { name, price, stock, categoryId } = req.body;

  const sql = `insert into Product(name, price, stock, categoryId) values (?, ?, ?, ?)`;

  database.query(sql, [name, price, stock, categoryId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
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
      return res.status(500).json(err);
    } else {
      res.json({ message: "Xóa sản phẩm thành công" });
    }
  });
});

// ---------- API Employee ----------

// Lấy danh sách nhân viên
app.get("/employees", (req, res) => {
  const sql = `
  select e.*, u.username, u.password, u.role
  from Employee e
  left join User u on e.employeeId = u.employeeId
`;

  database.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

// Thêm nhân viên
app.post("/employees", (req, res) => {
  const { name, dob, phone, branchId, username, password, role } = req.body;

  const sqlEpl = `insert into Employee(name, dob, phone, branchId) values(?, ?, ?, ?)`;

  database.query(sqlEpl, [name, dob, phone, branchId], (err1, result1) => {
    if (err1) {
      res.status(500).json(err1);
    }

    const employeeId = result1.insertId;

    // nếu có username thì tạo user
    if (username && password) {
      const sqlUser = `insert into User(username, password, role, employeeId) values(?, ?, ?, ?)`;

      database.query(
        sqlUser,
        [username, password, role || "employee", employeeId],
        (err2, result2) => {
          if (err2) {
            return res.status(500).json(err2);
          }
          return res.json({ message: "Thêm account thành công" });
        },
      );
    } else {
      res.json({ message: "Thêm nhân viên thành công" });
    }
  });
});

// Xóa nhân viên
app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;
  const sql = "delete from Employee where employeeId=?";

  database.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: "Xóa nhân viên thành công" });
  });
});

// ---------- API Branch ----------

// Lấy chi nhánh
app.get("/branches", (req, res) => {
  const sql = "select * from Branch";

  database.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
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

// Xóa chi nhánh
app.delete("/branches/:id", (req, res) => {
  const { id } = req.params;

  const sql = "delete from Branch where branchId=?";

  database.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: "Xóa chi nhánh thành công" });
  });
});

// ---------- API Invoice --------

// Lấy hóa đơn
app.get("/orders", (req, res) => {
  const sql = `select i.invoiceId, i.date, i.total, d.productId, p.name, d.quantity, d.price 
  from Invoice i
  left join InvoiceDetail d on i.invoiceId = d.invoiceId
  left join Product p on d.productId = p.productId
  order by i.invoiceId desc`;

  database.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    // gom dữ liệu lại
    const orders = {};

    result.forEach((row) => {
      if (!orders[row.invoiceId]) {
        orders[row.invoiceId] = {
          invoiceId: row.invoiceId,
          date: row.date,
          total: row.total,
          items: [],
        };
      }

      if (row.productId) {
        orders[row.invoiceId].items.push({
          productId: row.productId,
          name: row.name,
          quantity: row.quantity,
          price: row.price,
        });
      }
    });

    res.json(Object.values(orders));
  });
});

// Tạo hóa đơn + chi tiết hóa đơn
app.post("/orders", (req, res) => {
  const { employeeId, customerId, total, items } = req.body;

  const sql = `insert into Invoice(date, employeeId, customerId, total) values(now(), ?, ?, ?)`;

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
