import { useState } from "react";

export default function Branch({ branches, setBranches }) {
  const [name, setName] = useState("");

  const addBranch = () => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên chi nhánh");
      return;
    }

    const newBranch = {
      id: Date.now(),
      name: name.trim(),
    };

    setBranches((prev) => [...prev, newBranch]);
    setName("");
  };

  const removeBranch = (id) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div>
      <h2>Chi nhánh</h2>

      <div style={formBox}>
        <input
          style={input}
          placeholder="Tên chi nhánh"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button style={addBtn} onClick={addBranch}>
          Thêm
        </button>
      </div>

      <hr />

      <table style={table}>
        <thead>
          <tr>
            <th style={header}>Tên chi nhánh</th>
            <th style={header}>Action</th>
          </tr>
        </thead>

        <tbody>
          {branches.length === 0 ? (
            <tr>
              <td colSpan="2" style={empty}>
                Chưa có chi nhánh
              </td>
            </tr>
          ) : (
            branches.map((b) => (
              <tr key={b.id}>
                <td style={cell}>{b.name}</td>

                <td style={cell}>
                  <button style={deleteBtn} onClick={() => removeBranch(b.id)}>
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
