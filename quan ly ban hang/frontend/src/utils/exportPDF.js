import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = (orders) => {
  const doc = new jsPDF();

  // tiêu đề
  doc.setFontSize(18);
  doc.text("Báo cáo bán hàng", 14, 20);

  // tổng doanh thu
  const total = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  doc.setFontSize(12);
  doc.text(`Tổng doanh thu: ${total.toLocaleString()} VNĐ`, 14, 30);

  // bảng dữ liệu
  const tableData = orders.map((o) => [
    o.invoiceId,
    new Date(o.date).toLocaleDateString("vi-VN"),
    o.items?.map((i) => `${i.name} x${i.quantity}`).join(", "),
    o.total,
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["Mã đơn", "Ngày", "Sản phẩm", "Tổng tiền"]],
    body: tableData,
  });

  doc.save(`Báo cáo ${new Date().toISOString()}.pdf`);
};
