const Leave = require("../models/Leave");

exports.applyLeave = async (req, res) => {
  try {
   

    const payload = {
      employeeId: req.user?._id,
      companyId: req.user?.companyId,
      type: req.body.type,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reason: req.body.reason,
    };

    console.log("PAYLOAD SENT TO MONGOOSE:", payload);

    const leave = await Leave.create(payload);

    return res.status(201).json({ leave });
  } catch (error) {
  console.error("APPLY LEAVE ERROR FULL:", error);
  console.error("BODY:", req.body);
  console.error("USER:", req.user);
  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });

  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const leaves = await Leave.find({ employeeId })
      .sort({ createdAt: -1 });

    res.status(200).json({ leaves });
  } catch (error) {
    console.error("GET LEAVES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};