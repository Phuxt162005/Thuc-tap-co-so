import { useState } from "react";
import backgrImg from "../assets/img/back-ground-login.jpg";

export default function ForgotPassword({ setForgotMode }) {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  const handleForgotPassword = async () => {
    if (!username.trim() || !phone.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Không tìm thấy tài khoản");
        return;
      }

      alert(`Mật khẩu của bạn là: ${data.password}`);

      setForgotMode(false);
    } catch (err) {
      console.log(err);
      alert("Lỗi server");
    }
  };

  return (
    <div className="login-wrapper">
      <div
        className="login-background"
        style={{
          backgroundImage: `url(${backgrImg})`,
        }}
      ></div>

      <div className="login-container forgot-container">
        <h1 className="login-title">Quên mật khẩu</h1>

        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleForgotPassword();
            }
          }}
        />

        <input
          className="input"
          type="tel"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleForgotPassword();
            }
          }}
        />

        <button className="btn btn-primary" onClick={handleForgotPassword}>
          Lấy lại mật khẩu
        </button>

        <button
          className="btn"
          style={{
            marginTop: "10px",
          }}
          onClick={() => setForgotMode(false)}
        >
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
}
