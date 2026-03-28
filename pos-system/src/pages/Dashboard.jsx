import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Sales from "./Sales";
import Product from "./Product";
import Report from "./Report";
import Inventory from "./Inventory";
import Employee from "./Employee";
import Branch from "./Branch";

export default function Dashboard({ setIsLogin, role, setRole }) {
  const [activePage, setActivePage] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);

  // lúc đăng nhập thì hiện ra
  useEffect(() => {
    if (role === "admin") setActivePage("employee");
    else setActivePage("dashboard");
  }, [role]);

  useEffect(() => {
    const savedProduct = localStorage.getItem("products");
    if (savedProduct) {
      setProducts(JSON.parse(savedProduct));
    } else {
      setProducts([
        { id: 1, name: "Bút Thiên Long", price: 10000, stock: 50 },
        { id: 2, name: "Dầu gội Dove", price: 120000, stock: 30 },
        { id: 3, name: "Sunlight", price: 35000, stock: 40 },
      ]);
    }

    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    const savedBranches = localStorage.getItem("branches");
    if (savedBranches) {
      setBranches(JSON.parse(savedBranches));
    }

    const savedEmployees = localStorage.getItem("employees");
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  }, []);

  // lưu sản phẩm
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // lưu order
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // lưu branch
  useEffect(() => {
    localStorage.setItem("branches", JSON.stringify(branches));
  }, [branches]);

  // lưu employee
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  // tổng doanh thu
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // top sản phẩm bán chạy
  const topProducts = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!topProducts[item.name]) {
        topProducts[item.name] = 0;
      }
      topProducts[item.name] += item.quantity;
    });
  });

  // sắp xếp sản phẩm
  const sortedProducts = Object.entries(topProducts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // render content
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
                <h3>Doanh thu: </h3>
                <p className="card-number">
                  {totalRevenue.toLocaleString()} VNĐ
                </p>
              </div>

              <div className="card">
                <h3>Sản phẩm: </h3>
                <p className="card-number">{products.length}</p>
              </div>

              <div className="card">
                <h3>Đơn hàng: </h3>
                <p className="card-number">{orders.length}</p>
              </div>

              <div className="top-box">
                <h3>Top sản phẩm bán chạy</h3>

                <div className="top-content">
                  {sortedProducts.length === 0 ? (
                    <p className="empty">Chưa có dữ liệu</p>
                  ) : (
                    sortedProducts.map(([name, qty], index) => (
                      <div key={name} className="top-item">
                        <span>
                          {index + 1}. {name}
                        </span>
                        <span> Đã bán: {qty}</span>
                      </div>
                    ))
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
