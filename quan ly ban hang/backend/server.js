const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const database = require("./database");

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

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

// login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = `select u.*, e.branchId
              from User u
              left join Employee e on u.employeeId = e.employeeId
              where username = ?
              and password = ?`;

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
      branchId: user.branchId,
      employeeId: user.employeeId,
    });
  });
});

// ===== server.js =====

// ---------- API Products ---------

// lấy toàn bộ sản phẩm
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

// thêm sản phẩm
app.post("/products", (req, res) => {
  const { name, price, stock, categoryId, image, importUnitPrice, branchId } =
    req.body;

  const totalImported = Number(stock || 0);

  const importPrice = Number(importUnitPrice || 0) * totalImported;

  const sql = `
    INSERT INTO Product
    (
      name,
      price,
      stock,
      categoryId,
      image,
      importUnitPrice,
      totalImported,
      importPrice,
      branchId
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

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

      // nếu có nhập tồn kho ban đầu
      if (Number(stock) > 0) {
        const importSql = `
          INSERT INTO ImportHistory
          (
            productId,
            quantity,
            totalPrice,
            branchId,
            importDate
          )
          VALUES (?, ?, ?, ?, NOW())
        `;

        database.query(
          importSql,
          [productId, stock, importPrice, branchId],
          (importErr) => {
            if (importErr) {
              console.log(importErr);

              return res.status(500).json({
                message: "Lỗi lưu lịch sử nhập",
              });
            }

            return res.json({
              message: "Thêm sản phẩm thành công",
            });
          },
        );
      } else {
        return res.json({
          message: "Thêm sản phẩm thành công",
        });
      }
    },
  );
});

// sửa sản phẩm
app.put("/products/:id", (req, res) => {
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

  const sql = `
    update Product
    set name = ?,
        price = ?,
        stock = ?,
        image = ?,
        importUnitPrice = ?,
        totalImported = ?,
        importPrice = ?,
        branchId = ?
    where productId = ?
  `;

  database.query(
    sql,
    [
      name,
      price,
      stock,
      image,
      importUnitPrice || 0,
      totalImported || 0,
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
});

// xóa sản phẩm
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

// sửa thông tin nhân viên
app.put("/employees/:id", (req, res) => {
  const { id } = req.params;

  const { name, dob, branchId, username, password, role } = req.body;

  // update employee
  const sqlEmployee = `
    update Employee
    set name = ?,
        dob = ?,
        branchId = ?
    where employeeId = ?
  `;

  database.query(sqlEmployee, [name, dob, branchId, id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    // update user account
    const checkUserSql = "select * from User where employeeId = ?";

    database.query(checkUserSql, [id], (checkErr, users) => {
      if (checkErr) {
        return res.status(500).json(checkErr);
      }

      // nếu đã có account -> update
      if (users.length > 0) {
        const sqlUser = `
              update User
              set username = ?,
                  password = ?,
                  role = ?
              where employeeId = ?
            `;

        database.query(sqlUser, [username, password, role, id], (err2) => {
          if (err2) {
            return res.status(500).json(err2);
          }

          return res.json({
            message: "Cập nhật nhân viên thành công",
          });
        });
      }

      // chưa có account -> tạo mới
      else {
        const insertUserSql = `
              insert into User
              (username, password, role, employeeId)
              values (?, ?, ?, ?)
            `;

        database.query(
          insertUserSql,
          [username, password, role || "employee", id],
          (err3) => {
            if (err3) {
              return res.status(500).json(err3);
            }

            return res.json({
              message: "Cập nhật nhân viên thành công",
            });
          },
        );
      }
    });
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

// sửa chi nhánh
app.put("/branches/:id", (req, res) => {
  const { id } = req.params;
  const { name, address, phone } = req.body;

  const sql = `
    update Branch
    set name = ?, address = ?, phone = ?
    where branchId = ?
  `;

  database.query(sql, [name, address, phone, id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Cập nhật chi nhánh thành công",
    });
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
  const sql = `
    SELECT
      i.invoiceId,
      i.date,
      i.total,
      i.branchId,

      e.name AS employeeName,

      d.productId,
      p.name,
      d.quantity,
      d.price

    FROM Invoice i

    LEFT JOIN Employee e
    ON i.employeeId = e.employeeId

    LEFT JOIN InvoiceDetail d
    ON i.invoiceId = d.invoiceId

    LEFT JOIN Product p
    ON d.productId = p.productId

    ORDER BY i.invoiceId DESC
  `;

  database.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    const orders = {};

    result.forEach((row) => {
      if (!orders[row.invoiceId]) {
        orders[row.invoiceId] = {
          invoiceId: row.invoiceId,
          date: row.date,
          total: row.total,
          branchId: row.branchId,

          // thêm người tạo đơn
          employeeName: row.employeeName || "Không xác định",

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
  const { employeeId, customerId, total, items, branchId } = req.body;

  const sql = `insert into Invoice(date, employeeId, customerId, total, branchId) values(now(), ?, ?, ?, ?)`;

  database.query(
    sql,
    [employeeId, customerId, total, branchId],
    (err, result) => {
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
    },
  );
});

// ---------- API IMPORT HISTORY ----------

// lấy lịch sử nhập
app.get("/imports", (req, res) => {
  const sql = `
    SELECT
      i.*,
      p.name,
      p.image,
      p.importUnitPrice
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
});

// thêm lịch sử nhập
app.post("/imports", (req, res) => {
  const { productId, quantity, totalPrice, branchId } = req.body;

  const sql = `
    INSERT INTO ImportHistory
    (
      productId,
      quantity,
      totalPrice,
      branchId,
      importDate
    )
    VALUES (?, ?, ?, ?, NOW())
  `;

  database.query(sql, [productId, quantity, totalPrice, branchId], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Lỗi lưu lịch sử nhập",
      });
    }

    res.json({
      message: "Lưu lịch sử nhập thành công",
    });
  });
});

// running server
app.listen(5000, () => {
  console.log("Server is running");
});
