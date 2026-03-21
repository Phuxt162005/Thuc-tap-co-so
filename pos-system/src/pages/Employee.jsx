import { useState } from "react";

export default function Employee({ employees, setEmployees, branches }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dob, setDob] = useState("");
  const [branch, setBranch] = useState("");

  // lấy tên chi nhánh
  const getBranchName = (id) => {
    const b = branches.find((b) => b.id === id);
    return b ? b.name : "";
  };

  // thêm nhân viên
  const addEmployee = () => {
    if (!name.trim() || !dob || !role || branch === "") {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const newEmployee = {
      id: Date.now(),
      name: name.trim(),
      dob,
      role,
      branch: Number(branch),

      workDays: 0,
      salary: 0,
      leavePaid: 0,
      leaveUnpaid: 0,
      bonus: 0,
    };

    setEmployees((prev) => [...prev, newEmployee]);

    setName("");
    setRole("");
    setDob("");
    setBranch("");
  };

  // update field
  const updateField = (id, field, value) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  };

  // khi rời input → set về 0 nếu rỗng
  const handleBlur = (id, field, value) => {
    if (value === "") {
      updateField(id, field, 0);
    }
  };

  // xóa
  const removeEmployee = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div>
      <h2>Quản lý nhân viên</h2>

      {/* form */}
      <div style={formBox}>
        <select
          style={input}
          value={branch}
          onChange={(e) => setBranch(Number(e.target.value))}
        >
          <option value="">Chọn chi nhánh</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <input
          style={input}
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <p>Ngày sinh:</p>
        <input
          style={input}
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <select
          style={input}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Chức vụ</option>
          <option>Nhân viên bán hàng</option>
          <option>Nhân viên quản lý</option>
        </select>

        <button style={addBtn} onClick={addEmployee}>
          Thêm
        </button>
      </div>

      <hr />

      {/* table */}
      <table style={table}>
        <thead>
          <tr>
            <th style={header}>Tên</th>
            <th style={header}>Ngày sinh</th>
            <th style={header}>Chi nhánh</th>
            <th style={header}>Chức vụ</th>
            <th style={header}>Ngày làm</th>
            <th style={header}>Lương</th>
            <th style={header}>Nghỉ phép</th>
            <th style={header}>Nghỉ không phép</th>
            <th style={header}>Thưởng</th>
            <th style={header}>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="10" style={empty}>
                Chưa có nhân viên
              </td>
            </tr>
          ) : (
            employees.map((e) => (
              <tr key={e.id}>
                <td style={cell}>{e.name}</td>
                <td style={cell}>
                  {new Date(e.dob).toLocaleDateString("vi-VN")}
                </td>
                <td style={cell}>{getBranchName(e.branch)}</td>
                <td style={cell}>{e.role}</td>

                {/* workDays */}
                <td style={cell}>
                  <input
                    type="number"
                    value={e.workDays || ""}
                    onChange={(ev) =>
                      updateField(e.id, "workDays", ev.target.value)
                    }
                    onBlur={(ev) =>
                      handleBlur(e.id, "workDays", ev.target.value)
                    }
                    style={inputSmall}
                  />
                </td>

                {/* lương */}
                <td style={cell}>
                  <input
                    type="number"
                    value={e.salary || ""}
                    onChange={(ev) =>
                      updateField(e.id, "salary", ev.target.value)
                    }
                    onBlur={(ev) => handleBlur(e.id, "salary", ev.target.value)}
                    style={inputSmall}
                  />
                  VNĐ
                </td>

                {/* leavePaid */}
                <td style={cell}>
                  <input
                    type="number"
                    value={e.leavePaid || ""}
                    onChange={(ev) =>
                      updateField(e.id, "leavePaid", ev.target.value)
                    }
                    onBlur={(ev) =>
                      handleBlur(e.id, "leavePaid", ev.target.value)
                    }
                    style={inputSmall}
                  />
                </td>

                {/* leaveUnpaid */}
                <td style={cell}>
                  <input
                    type="number"
                    value={e.leaveUnpaid || ""}
                    onChange={(ev) =>
                      updateField(e.id, "leaveUnpaid", ev.target.value)
                    }
                    onBlur={(ev) =>
                      handleBlur(e.id, "leaveUnpaid", ev.target.value)
                    }
                    style={inputSmall}
                  />
                </td>

                {/* bonus */}
                <td style={cell}>
                  <input
                    type="number"
                    value={e.bonus || ""}
                    onChange={(ev) =>
                      updateField(e.id, "bonus", ev.target.value)
                    }
                    onBlur={(ev) => handleBlur(e.id, "bonus", ev.target.value)}
                    style={inputSmall}
                  />
                </td>

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
  flexWrap: "wrap",
};

const input = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const inputSmall = {
  width: "70px",
  padding: "5px",
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
