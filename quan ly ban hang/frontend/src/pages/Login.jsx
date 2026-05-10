import { useState } from "react";
import backgrImg from "../assets/img/back-ground-login.jpg";
import ForgotPassword from "./ForgotPassword";

export default function Login({ setIsLogin, setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);

  // xử lý đăng nhập
  const handleLogin = async () => {
    try {
      // clear localStorage cũ
      localStorage.clear();

      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Lỗi đăng nhập");
        return;
      }

      // lưu user hiện tại
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);
      localStorage.setItem("branchId", data.branchId);
      localStorage.setItem("employeeId", data.employeeId);
      console.log("LOGIN USER:", data);

      setRole(data.role);
      setIsLogin(true);
    } catch (err) {
      console.log(err);

      alert("Lỗi server");
    }
  };

  // forgot password
  if (forgotMode) {
    return <ForgotPassword setForgotMode={setForgotMode} />;
  }

  return (
    <div className="login-wrapper">
      <div
        className="login-background"
        style={{
          backgroundImage: `url(${backgrImg})`,
        }}
      ></div>

      <div className="login-container">
        <h1 className="login-title">Quản lý bán hàng</h1>

        <h2 className="login-subtitle">Đăng nhập</h2>

        {/* username */}
        <input
          className="input"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* password */}
        <input
          className="input"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* login */}
        <button className="btn btn-primary" onClick={handleLogin}>
          Login
        </button>

        {/* link */}
        <div className="link-box">
          <span className="link" onClick={() => setForgotMode(true)}>
            Quên mật khẩu
          </span>
        </div>
      </div>
    </div>
  );
}
