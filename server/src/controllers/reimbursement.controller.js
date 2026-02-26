const Reimbursement = require("../models/Reimbursement");
const supabase = require("../config/supabase");
const { v4: uuid } = require("uuid");

exports.applyReimbursement = async (req, res) => {
  try {
    const { amount, category, description } = req.body;

    if (!amount || !category || !req.file) {
      return res.status(400).json({
        message: "All fields and receipt are required",
      });
    }

    const fileExt = req.file.originalname.split(".").pop();
    const filePath = `${req.user._id}/${uuid()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("reimbursement")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("SUPABASE UPLOAD ERROR:", uploadError);
      return res.status(500).json({ message: "File upload failed" });
    }

    const reimbursement = await Reimbursement.create({
      employee: req.user._id,
      companyId: req.user.companyId,
      amount,
      category,
      description,
      receiptPath: filePath,
    });

    return res.status(201).json({
      message: "Reimbursement submitted successfully",
      reimbursement,
    });
  } catch (err) {
    console.error("APPLY REIMBURSEMENT ERROR:", err);
    return res.status(500).json({ message: "Reimbursement failed" });
  }
};

exports.getMyReimbursements = async (req, res) => {
  try {
    const reimbursements = await Reimbursement.find({
      employee: req.user._id,
    }).sort({ createdAt: -1 });

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
    console.error("GET REIMBURSEMENTS ERROR:", err);
    return res.status(500).json({
      message: "Failed to fetch reimbursements",
    });
  }
};