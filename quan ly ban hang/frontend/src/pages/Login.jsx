import { useState } from "react";
import backgrImg from "../assets/img/back-ground-login.jpg";
import ForgotPassword from "./ForgotPassword";

export default function Login({ setIsLogin, setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);

  // xử lý đăng nhập
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
      return;
    }

    try {
      // clear dữ liệu login cũ
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("branchId");
      localStorage.removeItem("employeeId");

      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Sai tài khoản hoặc mật khẩu");
        return;
      }

      localStorage.setItem("token", data.token || "");
      localStorage.setItem("role", data.role || "");
      localStorage.setItem("username", data.username || "");
      localStorage.setItem(
        "branchId",
        data.branchId ? String(data.branchId) : "",
      );
      localStorage.setItem(
        "employeeId",
        data.employeeId ? String(data.employeeId) : "",
      );

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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />

        {/* password */}
        <input
          className="input"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />

        {/* login */}
        <button className="btn btn-primary" onClick={handleLogin}>
          Login
        </button>

        {/* forgot password */}
        <div className="link-box">
          <span className="link" onClick={() => setForgotMode(true)}>
            Quên mật khẩu
          </span>
        </div>
      </div>
    </div>
  );
}
