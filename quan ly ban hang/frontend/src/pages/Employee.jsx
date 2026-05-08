import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Employee({ employees, setEmployees, branches }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState(null);
  const [branch, setBranch] = useState("");

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

  // lấy tên chi nhánh
  const getBranchName = (id) => {
    const b = branches.find((b) => Number(b.branchId) === Number(id));

    return b ? b.name : "";
  };

  // load employee
  const loadEmployees = async () => {
    const res = await fetch("http://localhost:5000/employees");

    const data = await res.json();

    setEmployees(data);
  };

  // tìm kiếm
  const filteredEmployees = employees.filter((e) => {
    const keyword = search.toLowerCase();

    // tìm role gần đúng
    const managerKeywords = [
      "q",
      "qu",
      "qua",
      "quan",
      "quản",
      "ql",
      "m",
      "ma",
      "man",
      "mana",
      "manager",
    ];

    const employeeKeywords = [
      "n",
      "nh",
      "nha",
      "nhan",
      "nhân",
      "nv",
      "e",
      "em",
      "emp",
      "empl",
      "employee",
      "s",
      "st",
      "sta",
      "staf",
      "staff",
    ];

    const roleMatch =
      (managerKeywords.some((k) => k.includes(keyword)) &&
        e.role === "manager") ||
      (employeeKeywords.some((k) => k.includes(keyword)) &&
        e.role === "employee");

    return (
      e.name.toLowerCase().includes(keyword) ||
      getBranchName(e.branchId).toLowerCase().includes(keyword) ||
      (e.username || "").toLowerCase().includes(keyword) ||
      roleMatch
    );
  });

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

          dob: dob ? dob.toISOString().split("T")[0] : null,

          phone: "",

          branchId: Number(branch),

          username: roleLogin === "admin" ? username : null,

          password: roleLogin === "admin" ? password : null,

          role: roleLogin === "admin" ? role : "employee",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi");
        return;
      }

      await loadEmployees();

      // reset
      setName("");
      setDob(null);
      setBranch("");
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
        },
        body: JSON.stringify({
          name,

          dob: dob ? dob.toISOString().split("T")[0] : null,

          branchId: Number(branch),

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

      await loadEmployees();

      setEditingId(null);

      // reset
      setName("");
      setDob(null);
      setBranch("");
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
      await fetch(`http://localhost:5000/employees/${id}`, {
        method: "DELETE",
      });

      await loadEmployees();

      alert("Xóa thành công");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Quản lý nhân viên</h2>

      {/* FORM */}
      <div className="form-box">
        {/* branch */}
        <select
          className="input"
          value={branch}
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

        {/* name */}
        <input
          className="input"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <p>Ngày sinh:</p>
        {/* dob */}
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

        {/* admin */}
        {roleLogin === "admin" && (
          <>
            {/* username */}
            <input
              className="input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {/* password */}
            <input
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* role */}
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

        {/* button */}
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

      {/* search */}
      <div className="form-box">
        <input
          className="input"
          placeholder="Tìm kiếm nhân viên"
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
            <th>Tên</th>
            <th>Ngày sinh</th>
            <th>Chi nhánh</th>

            {roleLogin === "admin" && <th>Username</th>}

            {roleLogin === "admin" && <th>Password</th>}

            {roleLogin === "admin" && <th>Vai trò</th>}

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan={roleLogin === "admin" ? 7 : 4}>
                Không tìm thấy nhân viên
              </td>
            </tr>
          ) : (
            filteredEmployees.map((e) => (
              <tr key={e.employeeId}>
                <td>{e.name}</td>

                <td>
                  {e.dob ? new Date(e.dob).toLocaleDateString("vi-VN") : ""}
                </td>

                <td>{getBranchName(e.branchId)}</td>

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

                      setBranch(String(e.branchId));

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
