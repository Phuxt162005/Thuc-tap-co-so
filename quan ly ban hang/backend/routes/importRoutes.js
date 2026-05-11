const express = require("express");
const router = express.Router();
const { getImports, createImport } = require("../controllers/importController");

router.get("/", getImports);
router.post("/", createImport);

module.exports = router;
