import { useState } from "react";

export default function Product({ products, setProducts }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Thêm sản phẩm mới
  const addProduct = () => {
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
  const remove = (id) => {
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

      {products.map((p) => (
        <div key={p.id}>
          {p.name} - {p.price} VNĐ - Kho: {p.stock}
          <button onClick={() => remove(p.id)}>Xóa</button>
        </div>
      ))}
    </div>
  );
}
