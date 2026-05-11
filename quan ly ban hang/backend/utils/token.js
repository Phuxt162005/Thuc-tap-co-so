const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.userId,
      employeeId: user.employeeId,
      username: user.username,
      role: user.role,
      branchId: user.branchId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    },
  );
};

module.exports = generateToken;
