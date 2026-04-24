import { useState } from "react";
import backgrImg from "../assets/img/back-ground-login.jpg";

export default function Login({ setIsLogin, setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // xử lý nhập tài khoản mật khẩu
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi đăng nhập");
        return;
      }

      // lưu role
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      setRole(data.role);
      setIsLogin(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-wrapper">
      <div
        className="login-background"
        style={{ backgroundImage: `url(${backgrImg})` }}
      ></div>

      <div className="login-container">
        <h1 className="login-title">Quản lý bán hàng</h1>
        <h2 className="login-subtitle">Đăng nhập</h2>

        <input
          className="input"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary" onClick={handleLogin}>
          Login
        </button>

        <div className="link-box">
          <span className="link">Đăng ký</span>
          <span className="link">Quên mật khẩu</span>
        </div>
      </div>
    </div>
  );
}
