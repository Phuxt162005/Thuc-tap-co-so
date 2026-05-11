const database = require("../database");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/token");

// login
const login = (req, res) => {
  const { username, password } = req.body;

  const sql = `SELECT u.*, e.branchId
    FROM User u
    LEFT JOIN Employee e ON u.employeeId = e.employeeId
    WHERE u.username = ?`;

  database.query(sql, [username], async (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Lỗi server",
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Sai tài khoản hoặc mật khẩu",
      });
    }

    const user = result[0];

    const isMatch =
      password === user.password ||
      (await bcrypt.compare(password, user.password));

    if (!isMatch) {
      return res.status(401).json({
        message: "Sai tài khoản hoặc mật khẩu",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Đăng nhập thành công",
      token,
      role: user.role,
      username: user.username,
      branchId: user.branchId,
      employeeId: user.employeeId,
    });
  });
};

// forgot password
const forgotPassword = (req, res) => {
  const { username, phone } = req.body;

  const sql = `SELECT u.password
    FROM User u
    JOIN Employee e ON u.employeeId = e.employeeId
    WHERE u.username = ? AND e.phone = ?`;

  database.query(sql, [username, phone], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Lỗi server",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Sai username hoặc số điện thoại",
      });
    }

    res.json({
      password: result[0].password,
    });
  });
};

module.exports = { login, forgotPassword };
