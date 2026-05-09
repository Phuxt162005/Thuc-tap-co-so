import { useState } from "react";

export default function Product({ products, setProducts }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // giá nhập 1 đơn vị sản phẩm
  const [importPrice, setImportPrice] = useState("");

  // image
  const [image, setImage] = useState("");

  // search
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // edit
  const [editingId, setEditingId] = useState(null);

  const role = localStorage.getItem("role");
  const branchId = Number(localStorage.getItem("branchId"));

  // load products
  const loadProduct = async () => {
    const res = await fetch("http://localhost:5000/products");

    const data = await res.json();

    setProducts(data);
  };

  // lọc theo chi nhánh + search
  const filteredProducts = products.filter(
    (p) =>
      Number(p.branchId) === branchId &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // upload ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // thêm sản phẩm
  const addProduct = async () => {
    if (!name || !price || !stock || !importPrice) {
      alert("Nhập đầy đủ thông tin sản phẩm!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          stock: Number(stock),
          image,

          // giá nhập 1 sản phẩm
          importUnitPrice: Number(importPrice),

          // tổng nhập ban đầu
          totalImported: Number(stock),

          categoryId: 1,
          branchId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi");
        return;
      }

      await loadProduct();

      // reset form
      setName("");
      setPrice("");
      setStock("");
      setImportPrice("");
      setImage("");

      alert("Thêm sản phẩm thành công");
    } catch (err) {
      console.log(err);
    }
  };

  // sửa sản phẩm
  const updateProduct = async (id) => {
    try {
      const currentProduct = products.find((p) => p.productId === id);

      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,

          price: Number(price),

          stock: Number(stock),

          image,

          // giữ đúng giá nhập
          importUnitPrice: Number(importPrice || 0),

          // KHÔNG reset số lượng nhập
          totalImported: currentProduct?.totalImported || 0,

          branchId: currentProduct?.branchId || branchId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi cập nhật");
        return;
      }

      await loadProduct();

      // reset
      setEditingId(null);

      setName("");
      setPrice("");
      setStock("");
      setImportPrice("");
      setImage("");

      alert("Cập nhật thành công");
    } catch (err) {
      console.log(err);
    }
  };

  // xóa sản phẩm
  const removeProduct = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) {
      return;
    }

    try {
      await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });

      await loadProduct();

      alert("Xóa thành công");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Sản phẩm</h2>

      {/* manager */}
      {role === "manager" && (
        <>
          <div className="form-box">
            {/* tên */}
            <input
              className="input"
              type="text"
              placeholder="Tên sản phẩm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* giá nhập */}
            <input
              className="input"
              type="number"
              placeholder="Giá nhập"
              value={importPrice}
              onChange={(e) => setImportPrice(e.target.value)}
            />

            {/* giá bán */}
            <input
              className="input"
              type="number"
              placeholder="Giá bán"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            {/* số lượng */}
            <input
              className="input"
              type="number"
              placeholder="Số lượng"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />

            {/* upload ảnh */}
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {/* preview ảnh */}
            {image && (
              <div>
                <img
                  src={image}
                  alt=""
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    marginTop: "10px",
                  }}
                />

                <br />

                <button
                  className="btn btn-danger"
                  style={{
                    marginTop: "10px",
                  }}
                  onClick={() => setImage("")}
                >
                  Xóa ảnh
                </button>
              </div>
            )}

            {/* button */}
            {editingId !== null ? (
              <button
                className="btn btn-success"
                onClick={() => updateProduct(editingId)}
              >
                Lưu
              </button>
            ) : (
              <button className="btn btn-primary" onClick={addProduct}>
                Thêm
              </button>
            )}
          </div>

          <hr />
        </>
      )}

      {/* search */}
      <div className="form-box">
        <input
          className="input"
          placeholder="Tìm kiếm sản phẩm"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={() => setSearch(searchInput)}
        >
          Tìm kiếm
        </button>

        <button
          className="btn"
          onClick={() => {
            setSearch("");
            setSearchInput("");
          }}
        >
          Reset
        </button>
      </div>

      <hr />

      {/* table */}
      <table className="table">
        <thead style={{ background: "#c9c9c9" }}>
          <tr>
            <th className="th">Tên</th>

            <th className="th">Giá nhập</th>

            <th className="th">Giá bán</th>

            <th className="th">Tồn kho</th>

            {role === "manager" && <th className="th">Action</th>}
          </tr>
        </thead>

        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan={role === "manager" ? 5 : 4} className="td empty">
                Không tìm thấy sản phẩm
              </td>
            </tr>
          ) : (
            filteredProducts.map((p) => (
              <tr key={p.productId}>
                {/* image + name */}
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

                {/* giá nhập */}
                <td className="td">
                  {Number(p.importUnitPrice || 0).toLocaleString()} VNĐ
                </td>

                {/* giá bán */}
                <td className="td">{Number(p.price).toLocaleString()} VNĐ</td>

                {/* tồn kho */}
                <td className="td">{p.stock}</td>

                {/* action */}
                {role === "manager" && (
                  <td className="td">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setEditingId(p.productId);

                        setName(p.name);

                        setImportPrice(p.importUnitPrice || "");

                        setPrice(p.price);

                        setStock(p.stock);

                        setImage(p.image || "");
                      }}
                    >
                      Sửa
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => removeProduct(p.productId)}
                    >
                      Xóa
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
