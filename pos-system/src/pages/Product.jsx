import { useState } from "react";

export default function Product({ products, setProducts }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Thêm sản phẩm mới
  const addProduct = () => {
    if (!name || !price || !stock) return;

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price),
      stock: Number(stock),
    };

    setProducts([...products, newProduct]);

    setName("");
    setPrice("");
    setStock("");
  };

  // Xóa sản phẩm
  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div>
      <h2>Sản phẩm</h2>

      <div style={formBox}>
        <input
          style={input}
          type="text"
          placeholder="Tên sản phẩm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={input}
          type="number"
          placeholder="Giá"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          style={input}
          type="number"
          placeholder="Số lượng"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button style={addBtn} onClick={addProduct}>
          Thêm
        </button>
      </div>
      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead style={{ background: "#c9c9c9" }}>
          <tr>
            <th>Tên</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                Chưa có sản phẩm
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td style={cell}>{p.name}</td>
                <td style={cell}>{p.price.toLocaleString()} VNĐ</td>
                <td style={cell}>{p.stock}</td>
                <td style={cell}>
                  <button style={deleteBtn} onClick={() => removeProduct(p.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
const formBox = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const input = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const addBtn = {
  background: "#1976d2",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#e53935",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

const cell = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  textAlign: "center",
};
