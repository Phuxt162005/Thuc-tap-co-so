import { useState } from "react";

export default function Login({ setIsLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // xử lý nhập tài khoản mật khẩu
  const handleLogin = () => {
    if (username === "admin" && password === "123456") {
      setIsLogin(true);
    } else {
      alert("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div style={container}>
      <h2>POS Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

const container = {
  width: "300px",
  margin: "100px auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
