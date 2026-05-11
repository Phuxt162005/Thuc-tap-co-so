const authorize = (...roles) => {
  return (req, res, next) => {
    const allowedRoles = Array.isArray(roles[0]) ? roles[0] : roles;

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Không có quyền",
      });
    }

    next();
  };
};

module.exports = authorize;
