import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function TopProductChart({ orders, products }) {
  if (!orders || !products) {
    return <div>Không có dữ liệu</div>;
  }

  const productMap = {};

  // count quantity
  orders.forEach((order) => {
    if (!order.items) return;

    order.items.forEach((item) => {
      if (!productMap[item.productId]) {
        productMap[item.productId] = 0;
      }

      productMap[item.productId] += item.quantity;
    });
  });

  // top 5
  const chartData = Object.keys(productMap)
    .map((id) => {
      const product = products.find((p) => p.productId === Number(id));

      return {
        name: product?.name || "Unknown",
        quantity: productMap[id],
      };
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // COLORS
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h3>Các sản phẩm bán chạy</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="quantity">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
