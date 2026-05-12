const express = require("express");
const router = express.Router();
const { createPayroll } = require("../controllers/payrollController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.post("/", auth, authorize("admin", "manager"), createPayroll);

module.exports = router;
