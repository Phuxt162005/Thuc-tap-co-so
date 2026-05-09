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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const api = "http://localhost:5000";

export default function Dashboard({ setIsLogin, role, setRole }) {
  const [activePage, setActivePage] = useState("");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const branchId = localStorage.getItem("branchId");

  // khi login
  useEffect(() => {
    if (role === "admin") {
      setActivePage("employee");
    } else {
      setActivePage("dashboard");
    }
  }, [role]);

  // load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // products
      const productRes = await fetch(`${api}/products`);
      const productData = await productRes.json();

      const filteredProducts =
        role === "admin"
          ? productData
          : productData.filter((p) => Number(p.branchId) === Number(branchId));

      setProducts(filteredProducts);

      // branches
      const branchRes = await fetch(`${api}/branches`);
      const branchData = await branchRes.json();
      setBranches(branchData);

      // employees
      const employeeRes = await fetch(`${api}/employees`);
      const employeeData = await employeeRes.json();

      const filteredEmployees =
        role === "admin"
          ? employeeData
          : employeeData.filter((e) => Number(e.branchId) === Number(branchId));

      setEmployees(filteredEmployees);

      // orders
      const orderRes = await fetch(`${api}/orders`);
      const orderData = await orderRes.json();

      const filteredOrders =
        role === "admin"
          ? orderData
          : orderData.filter((o) => Number(o.branchId) === Number(branchId));

      setOrders(filteredOrders);
    } catch (err) {
      console.log(err);
    }
  };

  // lọc ngày
  const filteredOrders = orders.filter((o) => {
    if (!fromDate && !toDate) return true;

    const orderDate = new Date(o.date);

    if (fromDate && orderDate < fromDate) {
      return false;
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

  // tổng doanh thu
  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + Number(o.total),
    0,
  );

  // top products
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

  const sortedProducts = Object.entries(topProducts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

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
        return <Report orders={orders} products={products} />;

      case "inventory":
        return <Inventory products={products} setProducts={setProducts} />;

      case "employee":
        return (
          <Employee
            employees={employees}
            setEmployees={setEmployees}
            branches={branches}
          />
        );

      case "branch":
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

            {/* DATE */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <label>Từ ngày:</label>

                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày"
                  className="input"
                />
              </div>

              <div>
                <label>Đến ngày:</label>

                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày"
                  className="input"
                />
              </div>

              <button
                className="btn"
                onClick={() => {
                  setFromDate(null);
                  setToDate(null);
                }}
              >
                Reset
              </button>
            </div>

            {/* CARD */}
            <div className="card-container">
              <div className="card">
                <h3>Doanh thu:</h3>

                <p className="card-number">
                  {totalRevenue.toLocaleString()} VNĐ
                </p>
              </div>

              <div
                className="card"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => setActivePage("inventory")}
              >
                <h3>Sản phẩm:</h3>

                <p className="card-number">{products.length}</p>
              </div>

              <div
                className="card"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => setActivePage("report")}
              >
                <h3>Đơn hàng:</h3>

                <p className="card-number">{filteredOrders.length}</p>
              </div>

              {/* TOP PRODUCT */}
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
                        <div
                          key={id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                            marginBottom: "15px",
                          }}
                        >
                          {product?.image && (
                            <img
                              src={product.image}
                              alt=""
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                            />
                          )}

                          <div>
                            <div
                              style={{
                                fontWeight: "bold",
                              }}
                            >
                              #{index + 1} {product?.name}
                            </div>

                            <div>Đã bán: {qty}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* CHART */}
            {filteredOrders.length > 0 && (
              <RevenueChart orders={filteredOrders} />
            )}

            {filteredOrders.length > 0 && (
              <TopProductChart orders={filteredOrders} products={products} />
            )}

            <button
              className="btn btn-primary"
              style={{
                marginTop: "20px",
              }}
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
        employees={employees}
        branches={branches}
      />

      <div className="main-content">{renderContent()}</div>
    </div>
  );
}
