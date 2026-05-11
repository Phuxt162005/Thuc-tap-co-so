const express = require("express");
const router = express.Router();
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", auth, authorize("admin", "manager"), getEmployees);
router.post("/", auth, authorize("admin", "manager"), createEmployee);
router.put("/:id", auth, authorize("admin", "manager"), updateEmployee);
router.delete("/:id", auth, authorize("admin", "manager"), deleteEmployee);

module.exports = router;
