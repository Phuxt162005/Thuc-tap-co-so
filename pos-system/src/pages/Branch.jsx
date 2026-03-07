import { useState } from "react";

export default function Branch() {
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState("");

  const addBranch = () => {
    const newBranch = {
      id: Date.now(),
      name,
    };

    setBranches([...branches, newBranch]);

    setName("");
  };

  return (
    <div>
      <h2>Chi nhánh</h2>

      <input
        placeholder="Tên chi nhánh"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={addBranch}>Thêm</button>

      <hr />

      {branches.map((b) => (
        <div key={b.id}>{b.name}</div>
      ))}
    </div>
  );
}
