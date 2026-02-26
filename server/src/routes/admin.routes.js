const express = require("express");
const router = express.Router();

const { adminDashboard } = require("../controllers/admin.controller");
const { protect, allowRoles } = require("../middleware/auth.middleware");
console.log("protect:", protect);
console.log("allowRoles:", allowRoles);
console.log("adminDashboard:", adminDashboard);

router.get(
  "/dashboard",
  protect,
  allowRoles("ADMIN"),
  adminDashboard
);

module.exports = router;