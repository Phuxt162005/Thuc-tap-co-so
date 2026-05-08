import { useState } from "react";

export default function Branch({ branches, setBranches, employees }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // edit
  const [editingId, setEditingId] = useState(null);

  // load branch
  const loadBranches = async () => {
    const res = await fetch("http://localhost:5000/branches");

    const data = await res.json();

    setBranches(data);
  };

  // thêm chi nhánh
  const addBranch = async () => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên chi nhánh");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          address,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi");
        return;
      }

      await loadBranches();

      setName("");
      setAddress("");
      setPhone("");

      alert("Thêm chi nhánh thành công");
    } catch (err) {
      console.log(err);
    }
  };

  // sửa chi nhánh
  const updateBranch = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/branches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          address,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi cập nhật");
        return;
      }

      await loadBranches();

      setEditingId(null);

      setName("");
      setAddress("");
      setPhone("");

      alert("Cập nhật thành công");
    } catch (err) {
      console.log(err);
    }
  };

  // xóa chi nhánh
  const removeBranch = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    try {
      await fetch(`http://localhost:5000/branches/${id}`, {
        method: "DELETE",
      });

      await loadBranches();

      alert("Xóa thành công");
    } catch (err) {
      console.log(err);
    }
  };

  // tìm kiếm
  const filteredBranches = branches.filter((b) => {
    const keyword = search.toLowerCase();

    // tìm theo role
    const hasRole =
      keyword === "quản lý" || keyword === "manager"
        ? count(b.branchId, "manager") > 0
        : keyword === "nhân viên" || keyword === "employee"
          ? count(b.branchId, "employee") > 0
          : false;

    return (
      b.name.toLowerCase().includes(keyword) ||
      (b.address || "").toLowerCase().includes(keyword) ||
      (b.phone || "").toLowerCase().includes(keyword) ||
      hasRole
    );
  });

  // đếm role
  const count = (branchId, role) => {
    if (!employees) return 0;

    return employees.filter(
      (e) => Number(e.branchId) === Number(branchId) && e.role === role,
    ).length;
  };

  return (
    <div>
      <h2>Chi nhánh</h2>

      {/* FORM */}
      <div className="form-box">
        <input
          className="input"
          placeholder="Tên chi nhánh"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          className="input"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {editingId ? (
          <button
            className="btn btn-success"
            onClick={() => updateBranch(editingId)}
          >
            Lưu
          </button>
        ) : (
          <button className="btn btn-primary" onClick={addBranch}>
            Thêm
          </button>
        )}
      </div>

      <hr />

      {/* SEARCH */}
      <div className="form-box">
        <input
          className="input"
          placeholder="Tìm kiếm chi nhánh"
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

      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th className="th">Tên chi nhánh</th>

            <th className="th">Địa chỉ</th>

            <th className="th">SĐT</th>

            <th className="th">Nhân viên</th>

            <th className="th">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredBranches.length === 0 ? (
            <tr>
              <td className="td empty" colSpan="5">
                Không tìm thấy chi nhánh
              </td>
            </tr>
          ) : (
            filteredBranches.map((b) => (
              <tr key={b.branchId}>
                <td className="td">{b.name}</td>

                <td className="td">{b.address || "Chưa có"}</td>

                <td className="td">{b.phone || "Chưa có"}</td>

                <td className="td">
                  QL: {count(b.branchId, "manager")}
                  <br />
                  NV: {count(b.branchId, "employee")}
                </td>

                <td className="td">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setEditingId(b.branchId);

                      setName(b.name);

                      setAddress(b.address || "");

                      setPhone(b.phone || "");
                    }}
                  >
                    Sửa
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => removeBranch(b.branchId)}
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
