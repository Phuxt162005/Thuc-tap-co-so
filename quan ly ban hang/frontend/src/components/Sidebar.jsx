import bgrSidebar from "../assets/img/back-ground-login.jpg";

export default function Sidebar({
  activePage,
  setActivePage,
  setIsLogin,
  role,
  setRole,
  branches = [],
}) {
  const branchId = Number(localStorage.getItem("branchId"));

  const branch = branches.find((b) => Number(b.branchId) === branchId);

  console.log("branchId:", branchId);
  console.log("branches:", branches);
  console.log("branch:", branch);

  const branchName = role === "admin" ? "Admin" : branch?.name;

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
    <div
      className="sidebar"
      style={{
        backgroundImage: `url(${bgrSidebar})`,
      }}
    >
      <div>
        <h2>MENU</h2>

        <div
          style={{
            marginBottom: "20px",
            color: "#fff",
          }}
        >
          {role === "admin" ? "Admin" : `Chi nhánh: ${branchName}`}
        </div>

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

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          setRole("");
          setIsLogin(false);
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}
