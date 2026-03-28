import { useState } from "react";

export default function Inventory({ products, setProducts }) {
  const [id, setId] = useState("");
  const [quantity, setQuantity] = useState("");

  // nhập kho
  const importStock = () => {
    if (!id || !quantity) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const updatedProducts = products.map((p) =>
      p.id === Number(id) ? { ...p, stock: p.stock + Number(quantity) } : p,
    );

    setProducts(updatedProducts);

    setId("");
    setQuantity("");
  };

  return (
    <div>
      <h2>Kho</h2>

      <h3>Nhập hàng</h3>

      <div className="form-box">
        <select
          className="input"
          value={id}
          onChange={(e) => setId(e.target.value)}
        >
          <option value="">Chọn sản phẩm</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
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
              <tr key={p.id}>
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
