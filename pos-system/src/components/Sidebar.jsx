import bgrSidebar from "../assets/img/back-ground-login.jpg";

export default function Sidebar({
  activePage,
  setActivePage,
  setIsLogin,
  role,
  setRole,
}) {
  const menuItems =
    role === "admin"
      ? [
          { key: "employee", label: "Nhân viên" },
          { key: "branch", label: "Chi nhánh" },
        ]
      : role === "manager"
        ? [
            { key: "dashboard", label: "Thông tin bán hàng" },
            { key: "sales", label: "Bán hàng" },
            { key: "product", label: "Sản phẩm" },
            { key: "inventory", label: "Kho" },
            { key: "employee", label: "Nhân viên" },
            { key: "branch", label: "Chi nhánh" },
            { key: "report", label: "Báo cáo" },
          ]
        : [
            { key: "dashboard", label: "Thông tin bán hàng" },
            { key: "sales", label: "Bán hàng" },
            { key: "product", label: "Sản phẩm" },
            { key: "inventory", label: "Kho" },
            { key: "report", label: "Báo cáo" },
          ];
  return (
    <div style={sidebar}>
      {/* phần trên */}
      <div>
        <h2>MENU</h2>

        <ul style={menu}>
          {menuItems.map((item) => (
            <li
              key={item.key}
              style={{
                ...menuItem,
                background:
                  activePage === item.key
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
              }}
              onClick={() => setActivePage(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* logout ở dưới */}
      <button
        style={logoutBtn}
        onClick={() => {
          localStorage.removeItem("role");
          setRole("");
          setIsLogin(false);
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}

const sidebar = {
  width: "220px",
  height: "100vh",
  display: "flex",
  boxSizing: "border-box",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgrSidebar})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "white",
  padding: "20px",
};

const logoutBtn = {
  padding: "10px",
  background: "#1976d2",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const menu = {
  listStyle: "none",
  padding: 0,
  marginTop: "20px",
};

const menuItem = {
  padding: "12px",
  cursor: "pointer",
  borderRadius: "8px",
  marginBottom: "5px",
  transition: "0.2s",
};
