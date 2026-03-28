import { useState } from "react";
import backgrImg from "../assets/img/back-ground-login.jpg";

export default function Login({ setIsLogin, setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // xử lý nhập tài khoản mật khẩu
  const handleLogin = () => {
    if (username === "admin" && password === "123") {
      localStorage.setItem("role", "admin");
      setRole("admin");
      setIsLogin(true);
    } else if (username === "nv" && password === "123") {
      localStorage.setItem("role", "employee");
      setRole("employee");
      setIsLogin(true);
    } else if (username === "manager" && password === "123") {
      localStorage.setItem("role", "manager");
      setRole("manager");
      setIsLogin(true);
    } else {
      alert("Sai tài khoản hoặc mật khẩu");
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
