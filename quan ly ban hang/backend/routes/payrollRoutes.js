const express = require("express");
const router = express.Router();
const { createPayroll } = require("../controllers/payrollController");

router.post("/", createPayroll);

module.exports = router;
