import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Sales from "./Sales";
import Product from "./Product";
import Report from "./Report";
import Inventory from "./Inventory";
import Employee from "./Employee";
import Branch from "./Branch";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

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
  }, []);

  // lưu sản phẩm
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

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
        return <Sales products={products} setProducts={setProducts} />;
      case "product":
        return <Product products={products} setProducts={setProducts} />;
      case "report":
        return <Report />;
      case "inventory":
        return <Inventory products={products} setProducts={setProducts} />;
      case "employee":
        return <Employee />;
      case "branch":
        return <Branch />;

      default:
        return (
          <div>
            <h2>Dashboard</h2>

            <div style={cardContainer}>
              <div style={card}>
                <h3>Doanh thu: </h3>
                <p>{totalRevenue.toLocaleString()} VNĐ</p>
              </div>

              <div style={card}>
                <h3>Sản phẩm: </h3>
                <p>{products.length}</p>
              </div>

              <div style={card}>
                <h3>Đơn hàng: </h3>
                <p>{orders.length}</p>
              </div>

              <div style={{ marginTop: "40px" }}>
                <h3>Top sản phẩm bán chạy</h3>

                {sortedProducts.length === 0 && <p>Chưa có dữ liệu</p>}

                {sortedProducts.map(([name, qty]) => (
                  <div key={name}>
                    {name} - Đã bán: {qty}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <button onClick={() => window.location.reload()}>Logout</button>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Sidebar setActivePage={setActivePage} />

        <div style={{ flex: 1, padding: "20px" }}>{renderContent()}</div>
      </div>
    </>
  );
}

const cardContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "20px",
  flexWrap: "wrap",
};

const card = {
  background: "#f5f5f5",
  fontSize: "18px",
  color: "white",
  padding: "25px",
  borderRadius: "10px",
  width: "220px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
};
