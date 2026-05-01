import bgrSidebar from "../assets/img/back-ground-login.jpg";

export default function Sidebar({
  activePage,
  setActivePage,
  setIsLogin,
  role,
  setRole,
  employees,
  branches,
}) {
  const username = localStorage.getItem("username");

  const employee = employees?.find((e) => e.username === username);

  const branchName =
    role === "admin"
      ? "Admin"
      : branches?.find((b) => b.branchId === employee?.branchId)?.name;

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
    <div className="sidebar" style={{ backgroundImage: `url(${bgrSidebar})` }}>
      {/* phần trên */}
      <div>
        <h2>MENU</h2>

        {role !== "admin" && (
          <div style={{ marginBottom: "20px", color: "#fff" }}>
            Chi nhánh: {branchName || "Không xác định"}
          </div>
        )}

        {role === "admin" && <div>Admin</div>}

        <ul className="menu">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={`menu-item ${activePage === item.key ? "active" : ""}`}
              onClick={() => setActivePage(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* logout ở dưới */}
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("role");
          localStorage.removeItem("username");
          setRole("");
          setIsLogin(false);
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}
