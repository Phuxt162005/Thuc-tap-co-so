import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ orders }) {
  const revenueByDate = {};

  orders.forEach((o) => {
    const date = new Date(o.date).toLocaleDateString("vi-VN");

    if (!revenueByDate[date]) {
      revenueByDate[date] = 0;
    }

    revenueByDate[date] += Number(o.total);
  });

  const chartData = Object.keys(revenueByDate).map((date) => ({
    date,
    revenue: revenueByDate[date],
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Doanh thu theo ngày</h3>

      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
