import { useState, useEffect } from "react";

export default function Report({ orders }) {
  // doanh thu
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h2>Báo cáo</h2>

      <p>Tổng đơn: {orders.length}</p>
      <p>Doanh thu: {revenue}</p>

      <h3>Lịch sử bán hàng</h3>

      {orders.length === 0 ? (
        <p className="empty">Chưa có đơn hàng</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="order-card">
            <p>Ngày: {o.date}</p>
            <p>Tổng tiền: {o.total.toLocaleString()} VNĐ</p>

            {o.items.map((item) => (
              <div key={item.id}>
                - {item.name} x {item.quantity}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
