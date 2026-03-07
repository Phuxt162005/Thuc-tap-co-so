import { useState, useEffect } from "react";

export default function Sales({ products, setProducts }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cash, setCash] = useState("");
  const [search, setSearch] = useState("");

  // lúc mà order sản phẩm
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // lưu cái order đấy
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product) => {
    const existing = cart.find((i) => i.id === product.id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
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
      date: new Date().toLocaleDateString(),
    };

    // cập nhật
    const updatedProducts = products.map((p) => {
      const item = cart.find((c) => c.id === p.id);

      if (item) {
        return { ...p, stock: p.stock - item.quantity };
      }
      return p;
    });

    setProducts(updatedProducts);

    setOrders([...orders, newOrder]);

    setCart([]);
    setCash("");
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 2 }}>
        <input
          placeholder="Tìm sản phẩm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredProducts.map((p) => (
          <div key={p.id}>
            {p.name} - {p.price}
            <button onClick={() => addToCart(p)}>Thêm</button>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <h3>Giỏ hàng</h3>

        {cart.map((i) => (
          <div key={i.id}>
            {i.name} x {i.quantity}
          </div>
        ))}
        <h4>Tổng: {total}</h4>

        <input
          type="number"
          placeholder="Tiền khách trả"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
        />

        <p>Tiền thừa: {change > 0 ? change : 0}</p>

        <button onClick={checkout}>Thanh toán</button>
      </div>
    </div>
  );
}
