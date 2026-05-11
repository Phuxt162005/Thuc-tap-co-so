const database = require("../database");

// lấy đơn hàng
const getOrders = (req, res) => {
  const sql = `SELECT i.invoiceId, i.date, i.total, i.branchId, e.name 
    AS employeeName, d.productId, p.name, d.quantity, d.price
    FROM Invoice i
    LEFT JOIN Employee e ON i.employeeId = e.employeeId
    LEFT JOIN InvoiceDetail d ON i.invoiceId = d.invoiceId
    LEFT JOIN Product p ON d.productId = p.productId
    ORDER BY i.invoiceId DESC`;

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
};

// tạo hóa đơn
const createOrder = (req, res) => {
  const { employeeId, customerId, total, items, branchId } = req.body;

  const sql = `INSERT INTO Invoice(date, employeeId, customerId, total, branchId)
    VALUES(NOW(), ?, ?, ?, ?)`;

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
          invoiceId,
        });
      }

      const values = items.map((item) => [
        invoiceId,
        item.productId,
        item.quantity,
        item.price,
      ]);

      database.query(
        `INSERT INTO InvoiceDetail (invoiceId, productId, quantity, price) VALUES ?`,
        [values],
        (detailErr) => {
          if (detailErr) {
            return res.status(500).json(detailErr);
          }

          res.json({
            message: "Thanh toán thành công",
            invoiceId,
          });
        },
      );
    },
  );
};

module.exports = { getOrders, createOrder };
