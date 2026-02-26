const express = require("express");
const router = express.Router();

const { protect, allowRoles } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
  applyLeave,
  getMyLeaves,
} = require("../controllers/employee.controller");

const {
  applyReimbursement,
  getMyReimbursements,
} = require("../controllers/reimbursement.controller");

router.use(protect, allowRoles("EMPLOYEE"));

router.post("/leaves", applyLeave);
router.get("/leaves", getMyLeaves);

router.post("/reimbursements", upload.single("receipt"), applyReimbursement);

router.get("/reimbursements", getMyReimbursements);

module.exports = router;
