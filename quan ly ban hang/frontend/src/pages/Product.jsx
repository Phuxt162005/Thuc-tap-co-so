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

      <div className="form-box">
        <input
          className="input"
          type="text"
          placeholder="Tên sản phẩm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          type="number"
          placeholder="Giá"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="input"
          type="number"
          placeholder="Số lượng"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button className="btn btn-primary" onClick={addProduct}>
          Thêm
        </button>
      </div>
      <table className="table">
        <thead style={{ background: "#c9c9c9" }}>
          <tr>
            <th className="th">Tên</th>
            <th className="th">Giá</th>
            <th className="th">Tồn kho</th>
            <th className="th">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="4" className="td empty">
                Chưa có sản phẩm
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td className="td">{p.name}</td>
                <td className="td">{p.price.toLocaleString()} VNĐ</td>
                <td className="td">{p.stock}</td>
                <td className="td">
                  <button
                    className="btn btn-danger"
                    onClick={() => removeProduct(p.id)}
                  >
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
