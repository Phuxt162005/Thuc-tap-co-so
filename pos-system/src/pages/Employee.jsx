import { useState } from "react";

export default function Employee({ employees, setEmployees, branches }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState("");

  // thêm nhân viên
  const addEmployee = () => {
    if (!name.trim() || !role || !branch) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const newEmployee = {
      id: Date.now(),
      name: name.trim(),
      role,
      branch,
    };

    setEmployees((prev) => [...prev, newEmployee]);

    setName("");
    setRole("");
    setBranch("");
  };

  // xóa nhân viên
  const removeEmployee = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhân viên này?")) return;
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div>
      <h2>Quản lý nhân viên</h2>

      <div style={formBox}>
        <select
          style={input}
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="">Chọn chi nhánh</option>

          {branches.length === 0 ? (
            <option disabled>Chưa có chi nhánh</option>
          ) : (
            branches.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))
          )}
        </select>

        <input
          style={input}
          placeholder="Tên nhân viên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          style={input}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Chọn vai trò</option>
          <option value="Nhân viên bán hàng">Nhân viên bán hàng</option>
          <option value="Nhân viên quản lý">Nhân viên quản lý</option>
        </select>

        <button style={addBtn} onClick={addEmployee}>
          Thêm
        </button>
      </div>

      <hr />

      <table style={table}>
        <thead>
          <tr>
            <th style={header}>Tên nhân viên</th>
            <th style={header}>Vai trò</th>
            <th style={header}>Chi nhánh</th>
            <th style={header}>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="4" style={empty}>
                Chưa có nhân viên
              </td>
            </tr>
          ) : (
            employees.map((e) => (
              <tr key={e.id}>
                <td style={cell}>{e.name}</td>
                <td style={cell}>{e.role}</td>
                <td style={cell}>{e.branch}</td>

                <td style={cell}>
                  <button
                    style={deleteBtn}
                    onClick={() => removeEmployee(e.id)}
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

const formBox = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const input = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const addBtn = {
  background: "#1976d2",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#e53935",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const header = {
  padding: "12px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
};

const cell = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

const empty = {
  textAlign: "center",
  padding: "30px",
  color: "#777",
};
