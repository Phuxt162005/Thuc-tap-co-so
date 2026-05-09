import { useEffect, useState } from "react";

export default function Inventory({ products, setProducts }) {
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // sort
  const [nameSort, setNameSort] = useState("asc");
  const [stockSort, setStockSort] = useState("default");

  // import history
  const [importHistory, setImportHistory] = useState([]);
  const [importDate, setImportDate] = useState("");

  useEffect(() => {
    loadProducts();
    loadImports();
  }, []);

  // load products
  const loadProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();

      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  // load imports
  const loadImports = async () => {
    try {
      const res = await fetch("http://localhost:5000/imports");
      const data = await res.json();

      setImportHistory(data);
    } catch (err) {
      console.log(err);
    }
  };

  // nhập kho
  const importStock = async () => {
    if (!selectedProduct || !quantity) {
      alert("Vui lòng nhập đầy đủ");
      return;
    }

    try {
      const qty = Number(quantity);

      if (qty <= 0) {
        alert("Số lượng nhập không hợp lệ");
        return;
      }

      const newStock = Number(selectedProduct.stock || 0) + qty;

      const newTotalImported = Number(selectedProduct.totalImported || 0) + qty;

      const newImportPrice =
        Number(selectedProduct.importUnitPrice || 0) * newTotalImported;

      // update product
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

            importUnitPrice: selectedProduct.importUnitPrice || 0,

            totalImported: newTotalImported,

            importPrice: newImportPrice,

            branchId: selectedProduct.branchId,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi nhập kho");
        return;
      }

      // save import history
      await fetch("http://localhost:5000/imports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          productId: selectedProduct.productId,

          quantity: qty,

          totalPrice: qty * Number(selectedProduct.importUnitPrice || 0),

          branchId: selectedProduct.branchId,
        }),
      });

      await loadProducts();
      await loadImports();

      setQuantity("");
      setSelectedProduct(null);
      setSearch("");

      alert("Nhập kho thành công");
    } catch (err) {
      console.log(err);
      alert("Lỗi nhập kho");
    }
  };

  // search
  let filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // sort name
  filteredProducts.sort((a, b) => {
    if (nameSort === "asc") {
      return a.name.localeCompare(b.name);
    }

    return b.name.localeCompare(a.name);
  });

  // sort stock
  if (stockSort === "asc") {
    filteredProducts.sort((a, b) => a.stock - b.stock);
  }

  if (stockSort === "desc") {
    filteredProducts.sort((a, b) => b.stock - a.stock);
  }

  // filter import by day
  const filteredImports = importHistory.filter((item) => {
    if (!importDate) return true;

    const itemDate = new Date(item.importDate);

    // yyyy-mm-dd theo local máy
    const itemLocalDate = itemDate.toLocaleDateString("sv-SE");

    return itemLocalDate === importDate;
  });

  // total import by selected day
  const totalImportByDate = filteredImports.reduce(
    (sum, item) => sum + Number(item.totalPrice || 0),
    0,
  );

  // total import warehouse
  const totalInventoryImport = filteredProducts.reduce(
    (sum, p) => sum + Number(p.importPrice || 0),
    0,
  );

  return (
    <div>
      <h2>Kho</h2>

      <h3>Nhập hàng</h3>

      <div className="form-box">
        <input
          className="input"
          placeholder="Tìm kiếm sản phẩm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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

      {/* select product */}
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

      {/* date filter */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div>
          <label>Ngày nhập kho</label>

          <input
            type="date"
            className="input"
            value={importDate}
            onChange={(e) => setImportDate(e.target.value)}
          />
        </div>

        <div
          style={{
            background: "#f5f5f5",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h4>
            {importDate
              ? `Tổng nhập ngày ${new Date(importDate).toLocaleDateString(
                  "vi-VN",
                )}`
              : "Tổng nhập tất cả ngày"}
          </h4>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#1976d2",
            }}
          >
            {totalImportByDate.toLocaleString()} VNĐ
          </div>
        </div>

        <div
          style={{
            background: "#f5f5f5",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h4>Tổng tiền nhập kho</h4>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "green",
            }}
          >
            {totalInventoryImport.toLocaleString()} VNĐ
          </div>
        </div>
      </div>

      {/* table */}
      <table className="table">
        <thead>
          <tr>
            <th>Tên SP</th>
            <th>Giá nhập</th>
            <th>Tổng SL nhập</th>
            <th>Tổng giá nhập</th>
            <th>Tồn kho</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.productId}>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {p.image && <img src={p.image} alt="" width="50" />}

                  {p.name}
                </div>
              </td>

              <td>{Number(p.importUnitPrice || 0).toLocaleString()} VNĐ</td>

              <td>{p.totalImported || 0}</td>

              <td>{Number(p.importPrice || 0).toLocaleString()} VNĐ</td>

              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h3>Lịch sử nhập kho</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Ngày nhập</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>

        <tbody>
          {filteredImports.map((item) => (
            <tr key={item.importId}>
              <td>{new Date(item.importDate).toLocaleString("vi-VN")}</td>

              <td>{item.name}</td>

              <td>{item.quantity}</td>

              <td>{Number(item.totalPrice).toLocaleString()} VNĐ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
