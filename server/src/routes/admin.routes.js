const express = require("express");
const router = express.Router();

const {
  adminDashboard,
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/admin.controller");

const { protect, allowRoles } = require("../middleware/auth.middleware");

router.use(protect, allowRoles("ADMIN"));

router.get("/dashboard", adminDashboard);
router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
