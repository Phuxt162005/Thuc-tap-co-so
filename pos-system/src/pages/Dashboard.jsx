import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Sales from "./Sales";
import Product from "./Product";
import Report from "./Report";
import Inventory from "./Inventory";
import Employee from "./Employee";
import Branch from "./Branch";

export default function Dashboard({ setIsLogin }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);

  // lúc mở ra thì hiện ra
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
        return (
          <Employee
            employees={employees}
            setEmployees={setEmployees}
            branches={branches}
          />
        );
      case "branch":
        return <Branch branches={branches} setBranches={setBranches} />;

      default:
        return (
          <div>
            <h2>Thông tin bán hàng</h2>

            <div style={cardContainer}>
              <div style={card}>
                <h3>Doanh thu: </h3>
                <p style={cardNumber}>{totalRevenue.toLocaleString()} VNĐ</p>
              </div>

              <div style={card}>
                <h3>Sản phẩm: </h3>
                <p style={cardNumber}>{products.length}</p>
              </div>

              <div style={card}>
                <h3>Đơn hàng: </h3>
                <p style={cardNumber}>{orders.length}</p>
              </div>

              <div style={topBox}>
                <h3>Top sản phẩm bán chạy</h3>

                {sortedProducts.length === 0 && (
                  <p style={{ color: "#777" }}>Chưa có dữ liệu</p>
                )}

                {sortedProducts.map(([name, qty], index) => (
                  <div key={name} style={topItem}>
                    <span>
                      {index + 1}, {name}
                    </span>
                    <span>Đã bán: {qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        setIsLogin={setIsLogin}
      />

      <div style={{ flex: 1, padding: "20px" }}>{renderContent()}</div>
    </div>
  );
}

const cardContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "20px",
  flexWrap: "wrap",
};

const card = {
  background: "#fff",
  padding: "25px",
  borderRadius: "10px",
  width: "220px",
  textAlign: "center",
  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
};

const cardNumber = {
  fontSize: "24px",
  fontWeight: "bold",
  marginTop: "10px",
  color: "#2c3e50",
};

const topBox = {
  marginTop: "40px",
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "500px",
  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
};

const topItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
};
