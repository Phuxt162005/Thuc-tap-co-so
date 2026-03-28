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

  // tính lương nhân viên
  const calculateSalary = (e) => {
    const work = Number(e.workDays || 0);
    const base = Number(e.salary || 0);
    const bonus = Number(e.bonus || 0);
    const unpaid = Number(e.leaveUnpaid || 0);

    return work * base + bonus;
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
      <div className="form-box">
        <select
          className="input"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="">Chọn chi nhánh</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
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

        <p>Ngày sinh:</p>
        <input
          className="input"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <select
          className="input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Chức vụ</option>
          <option>Nhân viên bán hàng</option>
          <option>Nhân viên quản lý</option>
        </select>

        <button className="btn btn-primary" onClick={addEmployee}>
          Thêm
        </button>
      </div>

      <hr />

      {/* table */}
      <table className="table">
        <thead>
          <tr>
            <th className="th">Tên</th>
            <th className="th">Ngày sinh</th>
            <th className="th">Chi nhánh</th>
            <th className="th">Chức vụ</th>
            <th className="th">Ngày làm</th>
            <th className="th">Lương</th>
            <th className="th">Nghỉ phép</th>
            <th className="th">Nghỉ không phép</th>
            <th className="th">Thưởng</th>
            <th className="th">Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="10" className="td empty">
                Chưa có nhân viên
              </td>
            </tr>
          ) : (
            employees.map((e) => (
              <tr key={e.id}>
                <td className="td">{e.name}</td>
                <td className="td">
                  {new Date(e.dob).toLocaleDateString("vi-VN")}
                </td>
                <td className="td">{getBranchName(e.branch)}</td>
                <td className="td">{e.role}</td>

                {/* workDays */}
                <td className="td">
                  <input
                    className="input-small"
                    type="number"
                    value={e.workDays || ""}
                    onChange={(ev) =>
                      updateField(e.id, "workDays", ev.target.value)
                    }
                    onBlur={(ev) =>
                      handleBlur(e.id, "workDays", ev.target.value)
                    }
                  />
                </td>

                {/* lương */}
                <td className="td">
                  <input
                    type="number"
                    className="input-small"
                    value={e.salary || ""}
                    onChange={(ev) =>
                      updateField(e.id, "salary", ev.target.value)
                    }
                    onBlur={(ev) => handleBlur(e.id, "salary", ev.target.value)}
                  />
                  {calculateSalary(e).toLocaleString()} VNĐ
                </td>

                {/* leavePaid */}
                <td className="td">
                  <input
                    type="number"
                    className="input-small"
                    value={e.leavePaid || ""}
                    onChange={(ev) =>
                      updateField(e.id, "leavePaid", ev.target.value)
                    }
                    onBlur={(ev) =>
                      handleBlur(e.id, "leavePaid", ev.target.value)
                    }
                  />
                </td>

                {/* leaveUnpaid */}
                <td className="td">
                  <input
                    type="number"
                    className="input-small"
                    value={e.leaveUnpaid || ""}
                    onChange={(ev) =>
                      updateField(e.id, "leaveUnpaid", ev.target.value)
                    }
                    onBlur={(ev) =>
                      handleBlur(e.id, "leaveUnpaid", ev.target.value)
                    }
                  />
                </td>

                {/* bonus */}
                <td className="td">
                  <input
                    type="number"
                    className="input-small"
                    value={e.bonus || ""}
                    onChange={(ev) =>
                      updateField(e.id, "bonus", ev.target.value)
                    }
                    onBlur={(ev) => handleBlur(e.id, "bonus", ev.target.value)}
                  />
                </td>

                <td className="td">
                  <button
                    className="btn btn-danger"
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
