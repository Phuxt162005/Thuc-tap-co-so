import { useState } from "react";

export default function Employee({ employees, setEmployees, branches }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dob, setDob] = useState("");
  const [branch, setBranch] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const roleLogin = localStorage.getItem("role");

  // lấy tên chi nhánh
  const getBranchName = (id) => {
    const b = branches.find((b) => b.branchId === id);
    return b ? b.name : "";
  };

  // thêm nhân viên
  const addEmployee = async () => {
    if (!name.trim() || !dob || branch === "") {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          dob,
          phone: "",
          branchId: Number(branch),
          username: roleLogin === "admin" ? username : null,
          password: roleLogin === "admin" ? password : null,
          role: "employee",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi");
        return;
      }

      // reload
      const res2 = await fetch("http://localhost:5000/employees");
      const data2 = await res2.json();
      setEmployees(data2);

      setName("");
      setDob("");
      setBranch("");
      setUsername("");
      setPassword("");
    } catch (err) {
      console.log(err);
    }
  };

  // xóa nhân viên
  const removeEmployee = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    try {
      await fetch(`http://localhost:5000/employees/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: roleLogin }),
      });

      const res = await fetch("http://localhost:5000/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Quản lý nhân viên</h2>

      {/* FORM */}
      <div className="form-box">
        <select
          className="input"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="">Chọn chi nhánh</option>
          {branches.map((b) => (
            <option key={b.branchId} value={b.branchId}>
              {b.name}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        {/* admin */}
        {roleLogin === "admin" && (
          <>
            <input
              className="input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        <button className="btn btn-primary" onClick={addEmployee}>
          Thêm
        </button>
      </div>

      <hr />

      {/* bảng nhân viên */}
      <table className="table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Ngày sinh</th>
            <th>Chi nhánh</th>

            {/* admin */}
            {roleLogin === "admin" && <th>Username</th>}
            {roleLogin === "admin" && <th>Password</th>}

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="6">Chưa có nhân viên</td>
            </tr>
          ) : (
            employees.map((e) => (
              <tr key={e.employeeId}>
                <td>{e.name}</td>
                <td>{new Date(e.dob).toLocaleDateString("vi-VN")}</td>
                <td>{getBranchName(e.branchId)}</td>

                {/* admin */}
                {roleLogin === "admin" && <td>{e.username}</td>}
                {roleLogin === "admin" && <td>{e.password}</td>}

                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeEmployee(e.employeeId)}
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
