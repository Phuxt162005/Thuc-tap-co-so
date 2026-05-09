import { useState } from "react";

export default function Sales({ products, setProducts, orders, setOrders }) {
  const [cart, setCart] = useState([]);
  const [cash, setCash] = useState("");
  const [search, setSearch] = useState("");

  // thêm vào giỏ
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.productId === product.productId);

      if (existing) {
        return prevCart.map((i) =>
          i.productId === product.productId
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

  // xóa khỏi giỏ
  const removeFromCart = (id) => {
    setCart(cart.filter((i) => i.productId !== id));
  };

  // tổng tiền
  const total = cart.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.quantity),
    0,
  );

  // tiền thừa
  const change = Number(cash || 0) - total;

  // thanh toán
  const checkout = async () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống");
      return;
    }

    if (Number(cash) < total) {
      alert("Không đủ tiền");
      return;
    }

    try {
      // cập nhật tồn kho
      for (const item of cart) {
        const product = products.find((p) => p.productId === item.productId);

        if (!product) continue;

        const newStock = Number(product.stock) - Number(item.quantity);

        if (newStock < 0) {
          alert("Không đủ hàng");
          return;
        }

        // cập nhật sản phẩm
        const res = await fetch(
          `http://localhost:5000/products/${item.productId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              name: product.name,
              price: Number(product.price || 0),
              image: product.image || "",
              stock: newStock,
              importUnitPrice: Number(product.importUnitPrice || 0),
              totalImported: Number(product.totalImported || 0),
              importPrice: Number(product.importPrice || 0),
              categoryId: Number(product.categoryId || 1),
              branchId:
                Number(product.branchId) ||
                Number(localStorage.getItem("branchId")),
            }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Lỗi cập nhật kho");
          return;
        }
      }

      // tạo hóa đơn
      // tạo hóa đơn
      const employeeId = localStorage.getItem("employeeId");

      const branchId = localStorage.getItem("branchId");

      if (!employeeId) {
        alert("Không xác định nhân viên đăng nhập");
        return;
      }

      const orderRes = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          employeeId: Number(employeeId),

          customerId: 1,

          total,

          branchId: Number(branchId),

          items: cart.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert(orderData.message || "Lỗi tạo hóa đơn");
        return;
      }
      // reload products
      const res1 = await fetch("http://localhost:5000/products");

      const data1 = await res1.json();

      setProducts(data1);

      // reload orders
      const res2 = await fetch("http://localhost:5000/orders");

      const data2 = await res2.json();

      setOrders(data2);

      // reset
      setCart([]);
      setCash("");

      alert("Thanh toán thành công!");
    } catch (err) {
      console.log(err);

      alert("Lỗi thanh toán");
    }
  };

  // tìm kiếm
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-grid">
      {/* PRODUCT */}
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
                key={p.productId}
                className="product-card"
                onClick={() => p.stock > 0 && addToCart(p)}
              >
                {/* image */}
                {p.image && (
                  <img
                    src={p.image}
                    alt=""
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                  />
                )}

                {/* name */}
                <h4>{p.name}</h4>

                {/* price */}
                <p>{Number(p.price).toLocaleString("vi-VN")} VNĐ</p>

                {/* stock */}
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

      {/* CART */}
      <div className="cart-box">
        <h3>Giỏ hàng</h3>

        {cart.length === 0 && <p>Chưa có sản phẩm</p>}

        {cart.map((i) => (
          <div key={i.productId} className="cart-item">
            <div className="cart-row">
              <div>
                <strong>{i.name}</strong>

                <p>{Number(i.price).toLocaleString("vi-VN")} VNĐ</p>
              </div>

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
                        item.productId === i.productId
                          ? {
                              ...item,
                              quantity: "",
                            }
                          : item,
                      ),
                    );

                    return;
                  }

                  const qty = Math.min(Number(value || 1), i.stock);

                  setCart(
                    cart.map((item) =>
                      item.productId === i.productId
                        ? {
                            ...item,
                            quantity: qty,
                          }
                        : item,
                    ),
                  );
                }}
              />
            </div>

            <button
              className="btn btn-danger"
              onClick={() => removeFromCart(i.productId)}
            >
              Xóa
            </button>
          </div>
        ))}

        <h3 style={{ marginTop: "20px" }}>
          Tổng: {Number(total).toLocaleString("vi-VN")} VNĐ
        </h3>

        <input
          className="input"
          type="number"
          placeholder="Tiền khách trả"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
        />

        <p>
          Tiền thừa: {change > 0 ? Number(change).toLocaleString("vi-VN") : 0}{" "}
          VNĐ
        </p>

        <button className="btn btn-success" onClick={checkout}>
          Thanh toán
        </button>
      </div>
    </div>
  );
}
