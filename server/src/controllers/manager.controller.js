const Leave = require("../models/Leave");
const Reimbursement = require("../models/Reimbursement");
const supabase = require("../config/supabase");


exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      companyId: req.user.companyId,
    })
      .populate("employeeId") 
      .lean();             

    console.log(
      leaves.map(l => ({
        id: l._id,
        employeeId: l.employeeId,
        employeeIdType: typeof l.employeeId,
      }))
    );

    res.json({ leaves });
  } catch (err) {
    console.error("GET ALL LEAVES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
};
exports.updateLeaveStatus = async (req, res) => {
  const { status } = req.body;

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ message: "Leave updated", leave });
  } catch (err) {
    res.status(500).json({ message: "Failed to update leave" });
  }
};

exports.getAllReimbursements = async (req, res) => {
  try {
    const reimbursements = await Reimbursement.find({
      companyId: req.user.companyId,
    })
      .populate("employee", "name email") 
      .sort({ createdAt: -1 });

  
    const enrichedReimbursements = await Promise.all(
      reimbursements.map(async (r) => {
        let receiptUrl = null;

        if (r.receiptPath) {
          const { data, error } = await supabase.storage
            .from("reimbursement")
            .createSignedUrl(r.receiptPath, 60 * 10);

          if (error) {
            console.error("SIGNED URL ERROR:", error);
          } else {
            receiptUrl = data.signedUrl;
          }
        }

        return {
          ...r.toObject(),
          receiptUrl,
        };
      })
    );

    return res.status(200).json({
      reimbursements: enrichedReimbursements,
    });
  } catch (err) {
    console.error("GET ALL REIMBURSEMENTS ERROR:", err);
    return res.status(500).json({
      message: "Failed to fetch reimbursements",
    });
  }
};
exports.updateReimbursementStatus = async (req, res) => {
  const { status } = req.body;

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const reimbursement = await Reimbursement.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ message: "Reimbursement updated", reimbursement });
  } catch (err) {
    res.status(500).json({ message: "Failed to update reimbursement" });
  }
};