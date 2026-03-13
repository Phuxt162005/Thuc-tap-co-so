import { useState } from "react";

export default function Inventory({ products, setProducts }) {
  const [id, setId] = useState("");
  const [quantity, setQuantity] = useState("");

  // Thêm sản phẩm
  const importStock = () => {
    const updated = products.map((p) =>
      p.id === Number(id) ? { ...p, stock: p.stock + Number(quantity) } : p,
    );

    setProducts(updated);

    setId("");
    setQuantity("");
  };

  return (
    <div>
      <h2>Kho</h2>

      <h3>Nhập hàng</h3>

      <input
        placeholder="ID sản phẩm"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <input
        type="number"
        placeholder="Số lượng nhập"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <button onClick={importStock}>Nhập kho</button>

      <hr />

      <h3>Kho hàng</h3>

      {products.map((p) => (
        <div key={p.id}>
          {p.name} - Tồn kho: {p.stock}
        </div>
      ))}
    </div>
  );
}
