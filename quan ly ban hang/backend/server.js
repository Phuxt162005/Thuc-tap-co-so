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

// ---------- Login ----------
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

// quên mật khẩu
app.post("/forgot-password", (req, res) => {
  const { username, phone } = req.body;

  const sql = `
    SELECT u.password
    FROM User u
    JOIN Employee e
    ON u.employeeId = e.employeeId
    WHERE u.username = ?
    AND e.phone = ?
  `;

  database.query(sql, [username, phone], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Lỗi server",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Sai username hoặc số điện thoại",
      });
    }

    res.json({
      password: result[0].password,
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
    SELECT e.*, u.username, u.password, u.role, p.basicSalary, p.month, p.year
    FROM Employee e
    LEFT JOIN User u
    ON e.employeeId = u.employeeId
    LEFT JOIN Payroll p
    ON p.payrollId = (
      SELECT payrollId
      FROM Payroll
      WHERE employeeId = e.employeeId
      ORDER BY year DESC, month DESC
      LIMIT 1
    )
  `;

  database.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
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
          return res.json({ message: "Thêm account thành công", employeeId });
        },
      );
    } else {
      res.json({ message: "Thêm nhân viên thành công", employeeId });
    }
  });
});

// sửa thông tin nhân viên
app.put("/employees/:id", (req, res) => {
  const { id } = req.params;

  const { name, dob, phone, branchId, username, password, role } = req.body;

  // update employee
  const sqlEmployee = `
    UPDATE Employee
    SET name = ?, dob = ?, phone = ?, branchId = ?
    WHERE employeeId = ?
  `;

  database.query(sqlEmployee, [name, dob, phone, branchId, id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    // kiểm tra user đã tồn tại chưa
    const checkUserSql = "SELECT * FROM User WHERE employeeId = ?";

    database.query(checkUserSql, [id], (checkErr, users) => {
      if (checkErr) {
        return res.status(500).json(checkErr);
      }

      // đã có account -> update
      if (users.length > 0) {
        const sqlUser = `
            UPDATE User
            SET username = ?, password = ?, role = ?
            WHERE employeeId = ?
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
            INSERT INTO User
            (username, password, role, employeeId)
            VALUES (?, ?, ?, ?)
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

// ---------- API payroll ---------
app.post("/payroll", (req, res) => {
  const { employeeId, basicSalary, month, year, bonus, deduction } = req.body;

  const sql = `
    INSERT INTO Payroll (employeeId, month, year, basicSalary, bonus, deduction, totalSalary, paymentDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const totalSalary =
    Number(basicSalary || 0) + Number(bonus || 0) - Number(deduction || 0);

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
