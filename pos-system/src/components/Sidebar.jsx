export default function Sidebar({ setActivePage }) {
  return (
    <div style={sidebar}>
      <h2>POS MENU</h2>

      <ul style={menu}>
        <li
          style={menuItem}
          onMouseOver={(e) => (e.target.style.background = "#1565c0")}
          onMouseOut={(e) => (e.target.style.background = "transparent")}
          onClick={() => setActivePage("dashboard")}
        >
          Dashboard
        </li>
        <li style={menuItem} onClick={() => setActivePage("sales")}>
          Bán hàng
        </li>
        <li style={menuItem} onClick={() => setActivePage("product")}>
          Sản phẩm
        </li>
        <li style={menuItem} onClick={() => setActivePage("inventory")}>
          Kho
        </li>
        <li style={menuItem} onClick={() => setActivePage("employee")}>
          Nhân viên
        </li>
        <li style={menuItem} onClick={() => setActivePage("branch")}>
          Chi nhánh
        </li>
        <li style={menuItem} onClick={() => setActivePage("report")}>
          Báo cáo
        </li>
      </ul>
    </div>
  );
}

const sidebar = {
  width: "220px",
  height: "100vh",
  background: "#1976d2",
  color: "white",
  padding: "20px",
};

const menu = {
  listStyle: "none",
  padding: 0,
  marginTop: "20px",
};

const menuItem = {
  padding: "10px",
  cursor: "pointer",
  borderRadius: "5px",
};
