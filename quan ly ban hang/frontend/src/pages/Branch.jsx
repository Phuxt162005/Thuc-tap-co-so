import { useState } from "react";

export default function Branch({ branches, setBranches, employees }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // thêm chi nhánh
  const addBranch = async () => {
    if (!name.trim()) {
      alert("Vui lòng nhập đầy đủ");
      return;
    }

    try {
      await fetch("http://localhost:5000/branches", {
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

      const res = await fetch("http://localhost:5000/branches");
      const data = await res.json();

      setBranches(data);

      setName("");
      setAddress("");
      setPhone("");
    } catch (err) {
      console.log(err);
    }
  };

  // tìm chi nhánh
  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.address?.toLowerCase().includes(search.toLowerCase()),
  );

  // xóa chi nhánh
  const removeBranch = async (id) => {
    await fetch(`http://localhost:5000/branches/${id}`, {
      method: "DELETE",
    });

    const res = await fetch("http://localhost:5000/branches");
    const data = await res.json();
    setBranches(data);
  };

  // 1 chi nhánh có bao nhiêu nhân viên
  const count = (branchId, role) => {
    if (!employees) return 0;
    return employees.filter(
      (e) => Number(e.branchId) === Number(branchId) && e.role === role,
    ).length;
  };

  return (
    <div>
      <h2>Chi nhánh</h2>

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

        <button className="btn btn-primary" onClick={addBranch}>
          Thêm
        </button>
      </div>

      <hr />

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
          {branches.length === 0 ? (
            <tr>
              <td className="td empty" colSpan="5">
                Chưa có chi nhánh
              </td>
            </tr>
          ) : (
            branches.map((b) => (
              <tr key={b.branchId}>
                <td className="td">{b.name}</td>
                <td className="td">{b.address || "Chưa có"}</td>
                <td className="td">{b.phone || "Chưa có"}</td>
                <td className="td">-</td>

                <td className="td">
                  QL: {count(b.branchId, "manager")} <br />
                  NV: {count(b.branchId, "employee")}
                </td>

                <td className="td">
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
