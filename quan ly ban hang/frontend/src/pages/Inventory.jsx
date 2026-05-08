import { useState } from "react";

export default function Inventory({ products, setProducts }) {
  const [search, setSearch] = useState("");

  const [quantity, setQuantity] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);

  // sort
  const [nameSort, setNameSort] = useState("asc");

  const [stockSort, setStockSort] = useState("default");

  // load product
  const loadProducts = async () => {
    const res = await fetch("http://localhost:5000/products");

    const data = await res.json();

    setProducts(data);
  };

  // nhập kho
  const importStock = async () => {
    if (!selectedProduct || !quantity) {
      alert("Vui lòng nhập đầy đủ");

      return;
    }

    try {
      const newStock = Number(selectedProduct.stock) + Number(quantity);

      const res = await fetch(
        `http://localhost:5000/products/${selectedProduct.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: selectedProduct.name,
            price: selectedProduct.price,
            stock: newStock,
            image: selectedProduct.image || "",
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi");

        return;
      }

      await loadProducts();

      setQuantity("");

      setSelectedProduct(null);

      setSearch("");

      alert("Nhập kho thành công");
    } catch (err) {
      console.log(err);
    }
  };

  // filter search
  let filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // sort tên
  filteredProducts.sort((a, b) => {
    if (nameSort === "asc") {
      return a.name.localeCompare(b.name);
    }

    return b.name.localeCompare(a.name);
  });

  // sort tồn kho
  if (stockSort === "asc") {
    filteredProducts.sort((a, b) => a.stock - b.stock);
  }

  if (stockSort === "desc") {
    filteredProducts.sort((a, b) => b.stock - a.stock);
  }

  return (
    <div>
      <h2>Kho</h2>

      <h3>Nhập hàng</h3>

      <div className="form-box">
        {/* tìm sản phẩm */}
        <input
          className="input"
          placeholder="Tìm kiếm sản phẩm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* số lượng */}
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

      {/* chọn sản phẩm */}
      {search && (
        <div
          style={{
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "6px",
            marginBottom: "20px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {filteredProducts.map((p) => (
            <div
              key={p.productId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onClick={() => {
                setSelectedProduct(p);

                setSearch(p.name);
              }}
            >
              {p.image && (
                <img
                  src={p.image}
                  alt=""
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              )}

              <span>{p.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* sort */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <select
          className="input"
          value={nameSort}
          onChange={(e) => setNameSort(e.target.value)}
        >
          <option value="asc">Tên A → Z</option>

          <option value="desc">Tên Z → A</option>
        </select>

        <select
          className="input"
          value={stockSort}
          onChange={(e) => setStockSort(e.target.value)}
        >
          <option value="default">Tồn kho mặc định</option>

          <option value="asc">Tồn kho tăng dần</option>

          <option value="desc">Tồn kho giảm dần</option>
        </select>
      </div>

      {/* table */}
      <table className="table">
        <thead>
          <tr>
            <th className="th">Tên sản phẩm</th>

            <th className="th">Tổng giá nhập</th>

            <th className="th">Tồn kho</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td className="td empty" colSpan="3">
                Không có sản phẩm
              </td>
            </tr>
          ) : (
            filteredProducts.map((p) => (
              <tr key={p.productId}>
                <td className="td">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {p.image && (
                      <img
                        src={p.image}
                        alt=""
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    )}

                    <span>{p.name}</span>
                  </div>
                </td>

                <td
                  className="td"
                  style={{
                    color: "#1976d2",
                    fontWeight: "bold",
                  }}
                >
                  {(
                    Number(p.stock) * Number(p.importPrice || 0)
                  ).toLocaleString()}{" "}
                  VNĐ
                </td>

                <td
                  className="td"
                  style={{
                    color: "green",
                    fontWeight: "bold",
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
