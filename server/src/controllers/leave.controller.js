const Leave = require("../models/Leave");

exports.applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    const employeeId = req.user._id;
    const companyId = req.user.companyId;

    const leave = await Leave.create({
      employeeId,
      companyId,
      type,       
      startDate,
      endDate,
      reason,
    });

    res.status(201).json(leave);
  } catch (error) {
    console.error("APPLY LEAVE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};