import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// import font
import "../fonts/times-normal";

export const exportPDF = (orders) => {
  try {
    const doc = new jsPDF();

    // dùng font tiếng Việt
    doc.setFont("times", "normal");

    // tiêu đề
    doc.setFontSize(20);
    doc.text("Báo cáo bán hàng", 14, 20);

    // tổng doanh thu
    const total = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    doc.setFontSize(12);
    doc.text(`Tổng doanh thu: ${total.toLocaleString("vi-VN")} VNĐ`, 14, 30);

    // table data
    const tableData = orders.map((o) => [
      o.invoiceId,
      new Date(o.date).toLocaleDateString("vi-VN"),
      o.employeeName || "Không xác định",
      o.items?.map((i) => `${i.name} x${i.quantity}`).join(", "),
      Number(o.total || 0).toLocaleString("vi-VN") + " VNĐ",
    ]);

    autoTable(doc, {
      startY: 40,

      head: [["Mã đơn", "Ngày", "Người tạo", "Sản phẩm", "Tổng tiền"]],

      body: tableData,

      // QUAN TRỌNG
      styles: {
        font: "times",
        fontStyle: "normal",
      },

      headStyles: {
        font: "times",
        fontStyle: "normal",
      },
    });

    doc.save("report.pdf");
  } catch (err) {
    console.error(err);
    alert("Lỗi xuất PDF");
  }
};
