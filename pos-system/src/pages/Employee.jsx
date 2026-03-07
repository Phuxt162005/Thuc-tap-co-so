import { useState } from "react";

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const addEmployee = () => {
    const newEmployee = {
      id: Date.now(),
      name,
      role,
    };

    setEmployees([...employees, newEmployee]);

    setName("");
    setRole("");
  };

  return (
    <div>
      <h2>Quản lý nhân viên</h2>

      <input
        placeholder="Tên nhân viên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Vai trò"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <button onClick={addEmployee}>Thêm</button>

      <hr />

      {employees.map((e) => (
        <div key={e.id}>
          {e.name} - {e.role}
        </div>
      ))}
    </div>
  );
}
