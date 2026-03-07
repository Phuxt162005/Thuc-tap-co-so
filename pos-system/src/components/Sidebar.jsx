export default function Sidebar({ setActivePage }) {
  return (
    <div style={sidebar}>
      <h2>POS MENU</h2>

      <ul style={menu}>
        <li onClick={() => setActivePage("dashboard")}>Dashboard</li>
        <li onClick={() => setActivePage("sales")}>Bán hàng</li>
        <li onClick={() => setActivePage("product")}>Sản phẩm</li>
        <li onClick={() => setActivePage("inventory")}>Kho</li>
        <li onClick={() => setActivePage("employee")}>Nhân viên</li>
        <li onClick={() => setActivePage("branch")}>Chi nhánh</li>
        <li onClick={() => setActivePage("report")}>Báo cáo</li>
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
