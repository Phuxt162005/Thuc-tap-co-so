import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import RevenueChart from "../components/RevenueChart";
import TopProductChart from "../components/TopProductChart";
import Sales from "./Sales";
import Product from "./Product";
import Report from "./Report";
import Inventory from "./Inventory";
import Employee from "./Employee";
import Branch from "./Branch";
import { exportPDF } from "../utils/exportPDF";

const api = "http://localhost:5000";

export default function Dashboard({ setIsLogin, role, setRole }) {
  const [activePage, setActivePage] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

  const filteredOrders = orders.filter((o) => {
    if (!fromDate && !toDate) return true;

    const orderDate = new Date(o.date);

    if (fromDate) {
      const start = new Date(fromDate);
      if (orderDate < start) return false;
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      if (orderDate > end) return false;
    }

    return true;
  });

  // tổng doanh thu
  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + Number(o.total),
    0,
  );

  // top sản phẩm bán chạy
  const topProducts = {};

  filteredOrders.forEach((order) => {
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

            <div style={{ marginBottom: "20px" }}>
              <label>Từ ngày: </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <label style={{ marginLeft: "10px" }}>Đến ngày: </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />

              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
              >
                Reset
              </button>
            </div>

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
                <p className="card-number">{filteredOrders.length}</p>
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
            <RevenueChart orders={filteredOrders} />
            <TopProductChart orders={filteredOrders} products={products} />

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => exportPDF(filteredOrders)}
            >
              Xuất PDF
            </button>
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
