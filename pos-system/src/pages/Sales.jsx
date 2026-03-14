import { useState, useEffect } from "react";

export default function Sales({ products, setProducts, orders, setOrders }) {
  const [cart, setCart] = useState([]);
  const [cash, setCash] = useState("");
  const [search, setSearch] = useState("");

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === product.id);

      if (existing) {
        return prevCart.map((i) =>
          i.id === product.id
            ? {
                ...i,
                quantity:
                  i.quantity + 1 > product.stock
                    ? product.stock
                    : i.quantity + 1,
              }
            : i,
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  // tính tiền
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // tiền thừa
  const change = cash - total;

  // trả tiền
  const checkout = () => {
    if (cash < total) {
      alert("Không đủ tiền");
      return;
    }

    // order mới
    const newOrder = {
      id: Date.now(),
      items: cart,
      total,
      date: new Date().toLocaleString(),
    };

    // cập nhật tồn kho
    const updatedProducts = products.map((p) => {
      const item = cart.find((c) => c.id === p.id);

      if (item) {
        return {
          ...p,
          stock: p.stock - item.quantity,
        };
      }

      return p;
    });

    setProducts(updatedProducts);

    setOrders((prev) => [...prev, newOrder]);

    setCart([]);
    setCash("");
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={container}>
      {/* product list */}
      <div>
        <input
          style={searchBox}
          placeholder="Tìm sản phẩm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={productGrid}>
          {filteredProducts.length === 0 ? (
            <p style={noProduct}>Không tìm thấy sản phẩm</p>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                style={productCard}
                onClick={() => p.stock > 0 && addToCart(p)}
              >
                <h4>{p.name}</h4>

                <p>{p.price.toLocaleString()} VNĐ</p>

                <p
                  style={{
                    color:
                      p.stock === 0 ? "red" : p.stock < 5 ? "orange" : "green",
                    fontSize: "14px",
                  }}
                >
                  Tồn kho: {p.stock}
                </p>

                {p.stock === 0 && <p style={{ color: "red" }}>Hết hàng</p>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* cart */}
      <div style={cartBox}>
        <h3>Giỏ hàng</h3>

        {cart.length === 0 && <p>Chưa có sản phẩm</p>}

        {cart.map((i) => (
          <div key={i.id} style={cartItem}>
            <div style={cartRow}>
              <span>{i.name}</span>

              <input
                type="number"
                min="1"
                max={i.stock}
                value={i.quantity}
                style={qtyInput}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "") {
                    setCart(
                      cart.map((item) =>
                        item.id === i.id ? { ...item, quantity: "" } : item,
                      ),
                    );
                    return;
                  }

                  const qty = Math.min(Number(value), i.stock);

                  setCart(
                    cart.map((item) =>
                      item.id === i.id ? { ...item, quantity: qty } : item,
                    ),
                  );
                }}
              />
            </div>

            <button style={removeBtn} onClick={() => removeFromCart(i.id)}>
              Xóa
            </button>
          </div>
        ))}

        <h3 style={{ marginTop: "20px" }}>
          Tổng: {total.toLocaleString()} VNĐ
        </h3>

        <input
          style={cashInput}
          type="number"
          placeholder="Tiền khách trả"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
        />

        <p>Tiền thừa: {change > 0 ? change : 0}</p>

        <button style={checkoutBtn} onClick={checkout}>
          Thanh toán
        </button>
      </div>
    </div>
  );
}

const container = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "30px",
};

const searchBox = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginBottom: "20px",
};

const productGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  gap: "15px",
};

const productCard = {
  background: "#fff",
  padding: "15px",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  cursor: "pointer",
};

const noProduct = {
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: "40px",
  color: "#777",
};

const cartBox = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const cartItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

const cartRow = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  alignItems: "center",
};

const qtyInput = {
  width: "60px",
  padding: "5px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const removeBtn = {
  background: "#e53935",
  border: "none",
  color: "white",
  padding: "4px 10px",
  borderRadius: "4px",
  cursor: "pointer",
};

const cashInput = {
  width: "100%",
  padding: "8px",
  marginTop: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const checkoutBtn = {
  marginTop: "15px",
  width: "100%",
  padding: "10px",
  background: "#2e7d32",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
