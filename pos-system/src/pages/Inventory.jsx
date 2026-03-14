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

      <div style={importBox}>
        <select
          style={input}
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
          style={input}
          type="number"
          placeholder="Số lượng nhập"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button style={importBtn} onClick={importStock}>
          Nhập kho
        </button>
      </div>

      <hr />

      <table style={table}>
        <thead>
          <tr>
            <th style={{ ...header, width: "70%" }}>Tên sản phẩm</th>
            <th style={{ ...header, width: "30%", textAlign: "center" }}>
              Tồn kho
            </th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="2" style={empty}>
                Chưa có sản phẩm
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td style={cell}>{p.name}</td>

                <td
                  style={{
                    ...cell,
                    textAlign: "center",
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

const importBox = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const input = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const importBtn = {
  background: "#1976d2",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  tableLayout: "fixed",
};

const header = {
  padding: "12px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
};

const cell = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

const empty = {
  textAlign: "center",
  padding: "30px",
  color: "#777",
};
