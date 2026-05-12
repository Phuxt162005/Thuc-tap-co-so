import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Employee({ employees, setEmployees, branches }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState(null);
  const [branch, setBranch] = useState("");
  const [salary, setSalary] = useState("");
  const [phone, setPhone] = useState("");

  // login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // role
  const [role, setRole] = useState("employee");

  // search
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // edit
  const [editingId, setEditingId] = useState(null);
  const roleLogin = localStorage.getItem("role");

  // token
  const token = localStorage.getItem("token");

  // lấy tên chi nhánh
  const getBranchName = (id) => {
    const b = (branches || []).find((b) => Number(b.branchId) === Number(id));
    return b ? b.name : "";
  };

  // load employee
  const loadEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Không tải được nhân viên");
        return;
      }

      const branchId = Number(localStorage.getItem("branchId"));

      const filteredData =
        roleLogin === "admin"
          ? data
          : data.filter((e) => Number(e.branchId) === branchId);

      setEmployees(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  // tìm kiếm
  const filteredEmployees = (employees || []).filter((e) => {
    const keyword = search.toLowerCase();

    return (
      (e.name || "").toLowerCase().includes(keyword) ||
      getBranchName(e.branchId).toLowerCase().includes(keyword) ||
      (e.username || "").toLowerCase().includes(keyword)
    );
  });

  // thêm nhân viên
  const addEmployee = async () => {
    const branchId =
      roleLogin === "manager"
        ? Number(localStorage.getItem("branchId"))
        : Number(branch);

    if (!name.trim() || !dob || !branchId) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          dob: dob ? dob.toISOString().split("T")[0] : null,
          phone,
          branchId:
            roleLogin === "manager"
              ? Number(localStorage.getItem("branchId"))
              : Number(branch),
          username: roleLogin === "admin" ? username : null,
          password: roleLogin === "admin" ? password : null,
          role: roleLogin === "admin" ? role : "employee",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi thêm nhân viên");
        return;
      }

      // thêm payroll
      // thêm payroll
      if (salary) {
        await fetch("http://localhost:5000/payroll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employeeId: data.employeeId,
            basicSalary: Number(salary),
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          }),
        });
      }
      await loadEmployees();

      // reset
      setName("");
      setDob(null);
      setPhone("");
      setBranch("");
      setSalary("");
      setUsername("");
      setPassword("");
      setRole("employee");

      alert("Thêm nhân viên thành công");
    } catch (err) {
      console.log(err);
    }
  };

  // sửa nhân viên
  const updateEmployee = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          dob: dob ? dob.toISOString().split("T")[0] : null,
          phone,
          branchId:
            roleLogin === "manager"
              ? Number(localStorage.getItem("branchId"))
              : Number(branch),
          username,
          password,
          role,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi cập nhật");
        return;
      }

      // update payroll
      await fetch("http://localhost:5000/payroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: id,
          basicSalary: Number(salary),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        }),
      });
      await loadEmployees();

      setEditingId(null);
      setName("");
      setDob(null);
      setBranch("");
      setSalary("");
      setPhone("");
      setUsername("");
      setPassword("");
      setRole("employee");

      alert("Cập nhật thành công");
    } catch (err) {
      console.log(err);
    }
  };

  // xóa nhân viên
  const removeEmployee = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    try {
      const res = await fetch(`http://localhost:5000/employees/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi xóa");
        return;
      }
      await loadEmployees();

      alert("Xóa thành công");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Quản lý nhân viên</h2>

      {/* form */}
      <div className="form-box">
        <select
          className="input"
          value={
            roleLogin === "manager" ? localStorage.getItem("branchId") : branch
          }
          onChange={(e) => setBranch(e.target.value)}
          disabled={roleLogin !== "admin"}
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
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <p>Ngày sinh:</p>

        <DatePicker
          selected={dob}
          onChange={(date) => setDob(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Chọn ngày sinh"
          className="input"
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          maxDate={new Date()}
        />

        {/* lương */}
        <input
          className="input"
          type="number"
          placeholder="Lương"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

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

            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="employee">Nhân viên</option>

              <option value="manager">Quản lý</option>
            </select>
          </>
        )}

        {editingId !== null ? (
          <button
            className="btn btn-success"
            onClick={() => updateEmployee(editingId)}
          >
            Lưu
          </button>
        ) : (
          <button className="btn btn-primary" onClick={addEmployee}>
            Thêm
          </button>
        )}
      </div>

      <hr />

      {/* table */}
      <table className="table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Ngày sinh</th>
            <th>Số điện thoại</th>
            <th>Chi nhánh</th>
            <th>Lương</th>
            {roleLogin === "admin" && <th>Username</th>}
            {roleLogin === "admin" && <th>Password</th>}
            {roleLogin === "admin" && <th>Vai trò</th>}
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan={roleLogin === "admin" ? 8 : 6} className="td empty">
                Không có nhân viên
              </td>
            </tr>
          ) : (
            filteredEmployees.map((e) => (
              <tr key={e.employeeId}>
                <td>{e.name}</td>
                <td>
                  {e.dob ? new Date(e.dob).toLocaleDateString("vi-VN") : ""}
                </td>
                <td>{e.phone}</td>
                <td>{getBranchName(e.branchId)}</td>
                <td>
                  {Number(e.basicSalary || 0).toLocaleString("vi-VN")} VNĐ
                </td>
                {roleLogin === "admin" && <td>{e.username}</td>}
                {roleLogin === "admin" && <td>{e.password}</td>}
                {roleLogin === "admin" && (
                  <td>{e.role === "manager" ? "Quản lý" : "Nhân viên"}</td>
                )}
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setEditingId(e.employeeId);
                      setName(e.name);
                      setDob(e.dob ? new Date(e.dob) : null);
                      setPhone(e.phone || "");
                      setBranch(String(e.branchId));
                      setSalary(String(e.basicSalary || ""));
                      setUsername(e.username || "");
                      setPassword(e.password || "");
                      setRole(e.role || "employee");
                    }}
                  >
                    Sửa
                  </button>

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
