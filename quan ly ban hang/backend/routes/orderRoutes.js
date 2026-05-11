const express = require("express");
const router = express.Router();
const { getOrders, createOrder } = require("../controllers/orderController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", auth, authorize("manager", "employee"), getOrders);
router.post("/", auth, authorize("manager", "employee"), createOrder);

module.exports = router;
