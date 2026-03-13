import { useState } from "react";
import backgrImg from "../assets/img/back-ground-login.jpg";

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
    <div style={wrapper}>
      <div style={background}></div>

      <div style={container}>
        <h1 style={title}>Quản lý bán hàng</h1>
        <h2 style={subtitle}>Đăng nhập</h2>

        <input
          style={input}
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={button} onClick={handleLogin}>
          Login
        </button>

        <div style={linkBox}>
          <span
            style={link}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Đăng ký
          </span>
          <span
            style={link}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Quên mật khẩu
          </span>
        </div>
      </div>
    </div>
  );
}

const container = {
  position: "relative",
  zIndex: 2,
  width: "350px",
  padding: "40px",
  background: "rgba(255,255,255,0.9)",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
};

const wrapper = {
  position: "relative",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
};

const background = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `url(${backgrImg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "blur(6px)",
  zIndex: 1,
};

const input = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #555",
  background: "#ddd",
  color: "black",
};

const button = {
  padding: "10px",
  border: "none",
  borderRadius: "5px",
  background: "#1976d2",
  color: "white",
  cursor: "pointer",
};

const title = {
  textAlign: "center",
  fontSize: "32px",
  marginBottom: "10px",
};

const subtitle = {
  textAlign: "center",
  fontSize: "22px",
  marginBottom: "10px",
};

const linkBox = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "5px",
};

const link = {
  fontSize: "14px",
  color: "#1976d2",
  cursor: "pointer",
};
