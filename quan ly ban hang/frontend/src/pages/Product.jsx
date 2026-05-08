import { useState } from "react";

export default function Product({ products, setProducts }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [importPrice, setImportPrice] = useState("");

  // image
  const [image, setImage] = useState("");

  // search
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // edit
  const [editingId, setEditingId] = useState(null);

  const role = localStorage.getItem("role");

  // load products
  const loadProduct = async () => {
    const res = await fetch("http://localhost:5000/products");

    const data = await res.json();

    setProducts(data);
  };

  // search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // upload image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // add product
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
          categoryId: 1,
          image,
          importPrice: Number(importPrice),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi");

        return;
      }

      await loadProduct();

      // reset
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

  // update product
  const updateProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price || 0),
          stock: parseInt(stock || 0),
          image,
          importPrice: parseFloat(importPrice || 0),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi cập nhật");
        return;
      }

      await loadProduct();

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

  // remove product
  const removeProduct = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

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
            {/* name */}
            <input
              className="input"
              type="text"
              placeholder="Tên sản phẩm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* import price */}
            <input
              className="input"
              type="number"
              placeholder="Giá nhập"
              value={importPrice}
              onChange={(e) => setImportPrice(e.target.value)}
            />

            {/* sell price */}
            <input
              className="input"
              type="number"
              placeholder="Giá bán"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            {/* stock */}
            <input
              className="input"
              type="number"
              placeholder="Số lượng"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />

            {/* image */}
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {/* preview image */}
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

                {/* import price */}
                <td className="td">
                  {Number(p.importPrice || 0).toLocaleString()} VNĐ
                </td>

                {/* sell price */}
                <td className="td">{Number(p.price).toLocaleString()} VNĐ</td>

                {/* stock */}
                <td className="td">{p.stock}</td>

                {/* actions */}
                {role === "manager" && (
                  <td className="td">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setEditingId(p.productId);

                        setName(p.name);

                        setImportPrice(p.importPrice || "");

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
