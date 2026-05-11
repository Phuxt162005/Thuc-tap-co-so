require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("./database");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const branchRoutes = require("./routes/branchRoutes");
const orderRoutes = require("./routes/orderRoutes");
const importRoutes = require("./routes/importRoutes");
const payrollRoutes = require("./routes/payrollRoutes");

const app = express();

app.use(cors());

app.use(
  bodyParser.json({
    limit: "50mb",
  }),
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  }),
);

// test
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/employees", employeeRoutes);
app.use("/branches", branchRoutes);
app.use("/orders", orderRoutes);
app.use("/imports", importRoutes);
app.use("/payroll", payrollRoutes);

// route không tồn tại
app.use((req, res) => {
  res.status(404).json({
    message: "API không tồn tại",
  });
});

// server error
app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    message: "Lỗi server",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
