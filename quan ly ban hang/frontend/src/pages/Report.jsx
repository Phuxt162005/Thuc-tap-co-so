import { useState } from "react";

export default function Report({ orders, products }) {
  // DATE FILTER
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // FILTER ORDERS
  const filteredOrders = orders.filter((o) => {
    if (!fromDate && !toDate) return true;

    const orderDate = new Date(o.date);

    if (fromDate) {
      const start = new Date(fromDate);

      if (orderDate < start) {
        return false;
      }
    }

    if (toDate) {
      const end = new Date(toDate);

      end.setHours(23, 59, 59, 999);

      if (orderDate > end) {
        return false;
      }
    }

    return true;
  });

  // TOTAL REVENUE
  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0,
  );

  // TOTAL IMPORT
  let totalImport = 0;

  filteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      const product = products.find((p) => p.productId === item.productId);

      if (product) {
        totalImport += Number(product.importPrice || 0) * Number(item.quantity);
      }
    });
  });

  // PROFIT
  const profit = totalRevenue - totalImport;

  return (
    <div>
      <h2>Báo cáo</h2>

      {/* FILTER */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label>Từ ngày:</label>

          <br />

          <input
            className="input"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label>Đến ngày:</label>

          <br />

          <input
            className="input"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          className="btn"
          style={{ marginTop: "20px" }}
          onClick={() => {
            setFromDate("");
            setToDate("");
          }}
        >
          Reset
        </button>
      </div>

      {/* REPORT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* TOTAL ORDER */}
        <div className="card">
          <h3>Tổng đơn</h3>

          <p className="card-number">{filteredOrders.length}</p>
        </div>

        {/* TOTAL IMPORT */}
        <div className="card">
          <h3>Tổng tiền nhập</h3>

          <p className="card-number" style={{ color: "#1976d2" }}>
            {totalImport.toLocaleString()} VNĐ
          </p>
        </div>

        {/* REVENUE */}
        <div className="card">
          <h3>Tổng tiền bán</h3>

          <p className="card-number" style={{ color: "green" }}>
            {totalRevenue.toLocaleString()} VNĐ
          </p>
        </div>

        {/* PROFIT */}
        <div className="card">
          <h3>Lãi</h3>

          <p
            className="card-number"
            style={{
              color: profit >= 0 ? "green" : "red",
            }}
          >
            {profit.toLocaleString()} VNĐ
          </p>
        </div>
      </div>

      {/* HISTORY */}
      <h3>Lịch sử bán hàng</h3>

      {filteredOrders.length === 0 ? (
        <p className="empty">Không có đơn hàng</p>
      ) : (
        filteredOrders.map((o) => (
          <div
            key={o.invoiceId}
            className="order-card"
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p>
              <strong>Mã đơn:</strong> #{o.invoiceId}
            </p>

            <p>
              <strong>Ngày:</strong> {new Date(o.date).toLocaleString("vi-VN")}
            </p>

            <p>
              <strong>Tổng tiền:</strong> {Number(o.total).toLocaleString()} VNĐ
            </p>

            <hr />

            {o.items.map((item, index) => {
              const product = products.find(
                (p) => p.productId === item.productId,
              );

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    {item.name} x {item.quantity}
                  </div>

                  <div>
                    {(
                      Number(item.price) * Number(item.quantity)
                    ).toLocaleString()}{" "}
                    VNĐ
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
