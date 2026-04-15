import { useState } from "react";

export default function Inventory({ products, setProducts }) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  // nhập kho
  const importStock = async () => {
    if (!productId || !quantity) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const product = product.find((p) => p.productId === Number(productId));

    if (!product) return;

    const newStock = Number(product.stock) + Number(quantity);

    try {
      await fetch(`http://localhost:5000/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: newStock }),
      });

      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(data);

      setProductId("");
      setQuantity("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Kho</h2>

      <h3>Nhập hàng</h3>

      <div className="form-box">
        <select
          className="input"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">Chọn sản phẩm</option>

          {products.map((p) => (
            <option key={p.productId} value={p.productId}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          className="input"
          type="number"
          placeholder="Số lượng nhập"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button className="btn btn-primary" onClick={importStock}>
          Nhập kho
        </button>
      </div>

      <hr />

      <table className="table">
        <thead>
          <tr>
            <th className="th">Tên sản phẩm</th>
            <th className="th text-center">Tồn kho</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="2" className="td empty">
                Chưa có sản phẩm
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.productId}>
                <td className="td">{p.name}</td>

                <td
                  className="td text-center"
                  style={{
                    color:
                      p.stock === 0 ? "red" : p.stock < 10 ? "orange" : "green",
                  }}
                >
                  {p.stock}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
