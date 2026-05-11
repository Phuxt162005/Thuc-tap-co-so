require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./database");
const authRoutes = require("./routes/authRoutes");
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
app.use("/", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
