import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function TopProductChart({ orders, products }) {
  const productMap = {};

  // gom dữ liệu product
  orders.forEach((order) => {
    if (!order.items) return;

    order.items.forEach((item) => {
      if (!productMap[item.productId]) {
        productMap[item.productId] = 0;
      }
      productMap[item.productId] += item.quantity;
    });
  });

  // sort top 5 sản phẩm
  const chartData = Object.keys(productMap)
    .map((id) => {
      const product = products.find((p) => p.productId === Number(id));

      return {
        name: product?.name || "unknown",
        quantity: productMap[id],
      };
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Các sản phẩm bán chạy</h3>

      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
