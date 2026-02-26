const express = require("express");
const router = express.Router();

const { protect, allowRoles } = require("../middleware/auth.middleware");
const {
  getAllLeaves,
  updateLeaveStatus,
  getAllReimbursements,
  updateReimbursementStatus,
} = require("../controllers/manager.controller");


router.use(protect, allowRoles("MANAGER"));

router.get("/leaves", getAllLeaves);
router.patch("/leaves/:id", updateLeaveStatus);

router.get("/reimbursements", getAllReimbursements);
router.patch("/reimbursements/:id", updateReimbursementStatus);

module.exports = router;