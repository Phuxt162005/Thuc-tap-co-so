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

      <input
        type="text"
        placeholder="Tên sản phẩm"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Giá"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Còn trong kho"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <button onClick={addProduct}>Thêm</button>
      <hr />

      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead style={{ background: "#444" }}>
          <tr>
            <th>Tên</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <td
              key={p.id}
              style={{ padding: "10px", borderBottom: "1px solid #333" }}
            >
              <tv>{p.name}</tv>
              <tv>{p.price}</tv>
              <tv>{p.stock}</tv>
              <tv>
                <button onClick={() => removeProduct(p.id)}>Xóa</button>
              </tv>
            </td>
          ))}
        </tbody>
      </table>
    </div>
  );
}
