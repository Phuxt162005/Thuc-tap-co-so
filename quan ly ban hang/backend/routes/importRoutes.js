const express = require("express");
const router = express.Router();
const { getImports, createImport } = require("../controllers/importController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", auth, authorize("manager", "employee"), getImports);
router.post("/", auth, authorize("manager"), createImport);

module.exports = router;
