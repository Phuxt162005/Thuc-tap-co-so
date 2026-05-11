const express = require("express");
const router = express.Router();
const {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} = require("../controllers/branchController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", auth, authorize("admin", "manager", "employee"), getBranches);
router.post("/", auth, authorize("admin"), createBranch);
router.put("/:id", auth, authorize("admin"), updateBranch);
router.delete("/:id", auth, authorize("admin"), deleteBranch);

module.exports = router;
