import { useState, useEffect } from "react";

export default function Report() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // doanh thu
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h2>Báo cáo</h2>

      <p>Tổng đơn: {orders.length}</p>
      <p>Doanh thu: {revenue}</p>

      <h3>Lịch sử bán hàng</h3>

      {orders.map((o) => (
        <div key={o.id} style={orderCard}>
          <p>Ngày: {o.date}</p>
          <p>Tổng tiền: {o.total.toLocaleString()} VNĐ</p>
        </div>
      ))}
    </div>
  );
}

const orderCart = {
  border: "1px solid #ddd",
  padding: "10px",
  marginTop: "10px",
};
