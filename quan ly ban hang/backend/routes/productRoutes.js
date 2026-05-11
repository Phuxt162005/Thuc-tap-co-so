const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", auth, authorize("manager", "employee"), getProducts);
router.post("/", auth, authorize("manager"), createProduct);
router.put("/:id", auth, authorize("manager", "employee"), updateProduct);
router.delete("/:id", auth, authorize("manager"), deleteProduct);

module.exports = router;
