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
    <div className="container-grid">
      {/* product list */}
      <div>
        <input
          className="search-box"
          placeholder="Tìm sản phẩm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <div className="empty-box">Không tìm thấy sản phẩm</div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="product-card"
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
      <div className="cart-box">
        <h3>Giỏ hàng</h3>

        {cart.length === 0 && <p>Chưa có sản phẩm</p>}

        {cart.map((i) => (
          <div key={i.id} className="cart-item">
            <div className="cart-row">
              <span>{i.name}</span>

              <input
                type="number"
                min="1"
                max={i.stock}
                value={i.quantity}
                className="qty-input"
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

            <button
              className="btn btn-danger"
              onClick={() => removeFromCart(i.id)}
            >
              Xóa
            </button>
          </div>
        ))}

        <h3 style={{ marginTop: "20px" }}>
          Tổng: {total.toLocaleString()} VNĐ
        </h3>

        <input
          className="input"
          type="number"
          placeholder="Tiền khách trả"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
        />

        <p>Tiền thừa: {change > 0 ? change : 0}</p>

        <button className="btn btn-success" onClick={checkout}>
          Thanh toán
        </button>
      </div>
    </div>
  );
}
