import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Sales from "./Sales";
import Product from "./Product";
import Report from "./Report";
import Inventory from "./Inventory";
import Employee from "./Employee";
import Branch from "./Branch";

const api = "http://localhost:5000";

export default function Dashboard({ setIsLogin, role, setRole }) {
  const [activePage, setActivePage] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);

  // khi đăng nhập
  useEffect(() => {
    if (role === "admin") setActivePage("employee");
    else setActivePage("dashboard");
  }, [role]);

  // lấy sản phẩm từ backend
  useEffect(() => {
    fetch(`${api}/products`)
      .then((res) => res.json())
      .then(setProducts);

    fetch(`${api}/branches`)
      .then((res) => res.json())
      .then(setBranches);

    fetch(`${api}/employees`)
      .then((res) => res.json())
      .then(setEmployees);

    fetch(`${api}/orders`)
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  // tổng doanh thu
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // top sản phẩm bán chạy
  const topProducts = {};

  orders.forEach((order) => {
    if (!order.items) return;

    order.items.forEach((item) => {
      if (!topProducts[item.productId]) {
        topProducts[item.productId] = 0;
      }
      topProducts[item.productId] += item.quantity;
    });
  });

  // sắp xếp top sản phẩm
  const sortedProducts = Object.entries(topProducts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // render nội dung
  const renderContent = () => {
    switch (activePage) {
      case "sales":
        return (
          <Sales
            products={products}
            setProducts={setProducts}
            orders={orders}
            setOrders={setOrders}
          />
        );

      case "product":
        return <Product products={products} setProducts={setProducts} />;

      case "report":
        return <Report orders={orders} />;

      case "inventory":
        return <Inventory products={products} setProducts={setProducts} />;

      case "employee":
        if (role !== "admin" && role !== "manager") {
          return <p>Không có quyền truy cập</p>;
        }
        return (
          <Employee
            employees={employees}
            setEmployees={setEmployees}
            branches={branches}
            setBranches={setBranches}
          />
        );

      case "branch":
        if (role !== "admin" && role !== "manager") {
          return <p>Không có quyền truy cập</p>;
        }
        return (
          <Branch
            branches={branches}
            setBranches={setBranches}
            employees={employees}
          />
        );

      default:
        return (
          <div>
            <h2>Thông tin bán hàng</h2>

            <div className="card-container">
              <div className="card">
                <h3>Doanh thu:</h3>
                <p className="card-number">
                  {totalRevenue.toLocaleString()} VNĐ
                </p>
              </div>

              <div className="card">
                <h3>Sản phẩm:</h3>
                <p className="card-number">{products.length}</p>
              </div>

              <div className="card">
                <h3>Đơn hàng:</h3>
                <p className="card-number">{orders.length}</p>
              </div>

              <div className="top-box">
                <h3>Top sản phẩm bán chạy</h3>

                <div className="top-content">
                  {sortedProducts.length === 0 ? (
                    <p className="empty">Chưa có dữ liệu</p>
                  ) : (
                    sortedProducts.map(([id, qty], index) => {
                      const product = products.find(
                        (p) => p.productId === Number(id),
                      );

                      return (
                        <div key={id} className="top-item">
                          <span>
                            {index + 1}. {product?.name || "Unknown"}
                          </span>
                          <span> Đã bán: {qty}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        setIsLogin={setIsLogin}
        role={role}
        setRole={setRole}
      />

      <div className="main-content">{renderContent()}</div>
    </div>
  );
}
