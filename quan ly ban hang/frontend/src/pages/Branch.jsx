import { useState } from "react";

export default function Branch({ branches, setBranches, employees }) {
  const [name, setName] = useState("");
  const [openDate, setOpenDate] = useState("");

  // thêm chi nhánh
  const addBranch = async () => {
    if (!name.trim() || !openDate) {
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
          address: "Chưa có",
          phone: Date.now().toString(),
        }),
      });

      const res = await fetch("http://localhost:5000/branches");
      const data = await res.json();

      setBranches(data);

      setName("");
    } catch (err) {
      console.log(err);
    }
  };

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
    return employees.filter((e) => Number(e.branchId) === Number(branchId))
      .length;
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
          type="date"
          value={openDate}
          onChange={(e) => setOpenDate(e.target.value)}
        />

        <button className="btn btn-primary" onClick={addBranch}>
          Thêm
        </button>
      </div>

      <hr />

      <table className="table">
        <thead>
          <tr>
            <th className="th">Tên chi nhánh</th>
            <th className="th">Ngày mở</th>
            <th className="th">Nhân viên</th>
            <th className="th">Action</th>
          </tr>
        </thead>

        <tbody>
          {branches.length === 0 ? (
            <tr>
              <td className="td empty" colSpan="4">
                Chưa có chi nhánh
              </td>
            </tr>
          ) : (
            branches.map((b) => (
              <tr key={b.branchId}>
                <td className="td">{b.name}</td>
                <td className="td">-</td>

                <td className="td">
                  QL: {count(b.id, "Nhân viên quản lý")} <br />
                  NV: {count(b.id, "Nhân viên bán hàng")}
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
